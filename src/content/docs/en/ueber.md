---
title: About Katalon Collections
description: What Katalon Collections is, why it exists, and who is behind it.
---

## What Is Katalon Collections?

Katalon Collections is an open-source **collections management system** for the GLAM sector — galleries, libraries, archives, and museums. It combines flexible, dynamic metadata schemas with a clean REST API, two specialized frontends (admin interface and public portal), and a containerized deployment infrastructure.

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

Under license law, Katalon is released under **AGPL-3.0-or-later**. The AGPL's network clause prevents a modified Katalon from being offered as a closed, hosted service without contributing the changes back — unmodified commercial operation remains unaffected by this.

## Who Is Behind It?

Katalon Collections is developed and maintained by **Karl Krägelin**. Katalon grew out of several years of work with digital collections, library systems, metadata, and research-data infrastructures.

### Background

Since 2016, I've worked on software and data infrastructures for academic collections, libraries, and research data. Along the way I've seen very different sides of such systems: data modeling and data cleanup, import and export, metadata transformations, interfaces, software development, and by now also architecture and IT project management.

From 2016 to 2018, I built a database on top of CollectiveAccess for an academic collection of historical picture postcards. This included developing the data model, preparing existing data, and getting ready for the migration to the new system.

From 2018 I worked at the Lower Saxony State and University Library Göttingen, in the unit responsible for the German Digital Library's library-sector coordination office. One focus there was exchange formats and data pipelines, in particular METS/MODS, along with transformation, validation, and processing of larger metadata sets. Several software tools and services also came out of that time, some still in use today.

Since 2023, I've worked at the University and State Library Münster as a software developer in research data management. One focus is the university's institutional research data repository and publication server, built on InvenioRDM. Since 2025, my work has increasingly included IT project management as well.

Alongside that, I've maintained or developed several smaller projects, including the picture-postcard database mentioned above, work around the "International Computer Game Collection," and open-source tools for OAI-PMH such as <https://oaiexplorer.de/>.

### Why Another Piece of Software?

A recurring problem across these projects was the gap between an institution's practical requirements and the technical complexity of the systems available.

Import, export, and standardized exchange formats in particular are often technically demanding. Adjustments require configuration files, transformations, or direct work with XML, XSLT, and similar technologies. For smaller museums, collections, archives, or specialist libraries, that's hard to sustain without dedicated technical staff.

At the same time, established systems exist that are powerful, but whose architecture and interaction concepts often date from an earlier generation of software. Many other solutions are proprietary or financially and organizationally out of reach for smaller institutions.

Katalon grew out of the question of what such a system could look like today: a modern web architecture, freely configurable data models, and as many functions as possible built directly into the application, where they'd normally require technical customization.

The ambition here is genuinely broad. Data models, relationships, vocabularies, workflows, and presentation should all be flexible enough that Katalon can serve very different collections and institutional contexts, without a separate piece of software for every use case.

### Standards Instead of a Silo

Katalon doesn't invent its own domain standards. Its foundation is existing and evolving standards: IIIF for digital media, established metadata and exchange formats (DC, LIDO, METS/MODS, and others), and standardized interfaces.

As relevant standards or exchange formats evolve and become established in practice, Katalon follows along. An OAI-PMH interface is as much a basic assumption as a REST API, through which data and functions stay accessible outside the user interface too.

Import and export are part of the application's core concept, not features bolted on afterward. Data should be able to enter the system easily, get structured and edited there, and come back out again in forms that are as open and standardized as possible.

### Linked Data as a Practical Feature

Another starting point for Katalon is experience with linked data and linked open data in the cultural heritage field.

Semantic models, controlled identifiers, and linked data have played an important role in professional discussion for years. In the everyday work of many institutions, though, these approaches are often hard to use in practice. There's still a clear gap between the theoretical possibilities and tools that can actually be used without dedicated technical infrastructure.

Katalon aims to narrow that gap.

Relationships between objects, people, places, procedures, collections, and controlled vocabularies are therefore part of the data model itself, and usable for standardized linked-data output and queries too.

Existing models and identifiers should be integrated so that linked data becomes practically usable even for institutions without their own semantic-web infrastructure. Katalon doesn't build a separate semantic model alongside established standards to do this.

### What Katalon Is Not Meant to Be

Katalon isn't a library management system and isn't meant to become one. Functions like circulation, acquisitions, serials management, or classic integrated library administration aren't part of the planned scope.

Nor is it meant to be an aggregator that mainly pulls together and indexes records from other systems. Katalon is built for institutions that actually want to model, maintain, enrich, and publish their collection data in it.

Just as little is Katalon meant to replace existing standards or established data models with proprietary alternatives. The system's configurability should give institutions freedom in their own data model, without losing the connection to shared standards and exchange paths.

The ambition sits between two poles: Katalon should be as flexible as possible and usable across different collections, while keeping a clear professional frame for collection management, digital objects, metadata, relationships, and publication.

### An Open-Source Project

Katalon is currently developed largely by one person. That's not something to hide.

At the same time, the project is deliberately built to keep dependency on it low. The source code is open, data can be exported, and the technologies used are established open-source components. An institution shouldn't have to keep its data in Katalon just because a later switch would be technically almost impossible.

The strong emphasis on interfaces, exchange formats, and open data structures belongs to the same thinking. The possibility of leaving a system should already be part of its design.

Katalon is an open-source project that grew alongside my day job. I keep developing it for as long as there are worthwhile questions, interest, and real use behind it. That comes with no promise of unlimited ongoing development or lasting support.

The drive behind it is interest in the question of what good software for academic and cultural collections could look like today, not a business model. If more institutions end up using Katalon, that could eventually lead to broader collaboration around development, documentation, standards, and operations.

- **License:** [AGPL-3.0-or-later](https://github.com/katalon-collections/katalon/blob/main/LICENSE)
- **Source code:** [github.com/katalon-collections/katalon](https://github.com/katalon-collections/katalon)
- **This documentation:** [github.com/katalon-collections/katalon-docs](https://github.com/katalon-collections/katalon-docs)
