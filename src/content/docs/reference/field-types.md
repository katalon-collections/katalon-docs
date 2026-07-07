---
title: Feldtypen
description: Überblick über Feldtypen in der Schema-Engine.
---

# Feldtypen

Katalon-Felder werden in `field_definitions` konfiguriert. Der konkrete Wert liegt pro Datensatz in `metadata_`.

| Feldtyp | Verwendung |
| --- | --- |
| `text` | Kurzer Text |
| `richtext` | Längerer formatierter Text |
| `date` | Datum oder datumsartiger Wert |
| `number` | Zahl |
| `boolean` | Ja/Nein |
| `geo` | Geografischer Wert |
| `vocab` | Kontrolliertes Vokabular |
| `vocab_free` | Vokabular mit Freitext-Ergänzung |
| `relation` | Beziehung zu Object, Entity, Place, Occurrence oder Procedure |
| `authority` | Normdatenwert aus angebundener Authority |
| `pid` | Persistenter Identifier, z. B. URN oder später DOI |
| `group` | Container für Unterfelder |

Felder können wiederholbar sein. Wiederholbare Werte werden als Liste gespeichert.
