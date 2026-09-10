---
title: Export-Mappings
description: Metadatenfelder flexibel auf Zielformate wie Dublin Core (oai_dc) und LIDO mappen.
---

Katalon trennt interne Erfassungsfelder von externen Metadatenformaten. Über die datengetriebene Mapping-Schicht kann jedes Schemafeld auf Zielpfade externer Exportmodelle gemappt werden.

Die Konfiguration erfolgt auf einer eigenen Oberfläche, getrennt vom Schema-Editor (**Export → Format-Mapping**, Typ und Format wählen).

---

## Funktionsweise

- Ein Feld aus `field_definitions` kann auf mehrere Exportziele gemappt werden.
- Ein Exportziel ist ein konkreter Zielpfad innerhalb eines Exportformats (z. B. `dc:creator` oder `dc:date`).
- Format-spezifische Serialisierung bleibt im Backend-Export-Service gekapselt, das Mapping selbst bleibt rein deklarativ.
- Werden für einen Primärtyp keine spezifischen Mappings hinterlegt, greift für OAI-DC ein konservativer Standard-Fallback (Titel, Datum, Beschreibung).

---

## Unterstützte Zielformate

### Dublin Core (`oai_dc`)

Wird für die Bereitstellung über OAI-PMH verwendet. Im Format-Mapping stehen die 15 Standard-Elemente zur Auswahl:

- `dc:title` – Titel oder Bezeichnung
- `dc:creator` – Urheber:in / Schöpfer:in
- `dc:subject` – Thema, Schlagworte, Klassifikation
- `dc:description` – Beschreibung, Annotation
- `dc:publisher` – Verlag oder herausgebende Institution
- `dc:contributor` – Beteiligte Personen oder Körperschaften
- `dc:date` – Entstehungs- oder Publikationsdatum
- `dc:type` – Objekttyp, Gattung
- `dc:format` – Physisches oder digitales Format
- `dc:identifier` – Inventarnummer, Signatur, URI
- `dc:source` – Herkunft, Vorlage
- `dc:language` – Sprache des Objekts
- `dc:relation` – Verwandte Ressourcen
- `dc:coverage` – Räumlicher oder zeitlicher Geltungsbereich
- `dc:rights` – Rechteangaben, Lizenz

### LIDO (`lido`)

LIDO (Lightweight Information Describing Objects) ist als Zielformat bereits nutzbar — Feldmapping funktioniert wie bei Dublin Core über dieselbe Oberfläche. Es dient GLAM-Standardexporten, etwa an Europeana und DDB.

---

## Werttransformation beim Export

- **Einfache Text- und Datumsfelder:** Der Feldwert wird direkt in das Ziel-XML-Element übertragen.
- **Wiederholbare Felder:** Erzeugen im Ziel-XML automatisch mehrere Wiederholungen des Ziel-Elements (z. B. mehrere `<dc:creator>`-Tags bei mehreren beteiligten Personen).
- **Vokabulare:** Das Mapping löst Begriffe automatisch in ihr für die Zielsprache hinterlegtes Label auf.
