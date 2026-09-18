---
title: SPARQL Endpoint (Oxigraph)
description: W3C SPARQL 1.1 Protocol endpoint for semantically querying the Katalon knowledge graph via the built-in triple store.
---

:::note[Available from version 1.19.20]
:::

Alongside full-text and facet search in Elasticsearch, Katalon offers an **optional linked data layer** with a native **SPARQL 1.1** interface. The high-performance open-source graph database **Oxigraph** is used as the triple store.

The relational PostgreSQL database remains the sole source of truth at all times; Oxigraph serves as an asynchronously synchronized, read-only RDF projection of all publicly published records.


---

## Concept: Relational MMS with RDF Projection (vs. Wikibase)

When evaluating linked data and SPARQL in Katalon, the architectural direction matters: **Katalon works exactly the opposite way from a native graph store or Wikibase.**

### 1. The relational database comes first, for everyday collection work

At the center is a fast, consistent, and easy-to-use collection management system (MMS) built on PostgreSQL and Elasticsearch:

- **7 fixed GLAM core types:** Objects, Actors/Corporate Bodies, Places, Occurrences/Works, Collections, Storage Locations, and Procedures form the stable core structure.
- **Pragmatic schema engine:** Fields (`field_definitions`), subtypes, and controlled vocabularies (`skos:Concept`) are configured administratively through the interface and directly drive the input forms.
- **Relation network:** Cross-type relationships between records carry type codes and metadata (JSONB).
- **Full text & facets:** Elasticsearch provides the high-performance search and filter layer for the portal and admin area.

### 2. Automatic RDF projection instead of native triple capture

Instead of capturing raw data directly as triples (subject, predicate, object), Katalon generates the knowledge graph fully automatically as an asynchronous projection into Oxigraph.

This reflects GLAM practice: hardly any museum captures native CIDOC-CRM triples directly in day-to-day work (`E22 Human-Made Object → P108i → E12 Production → P14 → E21 Person`). The real data flow in the cultural heritage sector almost always runs through local systems and intermediate exchange formats:

```text
Local system (Katalon / MuseumPlus / Alma)
        ↓  (relational, institution-specific data model)
Exchange format (LIDO / MARCXML / EAD / Dublin Core)
        ↓
Aggregator (DDB / Europeana)
        ↓  (central harmonization, normalization & enrichment)
EDM / RDF / Knowledge Graph
```

Aggregators such as the Deutsche Digitale Bibliothek (DDB) transform heterogeneous deliveries into RDF/EDM after the fact. Katalon builds the bridge in-house from the start: **a simple relational cataloguing model for everyday work, with automatic projection to CIDOC-CRM and LRMoo happening in the background.**

### 3. Consequence: free modeling and the limits of SPARQL

Katalon lets you configure schema fields completely freely. For output via SPARQL, however, this freedom has a direct consequence:

**The SPARQL endpoint can only link structures as a graph that were set up as a relation, entity, or vocabulary in the relational model.**

Katalon deterministically translates the captured primary types and relations into RDF classes and predicates. If the relational structure is missing in the raw data, the RDF projection cannot work miracles either.

#### Free text versus relational network compared

- **Scenario A: free text on the object (a dead end for SPARQL)**
  If authorship is captured as a simple text field on the object (e.g. `kuenstler = "Marta Keller, Munich"`), this value ends up in the triple store as nothing more than a flat literal on the object URI.
  *Consequence:* A SPARQL query for all objects by artists from a given place, or a link to GND and Wikidata, is **impossible**. The graph contains neither an actor node nor a place node that could be filtered or traversed.

- **Scenario B: modeled relationally (a true knowledge graph)**
  The object is linked via a typed relation (`created by`) to a record of type **Entity** (person). The person has a GND URI and is in turn connected via a relation to the **Place** (Munich).
  *Consequence:* Katalon projects clean CIDOC-CRM nodes and predicates:
  ```sparql
  # Returns all objects by actors with a residence or place of activity
  SELECT ?object ?actor ?place WHERE {
    ?object crm:P14_carried_out_by ?actor .
    ?actor  crm:P74_has_current_or_former_residence ?place .
  }
  ```

#### Guidelines for a SPARQL-capable schema

1. **Actors and places as their own records:** don't bury people, corporate bodies, and places in free-text fields — model them as linked entities (`entity`, `place`).
2. **Use typed relations:** name relations precisely (`created by`, `exhibited in`). Katalon automatically maps typed relations to specific CRM predicates (`crm:P14_carried_out_by`, `crm:P7_took_place_at`, `crm:P138_represents`).
3. **Controlled vocabularies for types:** use vocabularies for object types, techniques, and roles. These are projected as `skos:Concept` and allow hierarchical graph queries (`skos:broader*`).
4. **Record authority data and PIDs:** capture GND, Wikidata, or AAT IDs on the record. Katalon generates `owl:sameAs` and authority-data triples for the Semantic Web from these.

---

## Architecture & synchronization

- **Named graphs:** every publicly visible record (`status: "public"`) is held as its own named graph in Oxigraph:
  ```text
  urn:katalon:graph:<record_type>:<uuid>
  ```
  Example: `urn:katalon:graph:object:550e8400-e29b-41d4-a716-446655440000`.
- **Real-time updates:** when a record is created, updated, or deleted, a Celery background task (`sync_rdf_record_task` or `remove_rdf_record_task`) synchronizes the corresponding named graph atomically via the W3C Graph Store Protocol (`PUT` / `DELETE`).
- **Visibility protection:** non-public drafts or internal records are never transferred to the triple store. If a published record is reverted to `draft` or `internal`, its graph is immediately removed from Oxigraph.
- **Resource-friendly:** if the option `OXIGRAPH_ENABLED=false` is configured, the system produces no background overhead at all (zero-clutter principle).

---

## Endpoint & protocol

The SPARQL endpoint implements the standardized **W3C SPARQL 1.1 Protocol**.

| Property | Value |
|---|---|
| **Canonical URL** | `https://katalon.example.org/sparql` |
| **API path (alias)** | `https://katalon.example.org/api/v1/sparql` |
| **Protocol** | SPARQL 1.1 Query |
| **Allowed operations** | `SELECT`, `CONSTRUCT`, `DESCRIBE`, `ASK` |
| **Write operations** | Strictly rejected (`INSERT`, `DELETE`, `DROP`, etc.) |

### HTTP GET

Queries can be submitted via HTTP GET with the URL parameter `query`:

```bash
curl -G "https://katalon.example.org/sparql" \
  --data-urlencode "query=SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10" \
  -H "Accept: application/sparql-results+json" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### HTTP POST (form-encoded)

For longer queries, POST with `Content-Type: application/x-www-form-urlencoded` is recommended:

```bash
curl -X POST "https://katalon.example.org/sparql" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/sparql-results+json" \
  -H "X-API-Key: <your-api-key>" \
  --data-urlencode "query=SELECT ?class (COUNT(?s) AS ?count) WHERE { ?s a ?class } GROUP BY ?class"
```

### HTTP POST (direct SPARQL query)

Alternatively, the query can be submitted directly in the request body with `Content-Type: application/sparql-query`:

```bash
curl -X POST "https://katalon.example.org/sparql" \
  -H "Content-Type: application/sparql-query" \
  -H "Accept: text/turtle" \
  -H "Authorization: Bearer <your-jwt-token>" \
  --data 'DESCRIBE <https://katalon.example.org/objects/550e8400-e29b-41d4-a716-446655440000>'
```

---

## Authentication & access protection

Access to the SPARQL endpoint is protected by default:

1. **Authentication required (`SPARQL_REQUIRE_AUTH=true`):**
   - Every request must submit either a valid JWT bearer token (`Authorization: Bearer <token>`) or a valid API key (`X-API-Key: <key>`).
   - Unauthenticated requests are rejected with `401 Unauthorized`.
2. **Public access (`SPARQL_REQUIRE_AUTH=false`):**
   - For open-data portals, the operator can make the endpoint public in `.env`. Since the triple store only ever holds published data anyway, this mode is safe.

---

## Protection against overload & abuse

The endpoint has built-in security mechanisms:

- **Read-only guard:** every incoming query is checked via an AST parser (`rdflib`). Write operations (`INSERT`, `DELETE`, `CLEAR`, `DROP`, `LOAD`, `CREATE`) or chained multi-statements are immediately rejected with `400 Bad Request`.
- **Size limit:** requests exceeding `SPARQL_MAX_QUERY_LENGTH` (default: 64 KB) are rejected with `413 Content Too Large`.
- **Timeout:** queries are aborted server-side after `SPARQL_QUERY_TIMEOUT` (default: 30 seconds) elapses (`504 Gateway Timeout`).
- **Rate limiting:** the endpoint is rate-limited per IP or token (`RATE_LIMIT_SPARQL`, default: `60/minute`).

---

## Result formats (content negotiation)

The desired output format can be selected via the `Accept` HTTP header:

### For `SELECT` and `ASK` queries:
- `application/sparql-results+json` (default)
- `application/sparql-results+xml`
- `text/csv`
- `text/tab-separated-values`

### For `CONSTRUCT` and `DESCRIBE` queries:
- `text/turtle` (default)
- `application/ld+json`
- `application/n-triples`
- `application/rdf+xml`

---

## Ontologies & prefixes used

Records are modeled according to the **CIDOC-CRM** (ISO 21127), **LRMoo**, and **SKOS** standards:

```sparql
PREFIX crm:     <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX lrmoo:   <http://iflastandards.info/ns/lrm/lrmoo/>
PREFIX skos:    <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>
```

---

## Example queries

### 1. List all published objects with titles

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?object ?title WHERE {
  ?object a crm:E22_Human-Made_Object ;
          crm:P102_has_title / rdfs:label ?title .
}
LIMIT 50
```

### 2. Objects and involved persons / corporate bodies

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?object ?title ?actorName WHERE {
  ?object a crm:E22_Human-Made_Object ;
          crm:P102_has_title / rdfs:label ?title ;
          crm:P14_carried_out_by ?actor .
  ?actor rdfs:label ?actorName .
}
LIMIT 50
```

### 3. Count records per RDF class

```sparql
SELECT ?class (COUNT(?instance) AS ?count) WHERE {
  ?instance a ?class .
}
GROUP BY ?class
ORDER BY DESC(?count)
```

### 4. Extract the subgraph of a specific record (`CONSTRUCT`)

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>

CONSTRUCT {
  ?object ?p ?o .
} WHERE {
  GRAPH ?g {
    ?object ?p ?o .
  }
  FILTER(?object = <https://katalon.example.org/objects/550e8400-e29b-41d4-a716-446655440000>)
}
```

---

## Management in the admin area

In the Admin UI, administrators have access to the **Linked Data & SPARQL** section under **Settings**:

- **Status indicator:** shows whether Oxigraph is active and reachable.
- **Triple counter:** current total number of indexed triples in the triple store.
- **Endpoint URL:** direct link and copy button for the interface.
- **Rebuild index:** clicking *"Rebuild RDF index"* triggers an asynchronous Celery task (`rebuild_rdf_all_task`) in the background that re-materializes all published records from PostgreSQL into Oxigraph.

For server configuration and the Docker setup, see [Production operation: setting up RDF projection & SPARQL](/katalon-docs/en/administration/production/#optional-rdf-projection--sparql-interface-oxigraph).
