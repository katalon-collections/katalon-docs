---
title: About Katalon Collections
description: What Katalon Collections is, why it exists, and who is behind it.
---

## What Is Katalon Collections?

Katalon Collections is an open-source **Metadata Management System (MMS)** for the GLAM sector — galleries, libraries, archives, and museums. It combines flexible, dynamic metadata schemas with a clean REST API, two specialized frontends (admin interface and public portal), and a containerized deployment infrastructure.

The domain data lives in seven core types: **Objects**, **Entities** (people/organizations), **Places**, **Occurrences** (works, events, concepts), **Collections**, **Storage Locations**, and **Procedures** (loans, acquisitions, conservation). Fields, forms, and controlled vocabularies with authority-data integration (GND, GeoNames, VIAF, Wikidata, Getty TGN, ICONCLASS) can be fully configured through the interface, without touching code or configuration files.

Katalon is independent and not affiliated with [katalon.com](https://katalon.com/) (test automation) — hence the spelled-out external name "Katalon Collections".

## Why Katalon Collections?

Collection managers face the challenge of recording, linking, and publishing heterogeneous holdings with individual metadata fields. Katalon consistently follows **configuration over coding**: schemas are configured through the interface rather than programmed. A few fixed principles stand behind this:

- **Data integrity and security** of metadata and media take precedence over feature velocity.
- **Simplicity and flexibility for curators.** Schemas are adapted through the interface, not through config files or code — the software adapts to the collection, not the other way around.
- **A modern, established tech stack**, manageable to install and operate; a portal view is included from the start.
- **Free and self-hostable.** Katalon is open source, with no license costs. Institutions with small budgets can import their holdings themselves (Smart Importer with dry-run preview), instead of necessarily hiring a service provider.
- **No lock-in.** Documented REST API with OpenAPI spec, OAI-PMH, and a simple, disclosed data model — institutions can take their data with them at any time.
- **Standards compliance.** Connection to GLAM standards (IIIF, Dublin Core, LIDO/EAD in the future) instead of proprietary formats, with authority-data integration.
- **Accessibility** of the public portal for all users.
- **Adaptability**, in case a custom solution or a dedicated portal is needed after all.

Under license law, Katalon is released under **AGPL-3.0-or-later** — the same copyleft family as CollectiveAccess, the most comparable established open-source collections-management system. The AGPL's network clause prevents a modified Katalon from being offered as a closed, hosted service without contributing the changes back — unmodified commercial operation remains unaffected by this.

## Who Is Behind It?

Katalon Collections is developed and maintained by **Karl Krägelin**.

- **License:** [AGPL-3.0-or-later](https://github.com/katalon-collections/katalon/blob/main/LICENSE)
- **Source code:** [github.com/katalon-collections/katalon](https://github.com/katalon-collections/katalon)
- **This documentation:** [github.com/katalon-collections/katalon-docs](https://github.com/katalon-collections/katalon-docs)

:::note
This section will be expanded with background on the person and the project's history.
:::
