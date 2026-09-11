---
title: Export-Mappings
description: Metadatenfelder auf Zielformate wie Dublin Core (oai_dc) und LIDO mappen sowie Voraussetzungen an Datenmodell und Erfassung verstehen.
---

Katalon trennt interne Erfassungsfelder von externen Metadatenformaten. Über die datengetriebene Mapping-Schicht kann jedes Schemafeld auf Zielpfade externer Exportmodelle gemappt werden.

Die Konfiguration erfolgt auf einer eigenen Oberfläche, getrennt vom Schema-Editor (**Export → Format-Mapping**, Typ und Format wählen).

:::tip[Export beginnt bei der Erfassung]
Ein Export-Mapping kann nur transportieren, was im Erfassungsschema strukturiert angelegt und gepflegt wurde. Während einfache Formate wie Dublin Core mit wenigen Standardfeldern auskommen, verlangen Standards wie LIDO eine tiefere Datenmodellierung (z. B. Relationen zu Akteuren, Ereignisse und strukturierte Maße). Hinweise zur Vorbereitung der Schemata finden Sie weiter unten unter [Das Datenmodell exportfähig gestalten](#das-datenmodell-exportfähig-gestalten).
:::
---

## Funktionsweise

- Ein Feld aus `field_definitions` kann auf mehrere Exportziele gemappt werden.
- Ein Exportziel ist ein konkreter Zielpfad innerhalb eines Exportformats (z. B. `dc:creator` oder `dc:date`).
- Format-spezifische Serialisierung bleibt im Backend-Export-Service gekapselt, das Mapping selbst bleibt rein deklarativ.
- Werden für einen Primärtyp keine spezifischen Mappings hinterlegt, greift für OAI-DC ein konservativer Standard-Fallback (Titel, Datum, Beschreibung).

---

## Unterstützte und gängige Zielformate

### Dublin Core (`oai_dc`) – Geringe Einstiegshürde (recht easy)

Dublin Core ist das am einfachsten zu bedienende Format. Da es ein rein flaches Modell aus 15 unstrukturierten Basiselementen ist, sind die Voraussetzungen denkbar gering: Bereits wenige Standardfelder wie Titel, Identifikator und eine grobe Datierung oder Beschreibung genügen für einen funktionierenden Export.

Fast jeder in Katalon erfasste Datensatz lässt sich ohne aufwendige Vorarbeiten nach Dublin Core überführen. Der Preis dafür ist der Verlust an semantischer Tiefe: Spezifische Akteursrollen (Maler:in vs. Vorbesitzer:in vs. Restaurator:in), strukturierte Maße oder differenzierte Ereignisse gehen im flachen Text verloren.

Im Format-Mapping stehen die 15 Standard-Elemente zur Auswahl:

- `dc:title`: Titel oder Bezeichnung
- `dc:creator`: Urheber:in / Schöpfer:in
- `dc:subject`: Thema, Schlagworte, Klassifikation
- `dc:description`: Beschreibung, Annotation
- `dc:publisher`: Verlag oder herausgebende Institution
- `dc:contributor`: Beteiligte Personen oder Körperschaften
- `dc:date`: Entstehungs- oder Publikationsdatum
- `dc:type`: Objekttyp, Gattung
- `dc:format`: Physisches oder digitales Format
- `dc:identifier`: Inventarnummer, Signatur, URI
- `dc:source`: Herkunft, Vorlage
- `dc:language`: Sprache des Objekts
- `dc:relation`: Verwandte Ressourcen
- `dc:coverage`: Räumlicher oder zeitlicher Geltungsbereich
- `dc:rights`: Rechteangaben, Lizenz

### LIDO (`lido`) – Ereignisorientierter Museumsstandard

LIDO (Lightweight Information Describing Objects) ist als Zielformat für museale Bestände nutzbar. Das Feldmapping erfolgt über dieselbe Oberfläche wie bei Dublin Core. Es dient standardisierten Exporten an Aggregatoren wie die Deutsche Digitale Bibliothek (DDB) und Europeana. LIDO verlangt eine wesentlich tiefere und strukturiertere Datenbasis als Dublin Core.

### Weitere Standardformate im GLAM-Sektor

Je nach Sparte verlangen Aggregatoren und Portale unterschiedliche Datenformate:

- **LIDO:** Primärstandard für Museen und Kunstsammlungen ([lido-schema.org](https://lido-schema.org/)).
- **MODS (Metadata Object Description Schema):** Standard der Library of Congress für bibliothekarische Objekte, Druckschriften und digitalisierte Textmaterialien ([MODS-Spezifikation der Library of Congress](https://www.loc.gov/standards/mods/)).
- **EAD (Encoded Archival Description):** XML-Standard für Findmittel und hierarchische Bestände im Archivbereich ([EAD der Library of Congress / ICA](https://www.loc.gov/ead/)).
- **METS (Metadata Encoding and Transmission Standard):** Containerformat, das Digitalisate mit bibliografischen und technischen Metadaten bündelt (häufig als METS/MODS oder METS/LIDO).
---

## Werttransformation beim Export

- **Einfache Text- und Datumsfelder:** Der Feldwert wird direkt in das Ziel-XML-Element übertragen.
- **Wiederholbare Felder:** Erzeugen im Ziel-XML automatisch mehrere Wiederholungen des Ziel-Elements (z. B. mehrere `<dc:creator>`-Tags bei mehreren beteiligten Personen).
- **Vokabulare:** Das Mapping löst Begriffe automatisch in ihr für die Zielsprache hinterlegtes Label auf.

---

## Warum Export kein Selbstläufer ist: Freies Schema und Domänenwissen

Katalon schreibt kein starres Einheitsschema vor. Jede Institution definiert eigene Felder, Typen und Relationen. Diese Flexibilität erlaubt eine passgenaue Erfassung für Spezialbestände, bringt jedoch eine direkte Konsequenz für Exporte mit sich:

**Die Mapping-Schicht kann nur transportieren, was im Datenmodell strukturiert vorhanden ist.**

Ein Export nach Dublin Core gelingt fast immer, weil Dublin Core lediglich unstrukturierte Textfelder erwartet. Ein Zielformat wie LIDO verlangt dagegen eine fundierte Ereignis- und Akteursstruktur. Wer in Katalon lediglich einen Freitexttitel und ein unstrukturiertes Maßfeld erfasst, kann diesen Datensatz nicht ohne Weiteres nach LIDO exportieren.

Für spätere Versionen von Katalon sind domänenspezifische Installationsprofile (z. B. für Museen oder Fotosammlungen) geplant. Solche Profile werden das Erfassungsschema und das passende Export-Mapping bereits vorkonfiguriert mitliefern. Bis dahin, sowie bei jedem individuell angepassten Schema, liegt die Konzeption bei den Domänenexpert:innen, die das Schema aufsetzen.

---

## Voraussetzungen ermitteln: Wo schlägt man Pflichtfelder nach?

Jedes Zielformat definiert verbindliche Mindestanforderungen. Vor dem Anlegen von Feldern oder Mappings muss geklärt werden, welche Elemente das Zielsystem zwingend voraussetzt:

1. **Übersicht der Lieferformate (DDB):** Für Institutionen in Deutschland bietet die Deutsche Digitale Bibliothek eine zentrale Zusammenstellung unter [DDB Lieferformate](https://deutsche-digitale-bibliothek.atlassian.net/wiki/spaces/DFD/pages/48104286/Lieferformate). Dort ist aufgeschlüsselt, welche Sparten welche Formate (LIDO, MODS, EAD, MARC21, Dublin Core) liefern müssen.
2. **Format-Dokumentation des GBV:** Die Verbundzentrale des Gemeinsamen Bibliotheksverbunds pflegt unter [format.gbv.de](https://format.gbv.de/) eine praxisnahe, deutschsprachige Dokumentation zu allen gängigen Metadatenformaten (u. a. LIDO, MODS, Dublin Core, EAD und MARC21). Die Seite ist ein idealer Einstieg, um Feldstrukturen und Konventionen nachzuschlagen.
3. **Format-Spezifikationen:** Die offiziellen Spezifikationen definieren die Grundstruktur der Schemata:
   - LIDO: [lido-schema.org](https://lido-schema.org/)
   - MODS: [loc.gov/standards/mods](https://www.loc.gov/standards/mods/)
   - EAD: [loc.gov/ead](https://www.loc.gov/ead/)
4. **Anwendungsprofile der Aggregatoren:** Aggregatoren stellen in der Regel eigene Richtlinien auf, die strenger sind als das Basisschema (z. B. das **DDB-LIDO-Anwendungsprofil** oder Europeana-Richtlinien).
5. **Schematron-Regeln und Pflichtelemente:** Viele Portale prüfen gelieferte Datensätze automatisiert über Schematron-Validatoren. Typische Pflichtangaben bei LIDO sind beispielsweise:
   - Mindestens ein beschreibender Objekttitel (`lido:titleSet`)
   - Eindeutige Inventarnummer oder persistenter Identifikator (`lido:recordID` / `lido:workID`)
   - Objekttyp bzw. Sachbegriff (`lido:objectClassificationWrap`)
   - Mindestens ein Herstellungs- oder Entstehungsereignis (`lido:eventSet` mit Event-Typ `Herstellung`)
   - Verknüpfte Akteure mit Rollenangabe (`lido:eventActor` / `lido:roleActor`)
   - Datierung des Ereignisses mit sortierbaren Zeitgrenzen (`earliestDate` und `latestDate`)
   - Rechteangaben zur digitalen Abbildung und zum Objekt (`lido:rightsWorkWrap`)

Fehlen diese Daten im Quellsystem, weist der Aggregator den gesamten Datensatz beim Ingest ab.

---

## Das Datenmodell exportfähig gestalten

Damit Katalon-Felder auf komplexe Zielpfade gemappt werden können, muss das Schema die notwendige Granularität mitbringen.

### 1. Ereignisse und Akteure statt Freitext

- **Ungeeignet für LIDO:** Ein einfaches Textfeld `urheber` mit dem Inhalt `"Gemalt von Marta Keller 1920 in München"`. Für Dublin Core genügt das als `dc:creator` oder `dc:description`. In LIDO scheitert das Mapping, weil Akteur, Rolle, Datum und Ort nicht getrennt ausgelesen werden können.
- **Geeignet für LIDO:**
  - Das Objekt wird über ein Relationsfeld (z. B. `hergestellt von`) mit einem eigenständigen Datensatz vom Typ **Entität** (Person) verknüpft.
  - Der Relationstyp definiert die Rolle (`Maler:in`, `Fotograf:in`, `Hersteller:in`).
  - Ein separates Datierungsfeld speichert die Entstehungszeit mit normiertem Jahr oder ISO-Intervall.
  - Der Ort wird als Relation zu einem Datensatz vom Typ **Ort** erfasst.

### 2. Strukturierte Maße statt Maß-Strings

- **Ungeeignet für LIDO:** Ein Freitextfeld `masse` mit `"Höhe 45 cm, Breite 30 cm"`.
- **Geeignet für LIDO:** Getrennte Felder für Wert, Maßeinheit und Maßtyp (z. B. über Gruppenfelder oder spezifische Zahlenfelder `hoehe_cm`, `breite_cm`). LIDO erwartet getrennte XML-Knoten für `measurementValue`, `measurementUnit` und `measurementType`.

### 3. Kontrollierte Vokabulare für Typen und Gattungen

- **Ungeeignet für LIDO:** Ein Freitextfeld `objektart` mit beliebigen, uneinheitlichen Bezeichnungen (z. B. mal `"Gemälde"`, mal `"Ölbild"`).
- **Geeignet für LIDO:** Ein Vokabularfeld, das an ein kontrolliertes Systemvokabular oder externe Normdaten (wie den Art & Architecture Thesaurus, AAT) angebunden ist. LIDO kann dadurch neben dem Textlabel auch die stabile URI des Begriffs (`lido:conceptID`) exportieren.

### 4. Rechte und Lizenzen

Aggregatoren verlangen maschinenlesbare Rechtehinweise. Legen Sie im Schema für Objekte und Mediendateien Vokabularfelder für Lizenzen an (z. B. Creative Commons oder RightsStatements.org URIs), statt unstrukturierte Copyright-Vermerke zu verwenden.

---

## Vorgehen bei der Sammlungsplanung

Wer Exporte an externe Fachportale plant, sollte folgende Schritte durchlaufen:

1. **Zielsysteme klären:** Bestimmen, ob Bestände nur über OAI-DC nachgewiesen werden sollen oder ob Lieferungen an LIDO-basierte Portale (DDB, Europeana) vorgesehen sind.
2. **Anwendungsprofil beschaffen:** Die Pflichtfelder und Richtlinien des jeweiligen Aggregators heranziehen.
3. **Schema in Katalon abstimmen:** Vor Beginn der Massenerfassung sicherstellen, dass Akteure, Datierungen, Objekttypen und Maße als getrennte, strukturierte Felder existieren.
4. **Katalogisierende unterstützen:** Hilfetexte an den Schemafeldern hinterlegen, damit Pflichtdaten und Konventionen direkt im Erfassungsformular sichtbar sind.
5. **Mapping anlegen und testen:** Unter **Export → Format-Mapping** die Pfade verknüpfen und Beispieldatensätze über den Export abrufen und validieren.
