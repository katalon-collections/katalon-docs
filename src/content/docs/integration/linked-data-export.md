---
title: Linked Data Export (JSON-LD & RDF)
description: Semantischer Export von Bestandsdaten in CIDOC-CRM und LRMoo als JSON-LD und Turtle.
---

:::note[Verfügbar ab Version 1.17.2]
:::

Katalon verfügt über einen semantischen RDF- und JSON-LD-Serializer, der Bestandsdaten automatisiert nach den internationalen Ontologien **CIDOC-CRM** (ISO 21127) und **LRMoo** (Library Reference Model - object-oriented) abbildet.

Der Export steht über die REST-API, per Content Negotiation sowie über die OAI-PMH-Schnittstelle zur Verfügung.

---

## Semantische Modellierung

Katalons Primärtypen und Relationen werden standardmäßig wie folgt auf CIDOC-CRM und LRMoo abgebildet:

### Primärtypen

| Katalon-Typ / Subtyp | RDF-Klassen |
|---|---|
| `object` | `crm:E22_Human-Made_Object`, `lrmoo:F5_Item` |
| `occurrence` (Subtyp `work`) | `lrmoo:F1_Work` |
| `occurrence` (Subtyp `expression`) | `lrmoo:F2_Expression` |
| `occurrence` (Subtyp `manifestation`) | `lrmoo:F3_Manifestation` |
| `occurrence` (Subtyp `event` oder sonstig) | `crm:E5_Event` |
| `entity` (Person) | `crm:E21_Person` |
| `entity` (Körperschaft / Organisation) | `crm:E74_Group` |
| `place` | `crm:E53_Place` |

### Relationen

Beziehungen zwischen Datensätzen werden automatisch in passende semantische Prädikate übersetzt:

- `lrmoo:R3_is_realised_in` (Work → Expression)
- `lrmoo:R4_is_embodied_in` (Expression → Manifestation)
- `lrmoo:R7_exemplifies` (Item/Object → Manifestation)
- `crm:P14_carried_out_by` (Akteure / Beteiligte)
- `crm:P138_represents` (Dargestellte Entitäten / Motive)
- `crm:P7_took_place_at` (Ereignisorte)
- `crm:P67_refers_to` (Allgemeine Bezüge)

Eingehende Beziehungen werden automatisch mit den entsprechenden inversen Prädikaten abgebildet.

#### Eigene RDF-Properties für Relationstypen

In der Admin-UI unter **Konfiguration → Vokabulare** beim System-Vokabular `relation_types` kann für jeden Relationstyp eine individuelle **RDF-Property-URI** hinterlegt werden. Der Serializer verwendet diese URI dann bevorzugt beim Export.

### Vokabulare als `skos:Concept`

Klassifizierende Felder und Vokabulare werden nicht nur als reine Textliterale exportiert. Wenn ein Begriff eine kanonische URI oder `exactMatch`-Verweise besitzt, wird er im JSON-LD als vollständiger `skos:Concept`-Knoten unter `crm:P2_has_type` serialisiert.

---

## Abruf über die REST-API

### Expliziter Export-Endpunkt

Für jeden Primärtyp existiert ein eigener Export-Endpunkt:

```bash
# JSON-LD Export für ein Objekt
curl "https://katalon.example.org/api/v1/objects/{id}/export?format=jsonld"

# Turtle (TTL) Export für einen Ort
curl "https://katalon.example.org/api/v1/places/{id}/export?format=turtle"
```

Unterstützte Formate (`?format=`):
- `jsonld` oder `json-ld` (MIME-Type: `application/ld+json`)
- `turtle` oder `ttl` (MIME-Type: `text/turtle`)

### Content Negotiation

Katalon unterstützt Content Negotiation direkt auf den Standard-Datensatz-Endpunkten. Clients können über den HTTP-Header `Accept` das gewünschte semantische Format anfordern:

```bash
# Fordert JSON-LD vom Standard-Objekt-Endpunkt an
curl -H "Accept: application/ld+json" \
  "https://katalon.example.org/api/v1/objects/{id}"

# Fordert Turtle vom Standard-Entitäten-Endpunkt an
curl -H "Accept: text/turtle" \
  "https://katalon.example.org/api/v1/entities/{id}"
```

Ohne passenden RDF-Accept-Header liefert der Endpunkt das gewohnte Anwendungs-JSON aus.

:::note[Verfügbar ab Version 1.19.7]
Diese Export-Endpunkte erfordern keinen API-Key — jeder Datensatz mit Status `public` ist frei abrufbar. Für bulk-artiges automatisiertes Harvesting einzelner Datensätze sind die Endpunkte pro IP rate-limitiert (Betreiber-Konfiguration `RATE_LIMIT_PUBLIC_EXPORT`, Default `30/minute`); für Massenabfragen ist [OAI-PMH](/katalon-docs/integration/oai-pmh/) der vorgesehene Weg. Details: [Produktionsbetrieb: Zugriffsschutz für öffentliche Endpunkte](/katalon-docs/administration/production/#zugriffsschutz-für-öffentliche-endpunkte).
:::

---

## Abruf über OAI-PMH

Der semantische Export ist vollständig in die OAI-PMH-Schnittstelle integriert.

Über das `metadataPrefix=json_ld` (oder kurz `jsonld`) können Harvester Bestandsdaten im JSON-LD-Format abfragen:

```text
https://katalon.example.org/oai?verb=GetRecord&identifier=oai:katalon:object:{id}&metadataPrefix=json_ld
```

Oder zur Massenabfrage ganzer Sets:

```text
https://katalon.example.org/oai?verb=ListRecords&metadataPrefix=json_ld
```

Das Format ist im OAI-PMH `ListMetadataFormats`-Response registriert und verweist auf das CIDOC-CRM/LRMoo JSON-LD-Schema.
