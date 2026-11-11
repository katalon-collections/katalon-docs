---
title: Erste Schritte
description: Minimaler Weg vom leeren Katalon bis zum ersten öffentlichen Datensatz.
---

## 1. Anmelden

Öffne die Admin-Oberfläche und melde dich mit dem automatisch erzeugten Admin-Account an.

```text
http://localhost/admin/
```

## Übersicht nach der Anmeldung

:::note[Verfügbar ab Version 1.42.0]
:::

Die **Übersicht** ist die neue Startansicht im Admin. Sie bündelt zuletzt bearbeitete Datensätze, eigene Bearbeitungssperren, Arbeitslisten, anstehende Vorgangsfristen und offene Entwürfe. Ein Klick führt zum jeweiligen Datensatz oder Arbeitsbereich; eigene Sperren können dort freigegeben werden. Welche Daten sichtbar sind, richtet sich nach deinen Berechtigungen.

Administrator:innen sehen zusätzlich Team-Aktivität, aktive Sperren und den Systemzustand. Über das Einstellungsmenü der Übersicht lassen sich Bereiche ein- und ausblenden; diese Auswahl wird in diesem Browser gespeichert.

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

### Dateianhänge am Feld „Datei“

:::note[Verfügbar ab Version 1.50.0]
:::

Dateien, die keine Digitalisate sind, etwa ein Leihvertrag, ein Programmheft oder ein Interview-Video, hängen Sie an einem Feld vom Typ **Datei** an. Das Feld muss im Schema angelegt sein; Einzelheiten stehen im Abschnitt [Feldtyp Datei](/katalon-docs/administration/schema#file--datei).

So gehen Sie vor:

1. Speichern Sie einen neuen Datensatz zuerst. Vor dem ersten Speichern zeigt das Feld den Hinweis „Zum Hochladen von Dateien den Datensatz zuerst speichern.“
2. Wählen Sie **Datei auswählen** oder ziehen Sie Dateien auf das Feld. Ist das Feld wiederholbar, können Sie weitere Dateien mit **Weitere Datei** hinzufügen.
3. Während des Hochladens zeigt das Feld den Fortschritt. Abgelehnte Dateien erhalten eine Meldung mit dem Grund, etwa einen nicht erlaubten Dateityp oder eine zu große Datei.
4. Speichern Sie den Datensatz. Erst dann ist die Datei dem Datensatz zugeordnet.

Zum Ansehen klicken Sie auf den Dateinamen oder das Symbol für Ansehen. Das Vorschaufenster zeigt PDFs mit Scrollleiste, Bilder sowie Audio und Video mit Abspielsteuerung. Mit dem Symbol für Herunterladen speichern Sie die Datei.

Das Symbol für Entfernen nimmt die Datei zunächst nur aus dem Formular. Wirksam wird das mit dem Speichern. Danach ist die Datei im Portal nicht mehr abrufbar. Sie bleibt auf dem Server, bis der Betrieb sie aufräumt. Dasselbe gilt für Dateien, die hochgeladen, aber nicht gespeichert wurden.

Die Schaltflächen sind Symbole. Beim Darüberfahren zeigen sie ihre Bezeichnung, die auch Bildschirmleseprogramme vorlesen.

> **Bild vorgesehen: Feld Datei im Erfassungsformular.**
> Zeigen: Feld „Vertrag“ mit einer hochgeladenen PDF-Datei und einem Video, das gerade hochgeladen wird. Alt-Text: „Dateifeld im Erfassungsformular mit zwei angehängten Dateien.“

Im Portal erscheinen die Dateien eines öffentlichen Feldes auf der Detailseite als Liste.

## 5. Veröffentlichen

Setze den Status auf `public`. Danach ist der Datensatz im Portal und in öffentlichen API-Antworten sichtbar.
