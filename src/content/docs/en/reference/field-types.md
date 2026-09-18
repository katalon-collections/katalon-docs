---
title: Field Types
description: Overview of field types in the schema engine.
---

Katalon fields are configured in `field_definitions`. The concrete value for each record lives in `metadata_`.

| Field type | Usage | Details |
| --- | --- | --- |
| `text` | Short text | [Description](/katalon-docs/en/administration/schema#text--single-line-free-text) |
| `richtext` | Longer formatted text | [Description](/katalon-docs/en/administration/schema#richtext--multi-line-formattable-text) |
| `date` | Date or date-like value | [Description](/katalon-docs/en/administration/schema#date--date) |
| `number` | Number | [Description](/katalon-docs/en/administration/schema#number--numeric-value) |
| `boolean` | Yes/No | [Description](/katalon-docs/en/administration/schema#boolean--yesno) |
| `vocab` | Controlled vocabulary | [Description](/katalon-docs/en/administration/schema#vocab--vocabulary-field) |
| `vocab_free` | Vocabulary with free-text addition | [Description](/katalon-docs/en/administration/schema#vocab_free--vocabulary-field-with-free-text) |
| `relation` | Relationship to Object, Entity, Place, Occurrence, Procedure, or Collection | [Description](/katalon-docs/en/administration/schema#relation--link-to-another-record) |
| `geo` | Geographic value (coordinates) | [Description](/katalon-docs/en/administration/schema#geo--geographic-coordinates) |
| `url` | Web link with optional title | [Description](/katalon-docs/en/administration/schema#url--web-link) |
| `pid` | Persistent identifier (e.g. ARK or URN) | [Description](/katalon-docs/en/administration/schema#pid--persistent-identifier) |
| `authority` | Authority-data value from a connected source (GND, Wikidata, GeoNames, etc.) | [Description](/katalon-docs/en/administration/schema#authority--authority-data-field) & [Authority data guide](/katalon-docs/en/administration/normdaten/) |
| `group` | Container for sub-fields | [Description](/katalon-docs/en/administration/schema#group--field-group) |

Fields can be repeatable. Repeatable values are stored as a list.
