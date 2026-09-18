---
title: Export Mappings
description: Map metadata fields to target formats such as Dublin Core (oai_dc) and LIDO, and understand the requirements for data model and cataloguing.
---

Katalon separates internal cataloguing fields from external metadata formats. The data-driven mapping layer lets you map any schema field to target paths in external export models.

Configuration happens in a dedicated interface, separate from the schema editor (**Export → Format Mapping**, choose type and format).

:::tip[Export starts at cataloguing]
An export mapping can only carry what has been structured and maintained in the cataloguing schema. While simple formats like Dublin Core get by with a handful of standard fields, standards like LIDO require deeper data modeling (e.g. relations to actors, events, and structured measurements). See [Making the data model export-ready](#making-the-data-model-export-ready) below for guidance on preparing schemas.
:::
---

## How it works

- A field from `field_definitions` can be mapped to multiple export targets.
- An export target is a concrete target path within an export format (e.g. `dc:creator` or `dc:date`).
- Format-specific serialization stays encapsulated in the backend export service; the mapping itself remains purely declarative.
- If no specific mappings are defined for a primary type, OAI-DC falls back to a conservative default (title, date, description).

---

## Supported and common target formats

### Dublin Core (`oai_dc`) – low barrier to entry (fairly easy)

Dublin Core is the easiest format to work with. Since it is a purely flat model of 15 unstructured base elements, the requirements are minimal: a handful of standard fields like title, identifier, and a rough date or description are enough for a working export.

Almost any record catalogued in Katalon can be converted to Dublin Core without significant preparation. The price is a loss of semantic depth: specific actor roles (painter vs. former owner vs. conservator), structured measurements, or differentiated events are lost in the flat text.

The format mapping offers the 15 standard elements for selection:

- `dc:title`: Title or designation
- `dc:creator`: Creator / originator
- `dc:subject`: Subject, keywords, classification
- `dc:description`: Description, annotation
- `dc:publisher`: Publisher or issuing institution
- `dc:contributor`: Contributing persons or corporate bodies
- `dc:date`: Date of creation or publication
- `dc:type`: Object type, genre
- `dc:format`: Physical or digital format
- `dc:identifier`: Inventory number, call number, URI
- `dc:source`: Origin, source material
- `dc:language`: Language of the object
- `dc:relation`: Related resources
- `dc:coverage`: Spatial or temporal coverage
- `dc:rights`: Rights information, license

### LIDO (`lido`) – event-oriented museum standard

LIDO (Lightweight Information Describing Objects) is usable as a target format for museum holdings. Field mapping works through the same interface as for Dublin Core. It serves standardized exports to aggregators such as the Deutsche Digitale Bibliothek (DDB) and Europeana. LIDO requires a substantially deeper and more structured data foundation than Dublin Core.

### Other standard formats in the GLAM sector

Depending on the sector, aggregators and portals require different data formats:

- **LIDO:** Primary standard for museums and art collections ([lido-schema.org](https://lido-schema.org/)).
- **MODS (Metadata Object Description Schema):** Library of Congress standard for library holdings, printed works, and digitized text materials ([MODS specification by the Library of Congress](https://www.loc.gov/standards/mods/)).
- **EAD (Encoded Archival Description):** XML standard for finding aids and hierarchical holdings in the archival sector ([EAD by the Library of Congress / ICA](https://www.loc.gov/ead/)).
- **METS (Metadata Encoding and Transmission Standard):** Container format that bundles digitized materials with bibliographic and technical metadata (often as METS/MODS or METS/LIDO).
---

## Value transformation on export

- **Simple text and date fields:** The field value is transferred directly into the target XML element.
- **Repeatable fields:** Automatically produce multiple repetitions of the target element in the target XML (e.g. multiple `<dc:creator>` tags for multiple involved persons).
- **Vocabularies:** The mapping automatically resolves terms to their label configured for the target language.

---

## Why export isn't automatic: free-form schema and domain knowledge

Katalon does not impose a rigid, uniform schema. Every institution defines its own fields, types, and relations. This flexibility allows precise cataloguing for specialized holdings, but it has a direct consequence for exports:

**The mapping layer can only carry what is structurally present in the data model.**

An export to Dublin Core almost always succeeds, because Dublin Core only expects unstructured text fields. A target format like LIDO, by contrast, requires a well-founded event and actor structure. Anyone who only enters a free-text title and an unstructured measurement field in Katalon cannot readily export that record to LIDO.

Domain-specific installation profiles (e.g. for museums or photo collections) are planned for later versions of Katalon. Such profiles will ship with a preconfigured cataloguing schema and matching export mapping. Until then, and for every individually customized schema, the design responsibility lies with the domain experts who set up the schema.

---

## Determining requirements: where to look up mandatory fields

Every target format defines binding minimum requirements. Before creating fields or mappings, you need to clarify which elements the target system requires:

1. **Overview of delivery formats (DDB):** For institutions in Germany, the Deutsche Digitale Bibliothek offers a central overview at [DDB delivery formats](https://deutsche-digitale-bibliothek.atlassian.net/wiki/spaces/DFD/pages/48104286/Lieferformate). It breaks down which sectors must deliver which formats (LIDO, MODS, EAD, MARC21, Dublin Core).
2. **Format documentation from GBV:** The central office of the Gemeinsamer Bibliotheksverbund maintains practical, German-language documentation at [format.gbv.de](https://format.gbv.de/) covering all common metadata formats (including LIDO, MODS, Dublin Core, EAD, and MARC21). The site is an ideal starting point for looking up field structures and conventions.
3. **Format specifications:** The official specifications define the base structure of the schemas:
   - LIDO: [lido-schema.org](https://lido-schema.org/)
   - MODS: [loc.gov/standards/mods](https://www.loc.gov/standards/mods/)
   - EAD: [loc.gov/ead](https://www.loc.gov/ead/)
4. **Aggregator application profiles:** Aggregators typically set their own guidelines, which are stricter than the base schema (e.g. the **DDB LIDO application profile** or Europeana guidelines).
5. **Schematron rules and mandatory elements:** Many portals automatically validate delivered records via Schematron validators. Typical mandatory fields for LIDO include, for example:
   - At least one descriptive object title (`lido:titleSet`)
   - Unique inventory number or persistent identifier (`lido:recordID` / `lido:workID`)
   - Object type or subject term (`lido:objectClassificationWrap`)
   - At least one production or creation event (`lido:eventSet` with event type `Herstellung`)
   - Linked actors with role information (`lido:eventActor` / `lido:roleActor`)
   - Dating of the event with sortable time bounds (`earliestDate` and `latestDate`)
   - Rights information for the digital image and the object (`lido:rightsWorkWrap`)

If this data is missing in the source system, the aggregator rejects the entire record on ingest.

---

## Making the data model export-ready

For Katalon fields to be mapped to complex target paths, the schema must provide the necessary granularity.

### 1. Events and actors instead of free text

- **Unsuitable for LIDO:** A simple text field `urheber` containing `"Painted by Marta Keller in 1920 in Munich"`. For Dublin Core this is sufficient as `dc:creator` or `dc:description`. In LIDO the mapping fails because actor, role, date, and place cannot be extracted separately.
- **Suitable for LIDO:**
  - The object is linked via a relation field (e.g. `created by`) to a separate record of type **Entity** (person).
  - The relation type defines the role (`Painter`, `Photographer`, `Maker`).
  - A separate dating field stores the creation time with a normalized year or ISO interval.
  - The place is captured as a relation to a record of type **Place**.

:::note[Available from version 1.37.0]
A mapping rule with source kind "Relation" can also resolve relations where the
record being exported is not the source but the target (setting "Direction:
Inbound"). This avoids duplicate relation fields — for example, an object export
can read a relation a procedure has set pointing to that object, without needing a
dedicated field on the object itself. The relation-type selector in the mapping
editor only shows relation types that are valid for the current record type as
source or target.
:::

### 2. Structured measurements instead of measurement strings

- **Unsuitable for LIDO:** A free-text field `masse` containing `"Height 45 cm, width 30 cm"`.
- **Suitable for LIDO:** Separate fields for value, unit, and measurement type (e.g. via group fields or specific number fields `hoehe_cm`, `breite_cm`). LIDO expects separate XML nodes for `measurementValue`, `measurementUnit`, and `measurementType`.

### 3. Controlled vocabularies for types and genres

- **Unsuitable for LIDO:** A free-text field `objektart` with arbitrary, inconsistent labels (e.g. sometimes `"painting"`, sometimes `"oil painting"`).
- **Suitable for LIDO:** A vocabulary field linked to a controlled system vocabulary or external authority data (such as the Art & Architecture Thesaurus, AAT). This lets LIDO export the stable URI of the term (`lido:conceptID`) alongside the text label.

### 4. Rights and licenses

Aggregators require machine-readable rights information. In the schema, set up vocabulary fields for licenses on objects and media files (e.g. Creative Commons or RightsStatements.org URIs), instead of using unstructured copyright notes.

---

## Approach for collection planning

Anyone planning exports to external subject portals should go through the following steps:

1. **Clarify target systems:** Determine whether holdings should only be exposed via OAI-DC, or whether deliveries to LIDO-based portals (DDB, Europeana) are planned.
2. **Obtain the application profile:** Consult the mandatory fields and guidelines of the respective aggregator.
3. **Align the schema in Katalon:** Before starting mass cataloguing, ensure that actors, dates, object types, and measurements exist as separate, structured fields.
4. **Support cataloguers:** Add help text to schema fields so mandatory data and conventions are visible directly in the cataloguing form.
5. **Create and test the mapping:** Under **Export → Format Mapping**, link the paths and retrieve and validate sample records via export.
