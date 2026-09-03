---
title: OAI-PMH Schnittstelle
description: Metadatenbereitstellung über OAI-PMH (oai_dc, json_ld / CIDOC-CRM).
---

Katalon stellt Bestandsdaten über eine standardkonforme **OAI-PMH 2.0-Schnittstelle** bereit. Die Schnittstelle ist direkt über die Basis-URL erreichbar:

```text
https://katalon.example.org/oai
```

---

## Unterstützte Verben

Die Schnittstelle unterstützt alle sechs Standardverben des OAI-PMH-Protokolls:

- `Identify`: Informationen zur Instanz, Kontaktadresse (`OAI_ADMIN_EMAIL`) und Basisrichtlinien.
- `ListMetadataFormats`: Unterstützte Metadatenformate (u. a. `oai_dc` und `json_ld`).
- `ListSets`: Liste der kuratorischen OAI-Sets zur thematischen Eingrenzung.
- `ListIdentifiers`: Schnelle Abfrage von Identifikatoren und Datumsstempeln.
- `ListRecords`: Abfrage vollständiger Metadatensätze (mit Paginierung über `resumptionToken`).
- `GetRecord`: Abruf eines einzelnen Datensatzes über seine eindeutige OAI-Kennung.

Beispiel Identify-Request:
```text
https://katalon.example.org/oai?verb=Identify
```

---

## Verfügbare Metadatenformate (`metadataPrefix`)

### 1. Dublin Core (`oai_dc`)

Der Standard-Export im Dublin-Core-Format liefert die 15 Kern-Elemente (`dc:title`, `dc:creator`, `dc:date`, `dc:type` etc.).

Die Zuordnung der internen Schemafelder zu den Dublin-Core-Elementen wird datengetrieben in der Admin-UI konfiguriert (siehe [Export-Mappings](/katalon-docs/integration/export-mappings/)).

Beispiel:
```text
https://katalon.example.org/oai?verb=GetRecord&identifier=oai:katalon:object:550e8400-e29b-41d4-a716-446655440000&metadataPrefix=oai_dc
```

### 2. Linked Data / CIDOC-CRM (`json_ld`)

Neu in Katalon: Bereitstellung semantisch modellierter Datensätze als JSON-LD (CIDOC-CRM & LRMoo).

Harvester können über `metadataPrefix=json_ld` (oder `jsonld`) vollständige Wissensgraphen mit standardisierten Klassen (`crm:E22_Human-Made_Object`, `lrmoo:F1_Work` etc.) und aufgelösten Relationen abrufen.

Details zur semantischen Abbildung siehe [Linked Data Export (JSON-LD & RDF)](/katalon-docs/integration/linked-data-export/).

---

## OAI-Sets und Selektives Harvesting

Über die Admin-UI können Datensätze in OAI-Sets gruppiert werden, um externen Aggregatoren (z. B. Deutsche Digitale Bibliothek, Fachportale) spezifische Teilbestände anzubieten:

```text
https://katalon.example.org/oai?verb=ListRecords&set=historische-fotografien&metadataPrefix=oai_dc
```
