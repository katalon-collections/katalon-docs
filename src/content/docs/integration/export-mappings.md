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

## Referenztabelle aller Exportformate

Katalon Collections unterstützt eine breite Palette an standardisierten Exportformaten für den wissenschaftlichen und musealen Datenaustausch sowie für Langzeitarchivierung und Datenanalyse.

Die folgende Tabelle bietet eine strukturierte Übersicht über alle verfügbaren Formate, deren Schemagrundlage, den internen Validierungsstatus sowie externe Prüfwerkzeuge:

| Format / Schlüssel | Standard & Schema | Typischer Einsatzzweck | Validierungsstatus in Katalon | Externe Validatoren & Prüftools |
|---|---|---|---|---|
| **OAI Dublin Core** (`oai_dc`) | Dublin Core Simple (RFC 5013), [oai_dc.xsd](http://www.openarchives.org/OAI/2.0/oai_dc.xsd) | Universeller OAI-PMH-Austausch, Basis-Metadaten-Harvester | Vorprüfung: XSD-Schema-Validierung; automatische Fallbacks für `dc:type` und `dc:identifier`. Keine inhaltliche Schematron-Prüfung. | [OAI-PMH Validator (OVAL)](http://oval.base-search.net/), [DDB-Validierungstool](https://validator.deutsche-digitale-bibliothek.de/) |
| **LIDO 1.0** (`lido`) | LIDO 1.0 (ICOM-CIDOC), [lido-v1.0.xsd](http://www.lido-schema.org/schema/v1.0/lido-v1.0.xsd) | Museale Bestände, Kunstsammlungen, DDB und Europeana | Vorprüfung: LIDO 1.0 XSD; Pflichtprüfung auf Objekttitel (`appellationValue`), Objekttyp (`objectWorkType`) und Ereignistyp. Keine aggregatorspezifischen Schematron-Prüfungen. | [DDB-Validierungstool](https://validator.deutsche-digitale-bibliothek.de/), [Europeana Schematron Validator](https://metis.europeana.eu/schematron-validator/) |
| **METS/MODS 3.8** (`mets_mods`) | MODS 3.8 & METS 1.12 (LoC), [mods-3-8.xsd](http://www.loc.gov/standards/mods/v3/mods-3-8.xsd) | Bibliothekarische Objekte, Druckschriften, Text-Digitalisate | Vorprüfung: LOC MODS 3.8 XSD; Pflichtprüfung auf Haupttitel (`mods:titleInfo/mods:title`). Verbundspezifische Profile (z. B. DFG-Viewer) werden nicht geprüft. | [Library of Congress MODS Validator](https://www.loc.gov/standards/mods/), [DFG-Viewer Validierung](https://dfg-viewer.de/) |
| **CIDOC-CRM & LRMoo** (`json_ld`) | CIDOC-CRM (ISO 21127), LRMoo, [W3C JSON-LD 1.1](http://www.w3.org/ns/json-ld) | Linked Open Data (LOD), Semantisches Web, SPARQL 1.1 | Vorprüfung: W3C JSON-LD / RDF Syntax; Typprüfung Primärklassen (`E22`, `E21`, `F1_Work`) und Relationen. Keine dynamische OWL-Inferenz. | [W3C JSON-LD Playground](https://json-ld.org/playground/), [W3C RDF Validator](https://www.w3.org/RDF/Validator/) |
| **BagIt Preservation Package** (`preservation`) | BagIt (RFC 8493), METS, PREMIS 3.0, Dublin Core | Übergabe an digitale Langzeitarchive (LZA / Trusted Repositories) | Vorprüfung: SHA-256 Prüfsummen für alle Master- und Derivatdateien (`manifest-sha256.txt`), BagIt-Header-Prüfung, PREMIS-Audit-Events. | [BagIt Python CLI](https://github.com/LibraryOfCongress/bagit-python), [JHOVE](https://jhove.openpreservation.org/), [DROID](https://www.nationalarchives.gov.uk/information-management/manage-information/preserving-digital-records/droid/) |
| **CSV & JSON Dumps** (`csv`, `json`) | RFC 4180 (CSV), RFC 8259 (JSON) | Datenexporte, Tabellenkalkulation, Auswertungen via Pandas/R | Vorprüfung: UTF-8 Kodierung, Entflachung von JSONB-Attributen; serverseitige RBAC-Filterung nach Sichtbarkeitsrechten. | [CSVLint](https://csvlint.io/), [JSONLint](https://jsonlint.com/) |

---

## Formate im Detail

### Dublin Core (`oai_dc`) – Geringe Einstiegshürde

Dublin Core ist das am einfachsten zu bedienende Format. Da es ein rein flaches Modell aus 15 unstrukturierten Basiselementen ist, sind die Voraussetzungen denkbar gering: Bereits wenige Standardfelder wie Titel, Identifikator und eine grobe Datierung oder Beschreibung genügen für einen funktionierenden Export.

Fast jeder in Katalon erfasste Datensatz lässt sich ohne aufwendige Vorarbeiten nach Dublin Core überführen. Der Preis dafür ist der Verlust an semantischer Tiefe: Spezifische Akteursrollen (Maler:in vs. Vorbesitzer:in vs. Restaurator:in), strukturierte Maße oder differenzierte Ereignisse gehen im flachen Text verloren.

Im Format-Mapping stehen die 15 Standard-Elemente zur Auswahl:
- `dc:title`: Titel oder Bezeichnung (Pflichtziel für gültige Datensätze)
- `dc:creator`: Urheber:in / Schöpfer:in
- `dc:subject`: Thema, Schlagworte, Klassifikation
- `dc:description`: Beschreibung, Annotation
- `dc:publisher`: Verlag oder herausgebende Institution
- `dc:contributor`: Beteiligte Personen oder Körperschaften
- `dc:date`: Entstehungs- oder Publikationsdatum
- `dc:type`: Objekttyp, Gattung (wird automatisch mit dem `record_type` belegt, falls ungemappt)
- `dc:format`: Physisches oder digitales Format
- `dc:identifier`: Inventarnummer, Signatur, URI (wird automatisch mit der internen OAI-Identifier-URI und `idno` ergänzt)
- `dc:source`: Herkunft, Vorlage
- `dc:language`: Sprache des Objekts (ISO-Code)
- `dc:relation`: Verwandte Ressourcen
- `dc:coverage`: Räumlicher oder zeitlicher Geltungsbereich
- `dc:rights`: Rechteangaben, Lizenz

### LIDO (`lido`) – Ereignisorientierter Museumsstandard

LIDO (Lightweight Information Describing Objects) ist der primäre Standard für Museen und Kunstsammlungen und wird von Aggregatoren wie der Deutschen Digitalen Bibliothek (DDB) und Europeana vorausgesetzt ([lido-schema.org](https://lido-schema.org/)).

- **Interne Validierung:** Katalon führt vor dem Export eine strukturelle Vorprüfung durch (`validate_mapping`):
  - Mindestens ein gemappter Objekttitel (`lido:objectIdentificationWrap/.../lido:appellationValue`).
  - Mindestens eine Objektart (`lido:objectClassificationWrap/.../lido:objectWorkType`).
  - Werden Ereignisfelder (Datum, Akteur, Ort) gemappt, verlangt das System zwingend auch einen gemappten Ereignistyp (`lido:eventWrap/.../lido:eventType/lido:term`).
- **Was nicht geprüft wird:** Institutionen- oder portalspezifische Pflichtregeln (z. B. das DDB-LIDO-Anwendungsprofil oder Schematron-Regeln der Europeana bezüglich Mindestauflösung von Digitalisaten oder kontrollierten Vokabularen).
- **Empfohlene externe Validierung:** Über das [DDB-Validierungstool](https://validator.deutsche-digitale-bibliothek.de/) oder den [Europeana Schematron Validator](https://metis.europeana.eu/schematron-validator/).

### METS/MODS (`mets_mods`) – Bibliothekarische Digitalisate

Das Metadata Object Description Schema (MODS 3.8) in Kombination mit dem Metadata Encoding and Transmission Standard (METS 1.12) ist der Standard der Library of Congress für bibliothekarische Objekte, Druckschriften und digitalisierte Handschriften ([loc.gov/standards/mods/](https://www.loc.gov/standards/mods/)).

- **Interne Validierung:** Das Kernprofil (`mets_mods_core`, Version 3.8) prüft die syntaktische Konformität der erzeugten XML-Knoten und fordert zwingend das Haupttitel-Element (`mods:titleInfo/mods:title`).
- **Verfügbare Zielpfade:** Neben Titel auch Verfasser/Urheber (`mods:name/mods:namePart`), Gattung (`mods:typeOfResource`), Entstehungsdatum (`mods:originInfo/mods:dateCreated`), Zusammenfassung (`mods:abstract`), Nutzungsbedingungen (`mods:accessCondition`), Identifikatoren (`mods:identifier`) und Sprachen (`mods:language/mods:languageTerm`).
- **Was nicht geprüft wird:** Spezifische Profilvorgaben wie das DFG-Viewer-Anwendungsprofil (z. B. bestimmte Strukturtypen im logischen und physischen Strukturbaum).

### CIDOC-CRM & LRMoo (`json_ld`) – Semantischer Graph & LOD

Der JSON-LD-Export projiziert Datensätze und typübergreifende Relationen in ein semantisches Wissensnetz basierend auf der CIDOC Conceptual Reference Model Ontologie (ISO 21127) und LRMoo (Library Reference Model object-oriented).

- **Interne Validierung:** Das Mapping erzeugt valides JSON-LD 1.1 mit standardisiertem `@context`. Klassen werden automatisch anhand des Kerntyps und Subtyps gemappt (z. B. `object` → `crm:E22_Human-Made_Object`, `entity` mit Subtyp `person` → `crm:E21_Person`, `occurrence` mit Subtyp `werk` → `lrmoo:F1_Work`). Relationen werden in standardisierte CRM-Properties übersetzt (`crm:P14_carried_out_by`, `crm:P138_represents`, `crm:P7_took_place_at`, `lrmoo:R3_is_realised_in`).
- **Was nicht geprüft wird:** Laufzeit-Inferenz über externe OWL-Ontologien oder Konsistenzprüfungen auf Disjunktheitsaxiome.
- **Prüftool:** Der offizielle [W3C JSON-LD Playground](https://json-ld.org/playground/) zur Überprüfung der Graphstruktur und N-Quads-Konvertierung.

### BagIt Preservation Package (`preservation`) – Langzeitarchivierung

Für die dauerhafte Bewahrung erzeugt Katalon standardkonforme Preservation Packages nach dem BagIt-Standard (IETF RFC 8493).

- **Inhalt des Pakets:**
  - `data/files/master/`: Unveränderte Originaldateien.
  - `data/files/derivatives/`: Vom Worker erzeugte Pyramiden-TIFFs (`.ptif`).
  - `data/metadata/descriptive.xml`: Beschreibende Metadaten (Dublin Core aus dem veröffentlichten Mapping).
  - `data/metadata/mets.xml`: Strukturierte Dateigruppen und Prüfsummen.
  - `data/metadata/premis.xml`: PREMIS-Bewahrungsereignisse aus dem internen Audit-Log.
  - `manifest-sha256.txt`: Kryptografische Prüfsummen aller Dateien im Payload-Verzeichnis.
- **Validierung:** Pakete können mit Standardwerkzeugen wie `bagit-python` (`bagit.py --validate <verzeichnis>`) auf Dateiintegrität und Vollständigkeit geprüft werden.

### CSV & JSON Dumps (`csv`, `json`) – Massenexport & Analyse

Über die Export-Endpunkte (`/v1/export/{record_type}?format=csv` bzw. `format=json`) können berechtigte Nutzerinnen und Nutzer vollständige Bestandsabzüge herunterladen.

- **Besonderheiten:**
  - JSONB-Metadaten werden für CSV automatisch in diskrete Spalten abgeflacht; JSON liefert die verschachtelte Datenstruktur.
  - **Sicherheitsfilterung:** Benutzer ohne Leserecht für Entwürfe oder interne Datensätze erhalten ausschließlich Datensätze mit Status `public`.
  - Geeignet für die Weiterverarbeitung in Data-Science-Pipelines (Python, Pandas, R, OpenRefine).
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

:::note[Verfügbar ab Version 1.37.0]
Eine Mapping-Regel der Quellenart „Relation" kann auch Relationen auswerten, bei denen
der zu exportierende Datensatz nicht die Quelle, sondern das Ziel ist (Einstellung
„Richtung: Eingehend"). Das erspart doppelte Relationsfelder — z. B. liest ein
Objekt-Export so eine Relation aus, die ein Vorgang auf dieses Objekt gesetzt hat,
ohne dass am Objekt selbst ein eigenes Feld dafür angelegt werden muss. Die Auswahl
der Relationsart im Mapping-Editor zeigt dabei nur Relationstypen, die für den
aktuellen Datensatztyp als Quelle oder Ziel zulässig sind.
:::

### 2. Strukturierte Maße statt Maß-Strings

- **Ungeeignet für LIDO:** Ein Freitextfeld `masse` mit `"Höhe 45 cm, Breite 30 cm"`.
- **Geeignet für LIDO:** Getrennte Felder für Wert, Maßeinheit und Maßtyp (z. B. über Gruppenfelder oder spezifische Zahlenfelder `hoehe_cm`, `breite_cm`). LIDO erwartet getrennte XML-Knoten für `measurementValue`, `measurementUnit` und `measurementType`.

### 3. Kontrollierte Vokabulare für Typen und Gattungen

Aggregatoren wie die Deutsche Digitale Bibliothek (DDB) und Europeana verlangen für `lido:objectWorkType` kontrollierte Begriffe mit stabilen URIs (bevorzugt Getty Art & Architecture Thesaurus [AAT] oder GND). Katalon unterstützt hierfür zwei bewährte Erfassungsstrategien:

:::note[Verfügbar ab Version 1.37.0]
Subtypen können direkt in der Konfiguration mit Normdaten (AAT, GND, Wikidata) verknüpft werden.
:::

- **Weg A (Für kleinere Häuser & homogene Bestände – Verknüpfung am Subtyp):**
  - **Vorgehen:** Unter **Konfiguration → Subtypen** wird ein Subtyp (z. B. „Gemälde“, „Postkarte“, „Münze“) einmalig über den Normdaten-Lookup mit der entsprechenden AAT- oder GND-URI verknüpft.
  - **Export:** Im Format-Mapping mappt man die Datensatz-Eigenschaft `target_subtype` auf `lido:objectWorkType` (oder lässt die automatische Subtyp-Erkennung greifen). Katalon generiert daraus automatisch `<lido:conceptID lido:type="URI" lido:source="AAT">http://vocab.getty.edu/aat/300033618</lido:conceptID>` und `<lido:term>Gemälde</lido:term>`.
  - **Vorteil:** Erfasser müssen bei der Einzelerfassung von Objekten nicht redundant bei jedem Datensatz die Objektart manuell auswählen.

- **Weg B (Für große Häuser & feingliedrige Bestände – Dediziertes Schemafeld):**
  - **Vorgehen:** Große Museen erfassen oft unter einem allgemeinen Subtyp wie „Druckgrafik“ sehr unterschiedliche Gattungen (z. B. Kupferstich, Radierung, Lithografie, Holzschnitt, Aquatinta). Hierfür bleibt der Subtyp ohne Normdatum, und im Schema-Editor (**Konfiguration → Schemata**) wird ein eigenständiges Feld `objektart` vom Feldtyp **Normdaten (Authority)** mit Quelle `aat` (oder als kontrolliertes Hausvokabular vom Typ `vocab`) angelegt.
  - **Export:** Im Format-Mapping wird dieses Schemafeld `objektart` auf `lido:objectWorkType` gemappt.
  - **Vorteil:** Maximale fachliche Tiefe und Differenzierung direkt am Einzelobjekt. Liefert ein Objekt ein solches gemapptes Feld, hat dieses im Export Vorrang vor dem allgemeinen Subtyp-Normdatum.

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
