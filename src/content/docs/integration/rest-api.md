---
title: REST API
description: Daten aus Katalon per REST API suchen, lesen, filtern und als Linked Data exportieren.
---

Katalon stellt alle Daten über eine versionierte REST API unter `/v1` bereit. Die vollständige maschinenlesbare Dokumentation (OpenAPI/Swagger) läuft in jeder Installation interaktiv unter:

```text
https://katalon.example.org/api/docs
https://katalon.example.org/api/redoc
```

## Authentifizierung

Öffentliche Anfragen (`portal`- oder anonyme Zugriffe) sehen ausschließlich Datensätze mit dem Status `public`.

Für interne oder geschützte Anfragen stehen zwei Authentifizierungswege zur Verfügung:

```http
Authorization: Bearer <jwt-token>
```

oder:

```http
X-API-Key: <api-key>
```

API-Keys können in der Admin-Oberfläche pro Benutzerkonto mit spezifischen Rechten erzeugt werden.

---

## Suche

Der zentrale Einstiegspunkt für externe Clients und Suchanfragen ist `/v1/search`.

```bash
curl "https://katalon.example.org/v1/search?q=foto&type=object&page=1&page_size=20"
```

Antwort:

```json
{
  "total": 12,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "record_type": "object",
      "title": "Straße in Marrakesch",
      "status": "public",
      "score": 1.0
    }
  ],
  "facets": {}
}
```

### Filter-Parameter

| Parameter | Bedeutung |
| --- | --- |
| `q` | Volltextsuchbegriff |
| `type` | `object`, `entity`, `place`, `occurrence`, `procedure`, `collection` |
| `status` | `draft`, `internal`, `public` |
| `page` / `page_size` | Pagination |
| `facets` | Kommaseparierte Metadatenfelder für Aggregationen |
| `meta_<feld>` | Filter auf dynamische Metadatenfelder (z. B. `meta_material=papier`) |

---

## Datensatz abrufen

Ein Datensatz wird über den entsprechenden Typ-Endpunkt per UUID geladen:

```bash
curl "https://katalon.example.org/v1/objects/550e8400-e29b-41d4-a716-446655440000"
```

Antwortstruktur:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "idno": "OBJ-0001",
  "object_type": "photograph",
  "collection_status": "active",
  "status": "public",
  "metadata_": {
    "title": [{"value": "Straße in Marrakesch", "lang": "de"}],
    "date": [{"value": "1932"}],
    "rights": [{"value": "CC BY 4.0"}]
  },
  "created_at": "2026-07-01T10:00:00",
  "updated_at": "2026-07-01T10:00:00"
}
```

Die Struktur von `metadata_` richtet sich flexibel nach den in der jeweiligen Katalon-Instanz konfigurierten Schemafeldern.

---

## Primärtyp-Endpunkte

| Datensatztyp | Listen-Endpunkt | Detail-Endpunkt |
| --- | --- | --- |
| **Objekt** (`object`) | `GET /v1/objects` | `GET /v1/objects/{id}` |
| **Entität** (`entity`) | `GET /v1/entities` | `GET /v1/entities/{id}` |
| **Ort** (`place`) | `GET /v1/places` | `GET /v1/places/{id}` |
| **Ereignis** (`occurrence`) | `GET /v1/occurrences` | `GET /v1/occurrences/{id}` |
| **Vorgang** (`procedure`) | `GET /v1/procedures` | `GET /v1/procedures/{id}` |
| **Sammlung** (`collection`) | `GET /v1/collections` | `GET /v1/collections/{id}` |
| **Lagerort** (`storage_location`) | `GET /v1/storage-locations` | `GET /v1/storage-locations/{id}` |

---

## Semantischer Linked Data Export & Content Negotiation

Katalon unterstützt den direkten Export von Datensätzen in den Standardontologien **CIDOC-CRM** und **LRMoo**:

### Expliziter Export

```bash
# JSON-LD Export
curl "https://katalon.example.org/api/v1/objects/{id}/export?format=jsonld"

# Turtle (TTL) Export
curl "https://katalon.example.org/api/v1/objects/{id}/export?format=turtle"
```

### Content Negotiation

Clients können das semantische Datenmodell auch direkt über den HTTP-Header `Accept` anfordern:

```bash
curl -H "Accept: application/ld+json" "https://katalon.example.org/v1/objects/{id}"
curl -H "Accept: text/turtle" "https://katalon.example.org/v1/objects/{id}"
```

Ausführliche Details zu RDF-Klassen, Prädikaten und Vokabularkonvergenz siehe [Linked Data Export (JSON-LD & RDF)](/katalon-docs/integration/linked-data-export/).

---

## Weitere Schnittstellen

- [Linked Data Export (JSON-LD & RDF)](/katalon-docs/integration/linked-data-export/)
- [OAI-PMH Schnittstelle](/katalon-docs/integration/oai-pmh/)
- [Export-Mappings](/katalon-docs/integration/export-mappings/)
