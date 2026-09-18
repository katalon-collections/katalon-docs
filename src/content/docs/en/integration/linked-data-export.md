---
title: Linked Data Export (JSON-LD & RDF)
description: Semantic export of collection data to CIDOC-CRM and LRMoo as JSON-LD and Turtle.
---

:::note[Available from version 1.17.2]
:::

Katalon has a semantic RDF and JSON-LD serializer that automatically maps collection data to the international ontologies **CIDOC-CRM** (ISO 21127) and **LRMoo** (Library Reference Model - object-oriented).

The export is available via the REST API, through content negotiation, via the OAI-PMH interface, and via the built-in [SPARQL endpoint (Oxigraph)](/katalon-docs/en/integration/sparql/).


:::tip[Architecture principle: relational MMS with RDF projection]
Katalon is primarily a relational collection management system, not a native graph store. Data is pragmatically captured through relational forms; the semantic modeling in CIDOC-CRM/LRMoo and its delivery via RDF/SPARQL happens as an automated projection. See [Concept in the SPARQL chapter](/katalon-docs/en/integration/sparql/#concept-relational-mms-with-rdf-projection-vs-wikibase) for details.
:::
---

## Semantic modeling

By default, Katalon's primary types and relations are mapped to CIDOC-CRM and LRMoo as follows:

### Primary types

| Katalon type / subtype | RDF classes |
|---|---|
| `object` | `crm:E22_Human-Made_Object`, `lrmoo:F5_Item` |
| `occurrence` (subtype `work`) | `lrmoo:F1_Work` |
| `occurrence` (subtype `expression`) | `lrmoo:F2_Expression` |
| `occurrence` (subtype `manifestation`) | `lrmoo:F3_Manifestation` |
| `occurrence` (subtype `event` or other) | `crm:E5_Event` |
| `entity` (person) | `crm:E21_Person` |
| `entity` (corporate body / organization) | `crm:E74_Group` |
| `place` | `crm:E53_Place` |

### Relations

Relationships between records are automatically translated into matching semantic predicates:

- `lrmoo:R3_is_realised_in` (Work → Expression)
- `lrmoo:R4_is_embodied_in` (Expression → Manifestation)
- `lrmoo:R7_exemplifies` (Item/Object → Manifestation)
- `crm:P14_carried_out_by` (actors / participants)
- `crm:P138_represents` (depicted entities / subjects)
- `crm:P7_took_place_at` (event places)
- `crm:P67_refers_to` (general references)

Incoming relationships are automatically mapped with the corresponding inverse predicates.

#### Custom RDF properties for relation types

In the Admin UI under **Configuration → Vocabularies**, on the `relation_types` system vocabulary, you can set an individual **RDF property URI** for each relation type. The serializer then prefers this URI on export.

### Vocabularies as `skos:Concept`

Classifying fields and vocabularies are not exported as plain text literals only. If a term has a canonical URI or `exactMatch` references, it is serialized in the JSON-LD as a full `skos:Concept` node under `crm:P2_has_type`.

---

## Retrieval via the REST API

### Explicit export endpoint

Each primary type has its own export endpoint:

```bash
# JSON-LD export for an object
curl "https://katalon.example.org/api/v1/objects/{id}/export?format=jsonld"

# Turtle (TTL) export for a place
curl "https://katalon.example.org/api/v1/places/{id}/export?format=turtle"
```

Supported formats (`?format=`):
- `jsonld` or `json-ld` (MIME type: `application/ld+json`)
- `turtle` or `ttl` (MIME type: `text/turtle`)

### Content negotiation

Katalon supports content negotiation directly on the standard record endpoints. Clients can request the desired semantic format via the `Accept` HTTP header:

```bash
# Requests JSON-LD from the standard object endpoint
curl -H "Accept: application/ld+json" \
  "https://katalon.example.org/api/v1/objects/{id}"

# Requests Turtle from the standard entity endpoint
curl -H "Accept: text/turtle" \
  "https://katalon.example.org/api/v1/entities/{id}"
```

Without a matching RDF Accept header, the endpoint returns the usual application JSON.

:::note[Available from version 1.19.7]
These export endpoints do not require an API key — any record with status `public` can be freely retrieved. For bulk-style automated harvesting of individual records, the endpoints are rate-limited per IP (operator configuration `RATE_LIMIT_PUBLIC_EXPORT`, default `30/minute`); for mass queries, [OAI-PMH](/katalon-docs/en/integration/oai-pmh/) is the intended route. Details: [Production operation: access protection for public endpoints](/katalon-docs/en/administration/production/#access-protection-for-public-endpoints).
:::

---

## Retrieval via OAI-PMH

The semantic export is fully integrated into the OAI-PMH interface.

Via `metadataPrefix=json_ld` (or short `jsonld`), harvesters can query collection data in JSON-LD format:

```text
https://katalon.example.org/oai?verb=GetRecord&identifier=oai:katalon:object:{id}&metadataPrefix=json_ld
```

Or for mass retrieval of entire sets:

```text
https://katalon.example.org/oai?verb=ListRecords&metadataPrefix=json_ld
```

The format is registered in the OAI-PMH `ListMetadataFormats` response and references the CIDOC-CRM/LRMoo JSON-LD schema.

---

## SPARQL endpoint

For complex research queries and cross-type graph analysis, the built-in triple store is available:

👉 See [SPARQL endpoint (Oxigraph)](/katalon-docs/en/integration/sparql/) for documentation of the W3C SPARQL 1.1 interface, authentication, query examples, and named graphs.
