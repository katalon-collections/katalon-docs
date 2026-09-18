---
title: REST API
description: Search, read, filter, and export data from Katalon as linked data via the REST API.
---

Katalon exposes all data via a versioned REST API under `/v1`. The complete machine-readable documentation (OpenAPI/Swagger) runs interactively in every installation at:

```text
https://katalon.example.org/api/docs
https://katalon.example.org/api/redoc
```

## Authentication

Public requests (`portal` or anonymous access) only see records with status `public`.

Two authentication methods are available for internal or protected requests:

```http
Authorization: Bearer <jwt-token>
```

or:

```http
X-API-Key: <api-key>
```

API keys can be created in the Admin UI per user account with specific permissions.

:::note[Available from version 1.19.7]
Public/anonymous endpoints are rate-limited per IP address (operator configuration, see [Production operation: access protection for public endpoints](/katalon-docs/en/administration/production/#access-protection-for-public-endpoints)); the API responds with HTTP 429 when the limit is exceeded.
:::

---

## Search

The central entry point for external clients and search queries is `/v1/search`.

```bash
curl "https://katalon.example.org/v1/search?q=foto&type=object&page=1&page_size=20"
```

Response:

```json
{
  "total": 12,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "record_type": "object",
      "title": "Street in Marrakesh",
      "status": "public",
      "score": 1.0
    }
  ],
  "facets": {}
}
```

### Filter parameters

| Parameter | Meaning |
| --- | --- |
| `q` | Full-text search term |
| `type` | `object`, `entity`, `place`, `occurrence`, `procedure`, `collection` |
| `status` | `draft`, `internal`, `public` |
| `page` / `page_size` | Pagination |
| `facets` | Comma-separated metadata fields for aggregations |
| `meta_<field>` | Filter on dynamic metadata fields (e.g. `meta_material=papier`) |

---

## Retrieving a record

A record is loaded via the corresponding type endpoint by UUID:

```bash
curl "https://katalon.example.org/v1/objects/550e8400-e29b-41d4-a716-446655440000"
```

Response structure:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "idno": "OBJ-0001",
  "object_type": "photograph",
  "collection_status": "active",
  "status": "public",
  "metadata_": {
    "title": [{"value": "Street in Marrakesh", "lang": "de"}],
    "date": [{"value": "1932"}],
    "rights": [{"value": "CC BY 4.0"}]
  },
  "created_at": "2026-07-01T10:00:00",
  "updated_at": "2026-07-01T10:00:00"
}
```

The structure of `metadata_` flexibly follows the schema fields configured in the respective Katalon instance.

---

## Primary type endpoints

| Record type | List endpoint | Detail endpoint |
| --- | --- | --- |
| **Object** (`object`) | `GET /v1/objects` | `GET /v1/objects/{id}` |
| **Entity** (`entity`) | `GET /v1/entities` | `GET /v1/entities/{id}` |
| **Place** (`place`) | `GET /v1/places` | `GET /v1/places/{id}` |
| **Occurrence** (`occurrence`) | `GET /v1/occurrences` | `GET /v1/occurrences/{id}` |
| **Procedure** (`procedure`) | `GET /v1/procedures` | `GET /v1/procedures/{id}` |
| **Collection** (`collection`) | `GET /v1/collections` | `GET /v1/collections/{id}` |
| **Storage location** (`storage_location`) | `GET /v1/storage-locations` | `GET /v1/storage-locations/{id}` |

---

## Semantic linked data export & content negotiation

Katalon supports the direct export of records in the standard ontologies **CIDOC-CRM** and **LRMoo**:

### Explicit export

```bash
# JSON-LD export
curl "https://katalon.example.org/api/v1/objects/{id}/export?format=jsonld"

# Turtle (TTL) export
curl "https://katalon.example.org/api/v1/objects/{id}/export?format=turtle"
```

### Content negotiation

Clients can also request the semantic data model directly via the `Accept` HTTP header:

```bash
curl -H "Accept: application/ld+json" "https://katalon.example.org/v1/objects/{id}"
curl -H "Accept: text/turtle" "https://katalon.example.org/v1/objects/{id}"
```

See [Linked Data Export (JSON-LD & RDF)](/katalon-docs/en/integration/linked-data-export/) for full details on RDF classes, predicates, and vocabulary convergence.

---

## Other interfaces

- [Linked Data Export (JSON-LD & RDF)](/katalon-docs/en/integration/linked-data-export/)
- [OAI-PMH Interface](/katalon-docs/en/integration/oai-pmh/)
- [Export Mappings](/katalon-docs/en/integration/export-mappings/)
