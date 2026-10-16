---
title: LIDO for the DDB
description: Configure the LIDO export to meet the requirements of the Deutsche Digitale Bibliothek – DDB profile, check report and example mapping.
---

:::note[Available from version 1.42.0]
DDB profile, `lido-report` check, one `resourceSet` per medium and the settings described below.
:::

The LIDO export can be adapted to the requirements of the Deutsche Digitale Bibliothek (DDB) entirely through the mapping set: rules, their settings and the institution details. The simplest way is to export a mapping as YAML, extend it and import it again (**Export → Format mapping → Export / import YAML**).

:::caution[Settings currently via YAML only]
The new rule settings (e.g. `type`, `measurement_type`, `kind`, `via`) and the DDB institution details do not yet have their own input fields in the mapping editor. Set them via YAML import; they are kept when you edit the rule in the editor as long as you do not switch the rule's source type.
:::

## What Katalon handles automatically

- **Terminology URIs instead of words** in attributes (e.g. preferred title `http://terminology.lido-schema.org/lido00169`, current repository `…/lido00475`).
- **Clean text:** leading and trailing spaces and line breaks are removed, rich text HTML becomes plain text. Empty fields create no empty elements.
- **No duplicates:** a place reached through two publishers appears only once.
- **Authority URIs in the form the DDB resolves**, e.g. GeoNames always as `https://sws.geonames.org/2950159/` (with trailing slash).
- **The record's change date** in `recordMetadataDate` instead of the export time. Changing an image's license or credit line also marks the object as changed, so the next harvest picks it up.

## Turning on the DDB profile

In the mapping set's institution details:

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
  record_rights_holder: true      # institution as rights holder of the metadata
  rights_work_holder: true        # institution as rights holder of the object
  resource_rights_fallback: object_field:rights.rechtemodell
```

With `profile: ddb`, Katalon checks every record in addition:

- If a public image has no license (not even through the fallback), the record is left out of the OAI export: "Rechteangabe zum Digitalisat fehlt".
- License URIs of images and metadata must be in the DDB license basket (exact spelling; Katalon rewrites known licenses into the usual form).
- Every public image gets a `resourceSet` with image links (IIIF, full size and preview), type `image`, license, rights holder and credit line of the medium. The primary image comes first.

Affected records are shown as warnings in the mapping preview.

## Check report before delivery

Before the DDB harvests, check on the server which records would be left out:

```bash
katalon-manage lido-report --mapping-set <mapping set ID> --output lido-report.csv
```

The output gives the number of affected records per problem; the CSV file lists each record with its `lidoRecID` and message.

## Key settings per rule

| Target | Setting | Effect |
|---|---|---|
| Object type (`objectWorkType`) | `type` | e.g. `Kartentypus`; several rules are allowed (subtype authority data and a field). |
| Classification | `type` | Free term or URI, e.g. `http://terminology.lido-schema.org/lido01135` for collection. |
| Inscription | `description` | e.g. "printed, front". Group sub-fields as `group.subfield`. |
| Description | `type` | e.g. `Beschreibung`. |
| Measurement (structured) | `measurement_type`, `unit` | "9,2 cm" becomes value 9.2 and unit cm, plus "9,2 × 13,9 cm" for display. |
| Event: actor | `role`, `role_uri` | Role; authority IDs (GND, Wikidata …) come from the person's or organisation's fields (`actor_id_fields`). |
| Event: place | `source_config.via` | Place through a second relation, e.g. the publisher's seat. |
| Event: date | `label_field` | Date type as label; "1905/" becomes "nach 1905" and earliest date 1905. |
| Event: material/technique | `kind` | `material` or `technique`. |
| Event: description | – | e.g. postage, postmark. |

`actor_types` tells persons from organisations by the entity subtype (`{ind: person, unternehmen: corporation}`).

## Example: place of production = publisher's seat

```yaml
- source_kind: relation
  source_config:
    relation_type: creator
    via: {relation_type: ansaessig, target_type: place}
  target_key: lido:events/production/place
```

A complete example mapping for picture postcards is in the Katalon repository at `backend/tests/fixtures/lido_ddb_mapping.yaml`.

:::caution[Check the license basket]
Katalon's list of DDB license URIs follows a legacy export the DDB accepted. Compare it with the DDB's current list before the first delivery.
:::
