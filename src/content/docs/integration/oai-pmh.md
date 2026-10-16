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

## Gelöschte und zurückgezogene Datensätze

:::note[Verfügbar ab Version 1.42.0]
:::

Die Schnittstelle meldet Datensätze, die nicht mehr ausgeliefert werden, mit `<header status="deleted">` (Identify: `deletedRecord` = `transient`). Harvester mit inkrementellem Abgleich, etwa die DDB, entfernen sie dann aus ihrem Portal, statt erst bei einer Vollernte davon zu erfahren.

Als gelöscht gemeldet werden:

- Datensätze, die öffentlich waren und gelöscht oder auf *intern*/*Entwurf* gesetzt wurden. Der Datumsstempel ist der Zeitpunkt der Rücknahme; `from`/`until` beziehen sich darauf. Wird ein Datensatz wieder öffentlich, erscheint er wieder normal.
- Öffentliche Datensätze, die im angefragten Format nicht ausgeliefert werden können, z. B. ohne Titel oder bei Fehlern im DDB-Profil (siehe [LIDO für die DDB](/katalon-docs/integration/lido-ddb/)). Auch `GetRecord` liefert dann nur den Kopf mit `status="deleted"`.

Die Löschmeldungen folgen in `ListRecords`/`ListIdentifiers` nach den vorhandenen Datensätzen, über denselben `resumptionToken`. Sets, die nach Metadaten, Status oder Freitext filtern, enthalten keine Löschmeldungen, weil ein gelöschter Datensatz keinem solchen Set mehr zugeordnet werden kann; Sets nach Datensatztyp schon.

„Transient“ heißt: Datensätze, die vor Einführung dieser Funktion zurückgenommen wurden, sind nicht erfasst.

## OAI-Sets und Selektives Harvesting

Über die Admin-UI können Datensätze in OAI-Sets gruppiert werden, um externen Aggregatoren (z. B. Deutsche Digitale Bibliothek, Fachportale) spezifische Teilbestände anzubieten:

```text
https://katalon.example.org/oai?verb=ListRecords&set=historische-fotografien&metadataPrefix=oai_dc
```
