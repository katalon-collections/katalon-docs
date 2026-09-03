---
title: Feldtypen
description: Überblick über Feldtypen in der Schema-Engine.
---

# Feldtypen

Katalon-Felder werden in `field_definitions` konfiguriert. Der konkrete Wert liegt pro Datensatz in `metadata_`.

| Feldtyp | Verwendung | Details |
| --- | --- | --- |
| `text` | Kurzer Text | [Beschreibung](/katalon-docs/administration/schema#text--einzeiliger-freitext) |
| `richtext` | Längerer formatierter Text | [Beschreibung](/katalon-docs/administration/schema#richtext--mehrzeiliger-formatierbarer-text) |
| `date` | Datum oder datumsartiger Wert | [Beschreibung](/katalon-docs/administration/schema#date--datum) |
| `number` | Zahl | [Beschreibung](/katalon-docs/administration/schema#number--numerischer-wert) |
| `boolean` | Ja/Nein | [Beschreibung](/katalon-docs/administration/schema#boolean--janein) |
| `vocab` | Kontrolliertes Vokabular | [Beschreibung](/katalon-docs/administration/schema#vocab--vokabularfeld) |
| `vocab_free` | Vokabular mit Freitext-Ergänzung | [Beschreibung](/katalon-docs/administration/schema#vocab_free--vokabularfeld-mit-freitext) |
| `relation` | Beziehung zu Object, Entity, Place, Occurrence, Procedure oder Collection | [Beschreibung](/katalon-docs/administration/schema#relation--verknüpfung-zu-einem-anderen-datensatz) |
| `geo` | Geografischer Wert (Koordinaten) | [Beschreibung](/katalon-docs/administration/schema#geo--geografische-koordinaten) |
| `url` | Weblink mit optionalem Titel | [Beschreibung](/katalon-docs/administration/schema#url--weblink) |
| `pid` | Persistenter Identifier (z. B. ARK oder URN) | [Beschreibung](/katalon-docs/administration/schema#pid--persistenter-identifier) |
| `authority` | Normdatenwert aus angebundener Quelle (GND, Wikidata, GeoNames etc.) | [Beschreibung](/katalon-docs/administration/schema#authority--normdatenfeld) & [Leitfaden Normdaten](/katalon-docs/administration/normdaten/) |
| `group` | Container für Unterfelder | [Beschreibung](/katalon-docs/administration/schema#group--feldgruppe) |

Felder können wiederholbar sein. Wiederholbare Werte werden als Liste gespeichert.
