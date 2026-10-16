---
title: LIDO für die DDB
description: LIDO-Export so konfigurieren, dass er die Anforderungen der Deutschen Digitalen Bibliothek erfüllt – mit DDB-Profil, Prüfbericht und Beispiel-Mapping.
---

:::note[Verfügbar ab Version 1.42.0]
DDB-Profil, Prüfbericht `lido-report`, `resourceSet` je Medium und die unten beschriebenen Einstellungen.
:::

Der LIDO-Export lässt sich vollständig über das Mapping-Set an die Anforderungen der Deutschen Digitalen Bibliothek (DDB) anpassen: Regeln, deren Einstellungen und die Institutionsangaben. Alles ist im Mapping-Editor einstellbar (**Export → Format-Mapping**, Typ *Objekte*, Format *LIDO*). Wer mehrere Instanzen pflegt, kann ein fertiges Mapping zusätzlich als YAML exportieren und importieren.

## Was Katalon automatisch richtig macht

- **Terminologie-URIs statt Wörtern** in Attributen (z. B. bevorzugter Titel `http://terminology.lido-schema.org/lido00169`, aktueller Standort `…/lido00475`).
- **Bereinigte Texte:** Leerzeichen und Zeilenumbrüche am Anfang und Ende werden entfernt, HTML aus Richtext wird zu Klartext. Leere Felder erzeugen keine leeren Elemente.
- **Keine Dubletten:** Kommt derselbe Ort über zwei Verlage zweimal vor, steht er nur einmal im Export.
- **Normdaten-URIs in der Form, die die DDB auflöst**, z. B. GeoNames immer als `https://sws.geonames.org/2950159/` (mit Schrägstrich am Ende).
- **Änderungsdatum des Datensatzes** in `recordMetadataDate` statt des Exportzeitpunkts. Ändern Sie die Lizenz oder den Freigabehinweis eines Bildes, gilt auch das Objekt als geändert und wird beim nächsten Harvest neu abgeholt.

## DDB-Profil einschalten

In den **Institutionsangaben** des Mapping-Sets gibt es den Abschnitt **Lieferung an Aggregatoren (DDB)**:

- **DDB-Profil prüfen:** schaltet die Prüfungen unten ein.
- **Digitalisate einzeln ausgeben:** je öffentlichem Bild ein `resourceSet` (mit DDB-Profil immer an).
- **Institution als Rechteinhaberin der Metadaten / am Objekt:** gibt ISIL und Namen in `recordRights` bzw. `rightsWorkSet` aus.
- **Lizenz, wenn ein Bild keine hat:** keine, aus einem Objektfeld (z. B. *Rechtemodell*, dessen Vokabular-URI verwendet wird) oder eine feste Lizenz-URI.
- **Normdatenfelder für Personen, Körperschaften und Orte:** Feldnamen der verknüpften Datensätze, deren GND-, Wikidata-, GeoNames- usw. Werte als `actorID` bzw. `placeID` erscheinen.
- **Person oder Körperschaft:** ordnet Entitäts-Subtypen der LIDO-Akteursart zu.
- **Normdaten des Standorts** und **weitere Inventarnummern** für `repositorySet`.

Mit **DDB-Profil prüfen** gilt zusätzlich:

- Hat ein öffentliches Bild keine Lizenz (auch nicht über den Fallback), wird der Datensatz nicht ausgeliefert: „Rechteangabe zum Digitalisat fehlt“. Per OAI-PMH wird er als gelöscht gemeldet, damit die DDB eine ältere Fassung entfernt. Sobald das Bild eine Lizenz hat, wird er wieder geliefert.
- Lizenz-URIs von Bildern und Metadaten müssen im DDB-Lizenzkorb stehen (exakte Schreibweise; Katalon schreibt bekannte Lizenzen automatisch in die übliche Form um).
- Für jedes öffentliche Bild entsteht ein `resourceSet` mit Bild-Link (IIIF, volle Größe und Vorschau), Typ `image`, Lizenz, Rechteinhaber und Freigabehinweis. Das Hauptbild steht zuerst.

Betroffene Datensätze erscheinen in der Mapping-Vorschau als Warnung.

## Freigabehinweis am Bild

Im Objektformular hat jedes Medium unter **Rechteangaben** neben Lizenz-URI und Rechteinhaber das Feld **Freigabehinweis / Credit Line**. Es nimmt Hinweise wie „Veröffentlichung genehmigt von …; jede weitere Verwendung bedarf der Genehmigung“ auf. Der Text erscheint im Portal unter den Rechteangaben des Bildes und im LIDO-Export in `rightsResource/creditLine`. Der Name des Rechteinhabers gehört weiterhin in das eigene Feld.

## Objektart mit mehreren Normdaten

Am Subtyp (**Einstellungen → Subtypen**) lassen sich unter der Normdaten-Verknüpfung **weitere Konzepte** hinzufügen, z. B. AAT „postcards“ zusätzlich zur GND „Postkarte“. Im Export steht das Hauptkonzept als bevorzugter Begriff, die weiteren als alternative Begriffe mit Sprachangabe.

## Prüfbericht vor der Lieferung

Bevor die DDB harvestet, lässt sich auf dem Server prüfen, welche Datensätze ausgeschlossen würden. Der Befehl läuft im API-Container:

```bash
docker compose exec -T api katalon-manage lido-report --mapping-set <ID des Mapping-Sets> > lido-report.csv
```

Die ID des Mapping-Sets liefert die API (`GET /v1/export-mapping-sets?format_key=lido`). Auf der Konsole erscheint die Anzahl betroffener Datensätze je Fehlerart; die CSV-Datei listet jeden Datensatz mit `lidoRecID` und Fehlertext.

## Wichtige Einstellungen je Regel

Die folgenden Einstellungen erscheinen im Regel-Editor direkt unter der Quelle des jeweiligen Ziels:

| Ziel | Einstellung | Wirkung |
|---|---|---|
| Objektart (`objectWorkType`) | Typ | z. B. `Kartentypus`; mehrere Regeln sind erlaubt (Subtyp-Normdaten und ein Feld). |
| Klassifikation | Typ | Freier Begriff oder URI, z. B. `http://terminology.lido-schema.org/lido01135` für Sammlung. |
| Inschrift | Inschriftbeschreibung | z. B. „gedruckt, Vorderseite“. Unterfelder einer Gruppe sind in der Feldauswahl als „Gruppe › Unterfeld“ wählbar. |
| Beschreibung | Typ | z. B. `Beschreibung`. |
| Maß (strukturiert) | Maßart, Einheit | „9,2 cm“ wird zu Wert 9.2 und Einheit cm; dazu „9,2 × 13,9 cm“ als Anzeige. |
| Ereignis: Akteur | Rolle, Rollen-URI | Normdaten (GND, Wikidata …) kommen aus den Normdatenfeldern der Person bzw. Körperschaft (siehe oben). |
| Ereignis: Ort | Weiter über Beziehung | Ort über eine zweite Beziehung, z. B. Verlag → „ansässig in“ → Ort. |
| Ereignis: Datum | Feld für Datumsart | Datumsart als Beschriftung; „1905/“ wird zu „nach 1905“ und frühestem Datum 1905. |
| Ereignis: Material / Technik (Begriff) | Art | Material oder Technik; Vokabular-URIs werden mit ausgegeben. |
| Ereignis: Beschreibung | – | z. B. Frankierung, Stempel. |

Neue Ereignisse (**Ereignis hinzufügen**) bringen die LIDO-Konzept-URI mit, z. B. *Geistige Schöpfung* (`lido00012`) oder *Gebrauch* (`lido00011`). Bei eigenen Ereignissen kann die URI beim Anlegen eingetragen werden.

## Beispiel: Ort der Herstellung = Sitz des Verlags

Im Regel-Editor: Ziel *Herstellung: Ort*, Quelle *Beziehung*, Beziehungstyp *Urheber/Verlag*, **Weiter über Beziehung** *ansässig in*, Ziel der zweiten Beziehung *Orte*. Als YAML:

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
