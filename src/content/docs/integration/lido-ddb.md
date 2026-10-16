---
title: LIDO für die DDB
description: LIDO-Export so konfigurieren, dass er die Anforderungen der Deutschen Digitalen Bibliothek erfüllt – mit DDB-Profil, Prüfbericht und Beispiel-Mapping.
---

:::note[Verfügbar ab Version 1.42.0]
DDB-Profil, Prüfbericht `lido-report`, `resourceSet` je Medium und die unten beschriebenen Einstellungen.
:::

Der LIDO-Export lässt sich vollständig über das Mapping-Set an die Anforderungen der Deutschen Digitalen Bibliothek (DDB) anpassen: Regeln, deren Einstellungen und die Institutionsangaben. Am einfachsten ist es, ein Mapping als YAML zu exportieren, zu ergänzen und wieder zu importieren (**Export → Format-Mapping → YAML exportieren / importieren**).

:::caution[Einstellungen derzeit nur per YAML]
Die neuen Regel-Einstellungen (z. B. `type`, `measurement_type`, `kind`, `via`) und die DDB-Institutionsangaben erscheinen noch nicht als eigene Eingabefelder im Mapping-Editor. Sie werden per YAML-Import gesetzt und bleiben beim Bearbeiten im Editor erhalten, solange die Quellenart der Regel nicht gewechselt wird.
:::

## Was Katalon automatisch richtig macht

- **Terminologie-URIs statt Wörtern** in Attributen (z. B. bevorzugter Titel `http://terminology.lido-schema.org/lido00169`, aktueller Standort `…/lido00475`).
- **Bereinigte Texte:** Leerzeichen und Zeilenumbrüche am Anfang und Ende werden entfernt, HTML aus Richtext wird zu Klartext. Leere Felder erzeugen keine leeren Elemente.
- **Keine Dubletten:** Kommt derselbe Ort über zwei Verlage zweimal vor, steht er nur einmal im Export.
- **Normdaten-URIs in der Form, die die DDB auflöst**, z. B. GeoNames immer als `https://sws.geonames.org/2950159/` (mit Schrägstrich am Ende).
- **Änderungsdatum des Datensatzes** in `recordMetadataDate` statt des Exportzeitpunkts. Ändern Sie die Lizenz oder den Freigabehinweis eines Bildes, gilt auch das Objekt als geändert und wird beim nächsten Harvest neu abgeholt.

## DDB-Profil einschalten

In den Institutionsangaben des Mapping-Sets:

```yaml
institution_config:
  profile: ddb
  isil: DE-3066
  institution_name: Historische Bildpostkarten - Universität Osnabrück
  website: https://bildpostkarten.uni-osnabrueck.de/
  location: Osnabrück
  location_place_ids:
  - {source: geonames, id: '2856883'}
  portal_host: https://bpk.katalon-collections.de
  record_rights: https://creativecommons.org/publicdomain/zero/1.0/
  record_rights_holder: true      # Institution als Rechteinhaber der Metadaten
  rights_work_holder: true        # Institution als Rechteinhaber am Objekt
  resource_rights_fallback: object_field:rights.rechtemodell
```

Mit `profile: ddb` prüft Katalon jeden Datensatz zusätzlich:

- Hat ein öffentliches Bild keine Lizenz (auch nicht über den Fallback), fehlt der Datensatz im OAI-Export: „Rechteangabe zum Digitalisat fehlt“.
- Lizenz-URIs von Bildern und Metadaten müssen im DDB-Lizenzkorb stehen (exakte Schreibweise; Katalon schreibt bekannte Lizenzen automatisch in die übliche Form um).
- Für jedes öffentliche Bild entsteht ein `resourceSet` mit Bild-Link (IIIF, volle Größe und Vorschau), Typ `image`, Lizenz, Rechteinhaber und Freigabehinweis (Credit Line des Mediums). Das Hauptbild steht zuerst.

Betroffene Datensätze erscheinen in der Mapping-Vorschau als Warnung.

## Prüfbericht vor der Lieferung

Bevor die DDB harvestet, lässt sich auf dem Server prüfen, welche Datensätze ausgeschlossen würden:

```bash
katalon-manage lido-report --mapping-set <ID des Mapping-Sets> --output lido-report.csv
```

Die Ausgabe nennt die Anzahl betroffener Datensätze je Fehlerart; die CSV-Datei listet jeden Datensatz mit `lidoRecID` und Fehlertext.

## Wichtige Einstellungen je Regel

| Ziel | Einstellung | Wirkung |
|---|---|---|
| Objektart (`objectWorkType`) | `type` | z. B. `Kartentypus`; mehrere Regeln sind erlaubt (Subtyp-Normdaten und ein Feld). |
| Klassifikation | `type` | Freier Begriff oder URI, z. B. `http://terminology.lido-schema.org/lido01135` für Sammlung. |
| Inschrift | `description` | z. B. „gedruckt, Vorderseite“. Unterfelder einer Gruppe als `gruppe.unterfeld`. |
| Beschreibung | `type` | z. B. `Beschreibung`. |
| Maß (strukturiert) | `measurement_type`, `unit` | „9,2 cm“ wird zu Wert 9.2 und Einheit cm; dazu „9,2 × 13,9 cm“ als Anzeige. |
| Ereignis: Akteur | `role`, `role_uri` | Rolle; Normdaten (GND, Wikidata …) kommen aus den Feldern der Person bzw. Körperschaft (`actor_id_fields`). |
| Ereignis: Ort | `source_config.via` | Ort über eine zweite Beziehung, z. B. Sitz des Verlags. |
| Ereignis: Datum | `label_field` | Datumsart als Beschriftung; „1905/“ wird zu „nach 1905“ und frühestem Datum 1905. |
| Ereignis: Material/Technik | `kind` | `material` oder `technique`. |
| Ereignis: Beschreibung | – | z. B. Frankierung, Stempel. |

Personen und Körperschaften unterscheidet `actor_types` anhand des Entitäts-Subtyps (`{ind: person, unternehmen: corporation}`).

## Beispiel: Ort der Herstellung = Sitz des Verlags

```yaml
- source_kind: relation
  source_config:
    relation_type: creator
    via: {relation_type: ansaessig, target_type: place}
  target_key: lido:events/production/place
```

Ein vollständiges Beispiel-Mapping für Bildpostkarten liegt im Katalon-Repository unter `backend/tests/fixtures/lido_ddb_mapping.yaml`.

:::caution[Lizenzkorb prüfen]
Die in Katalon hinterlegte Liste der DDB-Lizenz-URIs folgt einem von der DDB akzeptierten Altexport. Vergleichen Sie sie vor der ersten Lieferung mit der aktuellen Liste der DDB.
:::
