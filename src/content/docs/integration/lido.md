---
title: LIDO
description: Stand, Aufwand und Roadmap für LIDO-Export in Katalon.
---

# LIDO

LIDO (Lightweight Information Describing Objects) ist ein GLAM-Standard für Objektmetadaten. Katalon hat die Mapping-Schicht vorbereitet, aber noch keinen produktiven LIDO-Serializer.

Roadmap:

- GitHub Issue #185: [vollständiger Datenbank-Export (LIDO, CSV, JSON)](https://github.com/karkraeg/Katalon/issues/185)
- Roadmap-Bucket #263: [Export & Interoperabilität](https://github.com/karkraeg/Katalon/issues/263)

## Aktueller Stand

Im Schema-Editor ist LIDO als vorbereitetes Exportformat sichtbar. Produktiv genutzt wird aktuell nur `oai_dc`.

Vorhanden:

- `metadata_mappings` als formatneutrale Mapping-Tabelle
- Feldzuordnung im Schema-Editor
- OAI-PMH als erster produktiver Export-Consumer

Fehlt:

- LIDO-Zielpfade und Validierung
- Serializer für LIDO-XML
- Tests gegen LIDO-Schema oder Validator
- Entscheidung, ob LIDO nur für `object` gilt

## Naheliegendes Minimummapping

| LIDO-Element | Quelle in Katalon | Aufwand |
| --- | --- | --- |
| `lido:lidoRecID` | Record-ID + Record-Typ | niedrig |
| `lido:titleSet/appellationValue` | Titel-Mapping | niedrig |
| `lido:repositorySet` | `idno` | niedrig |
| `lido:recordWrap/recordID` | Record-ID | niedrig |
| `lido:recordMetadataDate` | `updated_at` | niedrig |
| `lido:subjectSet` | Schlagwörter / Vokabularfelder | mittel |
| `lido:rightsWorkSet` | Rechte-/Lizenzfeld | mittel |
| `lido:resourceSet` | IIIF-Link aus Medien | mittel |

## Knackpunkte

### Events

LIDO modelliert Herstellung, Erwerb, Verwendung und Ausstellung als verschachtelte Events. Katalon hat Relationen und Vorgänge, aber im Suchindex liegen verwandte Entitäten und Orte aktuell eher flach. Ein praxistaugliches `eventSet` braucht deshalb entweder zusätzliche Denormalisierung oder eine DB-Abfrage im Export.

### Objekttyp

`lido:objectWorkType` erwartet kontrollierte Vokabularwerte. `record_type = object` reicht nicht. Das echte Mapping muss auf `object_type` oder ein konfiguriertes Vokabularfeld zeigen.

### Geltungsbereich

LIDO passt fachlich vor allem auf Objekte. Entities, Places und Occurrences lassen sich nicht sauber direkt in LIDO ausdrücken. Der erste Serializer sollte daher nur `object` exportieren.

## Aufwand

| Variante | Aufwand | Ergebnis |
| --- | --- | --- |
| Minimal-LIDO | 3-4 Stunden | Valides, aber dünnes XML |
| LIDO mit `eventSet` und `resourceSet` | 1-1,5 Tage | Nutzbar für DDB/Europeana-nahe Workflows |
| LIDO mit Rollen aus Relationen | +0,5 Tage | Bessere fachliche Qualität |

## Umsetzungsschritte

1. Zielpfade für `format_key = lido` definieren.
2. `validate_mapping_target()` um LIDO-Ziele erweitern.
3. `_hit_to_lido()` in `oaipmh_service.py` oder eigenen Serializer auslagern.
4. `ListMetadataFormats` um LIDO erweitern.
5. Beispielobjekte gegen LIDO-Validator testen.
