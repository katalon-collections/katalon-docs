---
title: Normdaten & Linked Data
description: Externe Normdaten (GND, Wikidata, GeoNames etc.) anbinden, im Schema konfigurieren und SKOS-Thesauri importieren.
---

Katalon verbindet museale Erfassung mit Linked Open Data (LOD). Über das Authority-System können Datensätze direkt beim Erfassen mit normierten Identifikatoren und externen Thesauri verknüpft werden. Vokabulare unterstützen kanonische URIs und SKOS-Konkordanzen.

---

## Integrierte Normdatenquellen (Authority Sources)

Katalon bringt vorbereitete Adapter für die wichtigsten internationalen Normdateien und Fachvokabulare mit:

| Quelle | ID | Beschreibung & API |
|---|---|---|
| **GND** | `gnd` | Gemeinsame Normdatei der Deutschen Nationalbibliothek via lobid.org (Personen, Körperschaften, Sachbegriffe, Geografika). Standardmäßig aktiv. |
| **Wikidata** | `wikidata` | Strukturierte Wissensdatenbank von Wikimedia. Weltweite Entitäten aller Art mit direkten Cross-Links. |
| **GeoNames** | `geonames` | Geografische Datenbank mit weltweiten Ortsnamen und Koordinaten. |
| **VIAF** | `viaf` | Virtual International Authority File (Zusammenführung nationaler Normdateien). |
| **Getty AAT** | `aat` | Art & Architecture Thesaurus des Getty Research Institute via SPARQL. |
| **Getty TGN** | `tgn` | Thesaurus of Geographic Names des Getty Research Institute via SPARQL. |
| **ICONCLASS** | `iconclass` | Ikonografisches Klassifikationssystem für Kunst und Kulturgeschichte. |

---

## Normdatenquellen verwalten

Die Verwaltung der Quellen erfolgt in der Admin-UI unter **Einstellungen → Normdatenquellen**:

1. Jede Quelle besitzt einen Schalter zum **Aktivieren / Deaktivieren**.
2. Über **Verbindung testen** führt Katalon eine Live-Abfrage an die externe API aus und zeigt das Ergebnis oder Fehlermeldungen direkt an.
3. **Besonderheiten bei APIs:**
   - **GeoNames:** Erfordert in der Konfiguration einen gültigen GeoNames-Benutzernamen mit aktivierten Webservices.
   - **Wikidata:** Wikidata verlangt gemäß API-Policy einen identifizierbaren User-Agent. Katalon setzt diesen automatisch aus `KATALON_BASE_URL` und `OAI_ADMIN_EMAIL` zusammen oder liest die Umgebungsvariable `WIKIDATA_USER_AGENT`.

Nur aktivierte Quellen stehen bei der Feldkonfiguration und in Erfassungsformularen zur Auswahl.

---

## Der Feldtyp `authority` im Schema

Um Normdaten in Datensätzen zu erfassen, wird im Schema ein Feld vom Typ `authority` angelegt:

1. **Konfiguration → Schemata** öffnen und den gewünschten Primärtyp wählen (Objekt, Entität, Ort, Occurrence, Vorgang, Sammlung oder Lagerort).
2. Auf **Neues Feld** klicken.
3. Feldtyp `authority` auswählen.
4. Unter **Normdaten-Quelle** die gewünschte aktive Quelle festlegen (z. B. `gnd`, `wikidata` oder `geonames`).
5. Das Feld kann als **wiederholbar** markiert werden, falls mehrere Normdatenverweise erlaubt sein sollen.
6. Das Feld kann auch als **Unterfeld innerhalb einer Feldgruppe (`group`)** verwendet werden.

### Erfassung im Formular

Im Bearbeitungsformular rendert Katalon für `authority`-Felder eine interaktive Suchmaske mit Autocomplete:

- Die Eingabe von Suchbegriffen fragt die externe API in Echtzeit ab.
- Vorschläge werden mit Label, Kurzbeschreibung und externer Kennung dargestellt.
- Die Auswahl kann bequem per Tastatur (Pfeiltasten + Enter) bestätigt werden.
- Bei **GeoNames** werden neben Name und ID auch die exakten Breiten- und Längengrade mitgespeichert. Katalon kann dadurch im Admin-Formular und im Portal ohne weitere externe API-Abfrage eine OpenStreetMap-Kartenvorschau anzeigen.
- Ausgewählte Normdateneinträge werden im Formular als direkte Links zur Originalquelle gerendert (z. B. Link zum lobid.org- oder Wikidata-Eintrag).

### Gespeicherte Datenstruktur

Ein Normdatenwert wird strukturiert im JSONB-Metadatenfeld abgelegt:

```json
{
  "source": "gnd",
  "external_id": "118540238",
  "label": "Goethe, Johann Wolfgang von",
  "description": "deutscher Dichter, Naturforscher und Staatsmann (1749-1832)",
  "uri": "https://d-nb.info/gnd/118540238"
}
```

---

## Vokabulare & SKOS-Linked-Data

Auch kontrollierte Vokabulare in Katalon sind vollständig in das Linked-Data-Ökosystem eingebunden:

### Kanonische URIs und Alignments an Termen

Unter **Konfiguration → Vokabulare** können Begriffen dauerhafte Identifikatoren zugewiesen werden:

- **Kanonische Vokabular-URI:** Jedes Vokabular kann eine Basis-URI oder ConceptScheme-URI tragen (z. B. `http://vocab.getty.edu/aat/`).
- **Term-URI:** Jeder Begriff kann eine eigene kanonische URI besitzen (z. B. `http://vocab.getty.edu/aat/300026816`).
- **Cross-Konkordanzen (`skos:exactMatch`):** Ein Begriff kann eine Liste externer Match-URIs halten (z. B. Wikidata- und GND-URIs für denselben Begriff).
- In der Termtabelle werden gesetzte URIs direkt verlinkt und mit Info-Popovern visualisiert.

### SKOS-Thesaurus-Import

Katalon unterstützt den direkten, selektiven Import von SKOS-Hierarchien und Thesauri:

1. Unterstützte Formate: **Turtle (`.ttl`)**, **RDF/XML (`.rdf`, `.xml`)**, **JSON-LD (`.jsonld`)** und **N-Triples (`.nt`)**.
2. Der Import kann direkt im Vokabular-Editor über den Button **SKOS importieren** oder im Bereich **Import → Vokabulare** gestartet werden.
3. **Selektiver Import für Großthesauri:**
   - Große Vokabulare wie der Getty AAT umfassen zehntausende Begriffe. Um nur relevante Teilbereiche zu übernehmen, kann eine **Top-Konzept-URI** (z. B. der Knoten für *Ölfarben*) angegeben werden. Katalon traversiert rekursiv den Graphen und importiert nur diesen Ast.
   - Alternativ kann nach einer **ConceptScheme-URI** gefiltert werden.
   - Begrenzungen für maximale Hierarchietiefe (`max_depth`) und maximale Begriffszahl (`max_terms`) schützen vor Speicherüberlauf.
4. **Was übernommen wird:**
   - Bevorzugte Bezeichnungen (`skos:prefLabel`) mehrsprachig (Deutsch, Englisch etc.).
   - Alternative Bezeichnungen (`skos:altLabel`) in den Term-Metadaten.
   - Exakte Übereinstimmungen (`skos:exactMatch`) als Konkordanzen.
   - Hierarchische Relationen (`skos:broader` / `skos:narrower`) als Eltern-Kind-Struktur.
