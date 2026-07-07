---
title: REST API
description: Daten aus Katalon per REST API suchen, lesen und weiterverwenden.
---

# REST API

Katalon stellt alle Daten über eine versionierte REST API unter `/v1` bereit. Die vollständige maschinenlesbare Dokumentation läuft in jeder Installation unter:

```text
http://localhost:8000/api/docs
```

## Authentifizierung

Öffentliche Requests sehen nur Datensätze mit Status `public`.

Für geschuetzte Requests gibt es zwei Wege:

```http
Authorization: Bearer <jwt-token>
```

oder:

```http
X-API-Key: <api-key>
```

API-Keys werden in der Admin-Oberfläche pro Benutzer erzeugt.

## Suche

Der wichtigste Einstieg für externe Clients ist `/v1/search`.

```bash
curl "http://localhost:8000/v1/search?q=foto&type=object&page=1&page_size=20"
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

### Filter

| Parameter | Bedeutung |
| --- | --- |
| `q` | Volltextsuche |
| `type` | `object`, `entity`, `place`, `occurrence`, `procedure` |
| `status` | `draft`, `internal`, `public` |
| `page` / `page_size` | Pagination |
| `facets` | kommaseparierte Metadatenfelder für Aggregationen |
| `meta_<feld>` | Filter auf dynamische Metadaten |

Beispiel:

```bash
curl "http://localhost:8000/v1/search?type=object&meta_material=papier&facets=material,date"
```

## Record lesen

Nach der Suche wird ein Datensatz über seinen Typ-Endpunkt geladen:

```bash
curl "http://localhost:8000/v1/objects/550e8400-e29b-41d4-a716-446655440000"
```

Die Antwort hat eine stabile technische Hülle und einen dynamischen Metadatenblock:

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

`metadata_` ist absichtlich nicht für alle Installationen gleich. Die Struktur ergibt sich aus den Felddefinitionen der jeweiligen Katalon-Instanz.

## Felddefinitionen lesen

Clients, die dynamische Metadaten sauber anzeigen wollen, lesen zuerst das Schema:

```bash
curl "http://localhost:8000/v1/schema/object"
```

Felddefinitionen enthalten Name, Label, Feldtyp, Pflichtstatus, Wiederholbarkeit und UI-/Suchoptionen.

## Primärtyp-Endpunkte

| Typ | Listen | Detail |
| --- | --- | --- |
| Object | `GET /v1/objects` | `GET /v1/objects/{id}` |
| Entity | `GET /v1/entities` | `GET /v1/entities/{id}` |
| Place | `GET /v1/places` | `GET /v1/places/{id}` |
| Occurrence | `GET /v1/occurrences` | `GET /v1/occurrences/{id}` |
| Procedure | `GET /v1/procedures` | `GET /v1/procedures/{id}` |

## Standardisierte Exporte

REST gibt Katalons internes dynamisches Modell aus. Für standardisierte Metadaten nutze OAI-PMH oder Export-Mappings:

- [OAI-PMH](/integration/oai-pmh/)
- [Export-Mappings](/integration/export-mappings/)
