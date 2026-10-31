---
title: About Katalon Collections
description: What Katalon Collections is, why it exists, and who is behind it.
---

## What Is Katalon Collections?

Katalon Collections is an open-source collections management system for galleries, libraries, archives, and museums (GLAM). It provides configurable metadata schemas, a REST API, an admin interface, and a public portal. It is installed and operated with containers.

The domain data lives in seven core types: objects, entities (people/organizations), places, occurrences (works, events, concepts), collections, storage locations, and procedures (loans, acquisitions, conservation). Fields, forms, and controlled vocabularies with authority-data integration (GND, GeoNames, VIAF, Wikidata, Getty TGN, ICONCLASS) can be fully configured through the interface, without touching code or configuration files.

Katalon is independent and not affiliated with [katalon.com](https://katalon.com/) (test automation). To tell them apart, the project is called "Katalon Collections" externally.

## Why Katalon Collections?

Collection managers need to record, link, and publish different holdings, each with suitable metadata fields. In Katalon, schemas for this are configured through the interface rather than programmed (configuration over coding). Development follows these principles:

- Data integrity and security of metadata and media take precedence over feature velocity.
- Curators should be able to adapt schemas to their collection easily.
- Established technologies should keep installation and operation manageable. A public portal is part of the application.
- Katalon is open source, free of license costs, and self-hostable. Institutions with small budgets can import their holdings themselves; the Smart Importer offers a dry-run preview for this.
- A documented REST API with OpenAPI spec, OAI-PMH, and a disclosed data model allow institutions to take their data with them.
- Katalon uses GLAM standards such as IIIF, Dublin Core, LIDO, and METS/MODS, along with authority data. EAD is planned for the future.
- The public portal should be accessible to all users.
- The application should be adaptable for custom solutions or a dedicated portal when needed.

Katalon is released under AGPL-3.0-or-later. The AGPL's network clause prevents a modified Katalon from being offered as a closed, hosted service without contributing the changes back. Unmodified commercial operation remains unaffected.

## Who Is Behind It?

Katalon Collections is developed and maintained by **Karl Krägelin**. Katalon grew out of several years of work with digital collections, library systems, metadata, and research-data infrastructures.

### Contributors

- **Dr. Winfried Bergmeyer:** feedback, testing, ideas, logo
- **Adienne Karsten-Welker:** feedback, testing, UX & UI
- **Patrick Dinger:** feedback, testing, ideas, and data import

### Background

Since 2016, I've worked on software and data infrastructures for academic collections, libraries, and research data. My work covers data modeling and data cleanup, import and export, metadata transformations, interfaces, and software development.

From 2016 to 2018, I helped build a database on top of CollectiveAccess for an [academic collection of historical picture postcards](https://bildpostkarten.uni-osnabrueck.de/). This included in particular developing the data model, preparing existing data, and preparing the migration to the new system.

From 2018 I worked at the Lower Saxony State and University Library Göttingen, in the library-sector coordination office of the German Digital Library (Fachstelle Bibliothek der Deutschen Digitalen Bibliothek). One focus there was exchange formats and data pipelines, in particular METS/MODS, along with transformation, validation, and processing of larger metadata sets. Several software tools and services came out of that time.

Since 2023, I've worked at the University and State Library Münster as a software developer in research data management. One focus is the university's institutional research data repository and publication server, built on [InvenioRDM](https://inveniosoftware.org/products/rdm/). Since 2025, my work has increasingly included IT project management as well.

Alongside that, I've maintained or developed smaller projects, including the picture-postcard database, work around the "International Computer Game Collection," and open-source tools such as <https://oaiexplorer.de/>.

### Why Another Piece of Software?

A recurring problem, in my view, is the gap between an institution's practical requirements and the technical complexity of the systems available.

Import, export, and standardized exchange formats in particular are often technically demanding. Adjustments require configuration files, transformations, or direct work with XML, XSLT, and similar technologies. For smaller museums, collections, archives, or specialist libraries, that's hard to sustain without dedicated technical staff.

At the same time, established systems exist that are powerful, but whose architecture and interaction concepts partly date from an earlier generation of software. Many solutions are proprietary or financially and organizationally out of reach for smaller institutions.

With Katalon, I want to make data models freely configurable on a modern web architecture and move as many of the otherwise necessary technical adjustments as possible into the user interface.

Data models, relationships, vocabularies, workflows, and presentation should be adaptable to different collections and institutions, without developing separate software for every use case. The software should also be scalable and, so to speak, "AI-ready" on both sides: for the institution maintaining its data, and in the sense of a performant, accessible public portal that can handle requests from AI crawlers.

### Standards Instead of a Silo

Katalon follows existing domain standards: IIIF for digital media, metadata and exchange formats such as DC, LIDO, and METS/MODS, and standardized interfaces.

As relevant standards or exchange formats evolve and become established in practice, Katalon should follow along. OAI-PMH and the REST API make data accessible outside the user interface too; the REST API also provides access to all functions and makes Katalon usable for integration with other systems and for power users.

Import and export have been part of the application's concept from the start. Data should be able to enter the system easily, get structured and edited there, and come back out again in formats that are as open and standardized as possible.

### Linked Data as a Practical Feature

Another starting point for Katalon is experience with linked data and linked open data in the cultural heritage field.

Semantic models, controlled identifiers, and linked data have been discussed in the cultural heritage field for many years. Using them, however, often requires specialized technical infrastructure that many institutions lack. Katalon aims to make these approaches usable through the application.

Relationships between objects, people, places, procedures, collections, and controlled vocabularies are therefore part of the data model itself, and usable for standardized linked-data output and queries too.

Existing models and identifiers should be integrated so that linked data becomes practically usable even for institutions that cannot run their own semantic-web infrastructure. Katalon doesn't build a separate semantic model alongside established standards to do this.

### What Katalon Is Not Meant to Be

Katalon isn't a library management system and isn't meant to become one. Functions like circulation, acquisitions, serials management, or classic integrated library administration aren't part of the planned scope.

Nor is it primarily meant to be an aggregator that mainly pulls together and indexes records from other systems. Katalon is built for institutions that actually want to model, maintain, enrich, and publish their collection data in it.

Just as little is Katalon meant to replace existing standards or established data models with proprietary alternatives. The system's configurability should give institutions freedom in their own data model, without losing the connection to shared standards and exchange paths.

The configurability stays focused on collection management: digital objects, metadata, relationships, and publication.

### An Open-Source Project

I currently develop Katalon largely on my own.

The open source code, data export, and the open-source components used are meant to let institutions switch systems later on.

That's why I take interfaces, exchange formats, and open data structures into account from the start when building the system.

Katalon grew alongside my day job. I keep developing it for as long as there are worthwhile questions, interest, and use behind it. I can't promise unlimited ongoing development or lasting support.

I'm interested in what good software for academic and cultural collections can look like today. I'm not pursuing a business model with it. If more institutions use Katalon, we can collaborate on development, documentation, standards, and operations.

- **License:** [AGPL-3.0-or-later](https://github.com/katalon-collections/katalon/blob/main/LICENSE)
- **Source code:** [github.com/katalon-collections/katalon](https://github.com/katalon-collections/katalon)
- **This documentation:** [github.com/katalon-collections/katalon-docs](https://github.com/katalon-collections/katalon-docs)
