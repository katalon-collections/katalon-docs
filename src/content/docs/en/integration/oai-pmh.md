---
title: OAI-PMH Interface
description: Metadata delivery via OAI-PMH (oai_dc, json_ld / CIDOC-CRM).
---

Katalon exposes collection data through a standards-compliant **OAI-PMH 2.0 interface**. The interface is directly reachable via the base URL:

```text
https://katalon.example.org/oai
```

---

## Supported verbs

The interface supports all six standard verbs of the OAI-PMH protocol:

- `Identify`: Information about the instance, contact address (`OAI_ADMIN_EMAIL`), and base policies.
- `ListMetadataFormats`: Supported metadata formats (including `oai_dc` and `json_ld`).
- `ListSets`: List of curatorial OAI sets for thematic scoping.
- `ListIdentifiers`: Fast retrieval of identifiers and datestamps.
- `ListRecords`: Retrieval of complete metadata records (with pagination via `resumptionToken`).
- `GetRecord`: Retrieval of a single record via its unique OAI identifier.

Example Identify request:
```text
https://katalon.example.org/oai?verb=Identify
```

---

## Available metadata formats (`metadataPrefix`)

### 1. Dublin Core (`oai_dc`)

The standard export in Dublin Core format delivers the 15 core elements (`dc:title`, `dc:creator`, `dc:date`, `dc:type`, etc.).

The mapping of internal schema fields to Dublin Core elements is configured in a data-driven way in the Admin UI (see [Export Mappings](/katalon-docs/en/integration/export-mappings/)).

Example:
```text
https://katalon.example.org/oai?verb=GetRecord&identifier=oai:katalon:object:550e8400-e29b-41d4-a716-446655440000&metadataPrefix=oai_dc
```

### 2. Linked Data / CIDOC-CRM (`json_ld`)

New in Katalon: delivery of semantically modeled records as JSON-LD (CIDOC-CRM & LRMoo).

Harvesters can use `metadataPrefix=json_ld` (or `jsonld`) to retrieve complete knowledge graphs with standardized classes (`crm:E22_Human-Made_Object`, `lrmoo:F1_Work`, etc.) and resolved relations.

See [Linked Data Export (JSON-LD & RDF)](/katalon-docs/en/integration/linked-data-export/) for details on the semantic mapping.

---

## OAI sets and selective harvesting

Records can be grouped into OAI sets in the Admin UI to offer external aggregators (e.g. Deutsche Digitale Bibliothek, subject portals) specific subsets of the holdings:

```text
https://katalon.example.org/oai?verb=ListRecords&set=historische-fotografien&metadataPrefix=oai_dc
```
