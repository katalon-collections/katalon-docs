---
title: Erste Schritte
description: Minimaler Weg vom leeren Katalon bis zum ersten öffentlichen Datensatz.
---

## 1. Anmelden

Öffne die Admin-Oberfläche und melde dich mit dem automatisch erzeugten Admin-Account an.

```text
http://localhost/admin/
```

## 2. Schema anlegen

Lege im Bereich **Schemata** zuerst Felder für einen Record-Typ an, zum Beispiel für `object`:

- `title` als Textfeld
- `description` als Richtext oder Text
- `date` als Datumsfeld
- `rights` als Text- oder Vokabularfeld

Felder können Pflichtfelder, wiederholbar, suchbar, facettierbar und mehrsprachig beschriftet sein.

## 3. Datensatz erfassen

Lege im Bereich **Objekte** einen neuen Datensatz an. Entwürfe duerfen unvollständig sein. Für öffentliche Datensätze greifen Pflichtfelder und Sichtbarkeitsregeln.

## 4. Medien hochladen

Bei Objekten können Medien hochgeladen werden. Katalon erzeugt daraus IIIF-fähige Bilddaten und ein Manifest für den Portal-Viewer.

## 5. Veröffentlichen

Setze den Status auf `public`. Danach ist der Datensatz im Portal und in öffentlichen API-Antworten sichtbar.
