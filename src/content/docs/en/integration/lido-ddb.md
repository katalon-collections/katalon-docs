---
title: LIDO for the DDB
description: Configure the LIDO export to meet the requirements of the Deutsche Digitale Bibliothek – DDB profile, check report and example mapping.
---

:::note[Available from version 1.42.0]
DDB profile, `lido-report` check, one `resourceSet` per medium and the settings described below.
:::

The LIDO export can be adapted to the requirements of the Deutsche Digitale Bibliothek (DDB) entirely through the mapping set: rules, their settings and the institution details. Everything can be set in the mapping editor (**Export → Format mapping**, type *Objects*, format *LIDO*). If you maintain several instances, you can also export a finished mapping as YAML and import it elsewhere.

## What Katalon handles automatically

- **Terminology URIs instead of words** in attributes (e.g. preferred title `http://terminology.lido-schema.org/lido00169`, current repository `…/lido00475`).
- **Clean text:** leading and trailing spaces and line breaks are removed, rich text HTML becomes plain text. Empty fields create no empty elements.
- **No duplicates:** a place reached through two publishers appears only once.
- **Authority URIs in the form the DDB resolves**, e.g. GeoNames always as `https://sws.geonames.org/2950159/` (with trailing slash).
- **The record's change date** in `recordMetadataDate` instead of the export time. Changing an image's license or credit line also marks the object as changed, so the next harvest picks it up.

## Turning on the DDB profile

The mapping set's **institution details** contain the section **Delivery to aggregators (DDB)**:

- **Check DDB profile:** turns on the checks below.
- **Output images individually:** one `resourceSet` per public image (always on with the DDB profile).
- **Institution as rights holder of the metadata / of the object:** outputs ISIL and name in `recordRights` and `rightsWorkSet`.
- **License if an image has none:** none, from an object field (e.g. *rights model*, whose vocabulary URI is used) or a fixed license URI.
- **Authority fields for persons, organisations and places:** field names on the linked records whose GND, Wikidata, GeoNames etc. values appear as `actorID` or `placeID`.
- **Person or organisation:** maps entity subtypes to the LIDO actor type.
- **Authority IDs of the location** and **further inventory numbers** for `repositorySet`.

With **Check DDB profile** the following also applies:

- If a public image has no license (not even through the fallback), the record is not delivered: "Rechteangabe zum Digitalisat fehlt". OAI-PMH reports it as deleted so the DDB removes an earlier copy. Once the image has a license, the record is delivered again.
- License URIs of images and metadata must be in the DDB license basket (exact spelling; Katalon rewrites known licenses into the usual form).
- Every public image gets a `resourceSet` with image links (IIIF, full size and preview), type `image`, license, rights holder and credit line. The primary image comes first.

Affected records are shown as warnings in the mapping preview.

## Credit line on images

In the record form, each medium has the field **Permission note / credit line** under **Rights**, next to license URI and rights holder. It takes notes such as "Published with permission of …; any further use requires permission". The text appears in the portal below the image's rights and in the LIDO export as `rightsResource/creditLine`. The rights holder's name still belongs in its own field.

## Object type with several authority concepts

On the subtype (**Settings → Subtypes**) you can add **further concepts** below the authority link, e.g. AAT "postcards" in addition to GND "Postkarte". The export lists the main concept as preferred term and the others as alternative terms with language.

## Check report before delivery

Before the DDB harvests, check on the server which records would be left out. The command runs in the API container:

```bash
docker compose exec -T api katalon-manage lido-report --mapping-set <mapping set ID> > lido-report.csv
```

The API returns the mapping set ID (`GET /v1/export-mapping-sets?format_key=lido`). The console shows the number of affected records per problem; the CSV file lists each record with its `lidoRecID` and message.

## Key settings per rule

These settings appear in the rule editor directly below the source of each target:

| Target | Setting | Effect |
|---|---|---|
| Object type (`objectWorkType`) | Type | e.g. `Kartentypus`; several rules are allowed (subtype authority data and a field). |
| Classification | Type | Free term or URI, e.g. `http://terminology.lido-schema.org/lido01135` for collection. |
| Inscription | Inscription description | e.g. "printed, front". Group sub-fields can be picked as "Group › Sub-field". |
| Description | Type | e.g. `Beschreibung`. |
| Measurement (structured) | Measurement type, unit | "9,2 cm" becomes value 9.2 and unit cm, plus "9,2 × 13,9 cm" for display. |
| Event: actor | Role, role URI | Authority IDs (GND, Wikidata …) come from the authority fields of the person or organisation (see above). |
| Event: place | Continue via relation | Place through a second relation, e.g. publisher → "based in" → place. |
| Event: date | Date type field | Date type as label; "1905/" becomes "nach 1905" and earliest date 1905. |
| Event: material / technique (term) | Kind | Material or technique; vocabulary URIs are included. |
| Event: description | – | e.g. postage, postmark. |

New events (**Add event**) carry their LIDO concept URI, e.g. *Creation (intellectual)* (`lido00012`) or *Use* (`lido00011`). For custom events you can enter the URI when adding them.

## Example: place of production = publisher's seat

In the rule editor: target *Production: place*, source *Relation*, relation type *creator/publisher*, **Continue via relation** *based in*, target of the second relation *Places*. As YAML:

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
