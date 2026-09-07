---
title: "Cookbook: erweiterte Anwendungsfälle"
---

Die Beispiele bauen auf dem [Walkthrough zur eigenen Sammlung](/katalon-docs/getting-started/eigene-sammlung) auf. Jedes Rezept beschreibt eine kleine, wiederverwendbare Konfiguration.

## Mehrere Personen an einer Fotografie

Eine Fotografie kann eine Fotografin, einen Auftraggeber und eine abgebildete Person haben. Lege im Relationsvokabular dafür getrennte Typen an, etwa „fotografiert von“, „beauftragt von“ und „zeigt“. Lege dann entweder je ein Relationsfeld an, wenn die Rollen dauerhaft zum Formular gehören, oder nutze für seltene Einzelfälle die Beziehungen-Karte.

Das Feld „Fotograf:in“ darf wiederholbar sein. Jede ausgewählte Entität wird mit demselben Relationstyp verknüpft. Für verschiedene Rollen braucht es verschiedene Relationstypen, keine Notiz im Personennamen.

> **Bild vorgesehen: Relationsvokabular mit drei Rollen.**
> Zeigen: unterschiedliche Relationstypen mit Hin- und Gegenrichtungen. Alt-Text: „Relationsvokabular für Fotografin, Auftraggeber und abgebildete Person.“

## Interne Angaben getrennt von öffentlichen Metadaten halten

Für Restaurierungsnotizen, interne Kontaktangaben oder noch ungeprüfte Provenienz ein eigenes Schemafeld anlegen und **Öffentlich über APIs ausgeben** deaktivieren. Der Wert bleibt in der Admin-UI sichtbar, wird aber nicht an das Portal, anonyme API-Antworten, OAI-PMH oder IIIF ausgegeben.

Die Darstellung auf einer Portal-Detailseite ist keine Zugriffskontrolle. Die Option zur öffentlichen Ausgabe entscheidet darüber, ob ein Wert den geschützten Bereich überhaupt verlässt.

> **Bild vorgesehen: Erweiterte Optionen eines Schemafelds.**
> Zeigen: deaktivierte öffentliche API-Ausgabe und den erklärenden Hinweis. Alt-Text: „Internes Schemafeld, das nicht über öffentliche APIs ausgegeben wird.“

## Unscharfe Datierung erfassen

Das Datumsfeld speichert konkrete ISO-Angaben wie `1923`, `1923-05` oder `1923-05-14`. Für „um 1920“ oder einen Zeitraum kein Freitextdatum erfinden. Lege eine Feldgruppe `datierung` an, darin ein Datumsfeld und ein Vokabularfeld `typ` mit Werten wie `exakt`, `circa`, `vor`, `nach` und `undatiert`. Für einen Zeitraum sind zwei Datumsfelder `von` und `bis` klarer.

Die komplette Konfiguration, auch für BCE-Daten, steht in der [Schema-Verwaltung](/katalon-docs/administration/schema#cookbook-datierungstyp-unscharfequalifizierte-datierung).

## Erwerbung und Restaurierung als Vorgänge

Für einen Erwerbungsvorgang ein Objekt zunächst mit Sammlungsstatus **In Bearbeitung** anlegen. Im Vorgangstyp `acquisition` können Felder wie Erwerbungsart, Kaufpreis oder Beschlussnummer angelegt werden. Beim Abschluss schlägt Katalon den Objektstatus **Aktiv** vor.

Bei einer Restaurierung (`conservation`) werden Befund, Maßnahmen und Werkstatt als Felder und Beziehungen erfasst. Mehrere Restaurierungen am selben Objekt sind möglich. Beim Abschluss schlägt Katalon für diesen Typ keinen Sammlungsstatus vor, weil eine Restaurierung nicht automatisch über die Verfügbarkeit entscheidet.

> **Bild vorgesehen: Schema für den Vorgangstyp Restaurierung.**
> Zeigen: subtypspezifische Felder Befund und Maßnahme sowie Relation zur Werkstatt. Alt-Text: „Vorgangsschema für eine Restaurierung mit eigenen Metadatenfeldern.“

## Eigene Vorgangstypen für lokale Abläufe

Ein Haus kann etwa `condition_check` für eine Zustandsprüfung anlegen. Unter **Konfiguration → Subtypen** einen Vorgangstyp mit deutschem und englischem Label erstellen; danach im Schema nur für diesen Typ Felder wie Prüfdatum, Ergebnis und nächste Prüfung anlegen.

Eigene Vorgangstypen haben keinen automatischen Sammlungsstatus und keine Sperre gegen parallele Vorgänge. Falls der Ablauf eine Regel braucht, muss sie fachlich durch das Team organisiert oder später gezielt als Produktfunktion ergänzt werden.

## Tabellenimport ohne Datenverlust vorbereiten

Vor einem Import die Ziel-Felder und Vokabulare anlegen. Im Importer Spalten zuordnen, die Vorschau lesen und immer einen **Probelauf** ausführen. Erst wenn Pflichtfelder, Trennzeichen und Transformationen stimmen, wird importiert.

Für ein Feld mit mehreren Farbwerten in einer Zelle ist die Transformation `split` mit `;` passend. Für ein kontrolliertes Vokabular zuerst die Terme importieren und anschließend `vocab_map` verwenden. Beziehungen entstehen nicht durch einen Namen in einer CSV-Spalte; dafür braucht es eine passende Auflösungs- oder Anlege-Regel im Importablauf.

> **Bild vorgesehen: Importer im Probelauf mit Mapping-Tabelle.**
> Zeigen: Quellspalte, Zielfeld, Transformation und Fehler- oder Vorschau-Bereich. Alt-Text: „CSV-Import im Probelauf mit Feldzuordnung und Transformationen.“

Die einzelnen Import-Schritte stehen unter [Metadaten- und Medienimport](/katalon-docs/administration/import).

## Maschinenlesbare Lizenzen und Rechteangaben (ECHOES / FAIR)

Internationale Metadaten- und Interoperabilitätsstandards (wie **ECHOES D6.2** REQ-META-002, Europeana, Deutsche Digitale Bibliothek oder Open-Access-Leitlinien) verlangen für jeden publizierten Datensatz ein **maschinenlesbares Lizenz- oder Rechte-Statement**.

### Warum kein Freitextfeld (`text`)?

Ein reines Textfeld (z. B. `text` mit Werten wie „CC-BY 4.0“, „Creative Commons“, „Public Domain“ oder „Frei für wissenschaftliche Nutzung“) ist **nicht maschinenlesbar**:
- Externe Harvester, OAI-PMH-Aggregatoren und Repositorien können Schreibweisen, Tippfehler oder unterschiedliche Sprachvarianten nicht zuverlässig auswerten.
- Semantische Export-Schnittstellen (JSON-LD, RDF/Turtle, SPARQL) können kein standardisiertes Lizenz-Prädikat mit dereferenzierbarer URI erzeugen.

### Empfohlene Modellierung: Kontrolliertes Vokabular (`vocab`)

Für Lizenzangaben wird der Feldtyp **`vocab`** verwendet. Dadurch ist die Erfassung strikt an qualitätsgesicherte Begriffe mit kanonischen URIs gebunden.

#### Schritt 1: Lizenz-Vokabular anlegen

1. Öffne die Admin-UI und navigiere zu **Konfiguration → Vokabulare**.
2. Klicke auf **Neues Vokabular**:
   - **Name:** `licenses`
   - **Bezeichnung (DE):** `Lizenzen & Nutzungsrechte`
   - **Bezeichnung (EN):** `Licenses & Rights`
3. Lege die in deiner Institution zulässigen Lizenzen als Begriffe an. Trage dabei im Feld **Kanonische URI** die offizielle Lizenz-URI von Creative Commons bzw. RightsStatements.org ein:

| Begriff (Label DE) | Label EN | Kanonische URI (`canonical_uri`) | Bedeutung / Empfehlung |
|---|---|---|---|
| **Gemeinfrei (CC0 1.0)** | Public Domain Dedication (CC0 1.0) | `https://creativecommons.org/publicdomain/zero/1.0/` | Vollständig rechtefrei, Metadaten-Standard |
| **Namensnennung (CC BY 4.0)** | Attribution (CC BY 4.0) | `https://creativecommons.org/licenses/by/4.0/` | Standard Open Access |
| **Namensnennung - Weitergabe unter gleichen Bedingungen (CC BY-SA 4.0)** | Attribution-ShareAlike (CC BY-SA 4.0) | `https://creativecommons.org/licenses/by-sa/4.0/` | Abgeleitete Werke unter gleicher Lizenz |
| **Namensnennung - Nicht kommerziell (CC BY-NC 4.0)** | Attribution-NonCommercial (CC BY-NC 4.0) | `https://creativecommons.org/licenses/by-nc/4.0/` | Nur nicht-kommerzielle Nachnutzung |
| **In Copyright (InC 1.0)** | In Copyright (InC 1.0) | `http://rightsstatements.org/vocab/InC/1.0/` | Urheberrechtlich geschützt, keine Nachnutzung ohne Erlaubnis |
| **Urheberrechtsschutz erloschen (NoC-NC 1.0)** | No Copyright - Non-Commercial (NoC-NC 1.0) | `http://rightsstatements.org/vocab/NoC-NC/1.0/` | Gemeinfrei, vertraglich nur nicht-kommerziell nachnutzbar |

#### Schritt 2: Schema-Feld definieren

1. Navigiere zu **Konfiguration → Schemata** und wähle den Primärtyp (z. B. **Objekte**).
2. Klicke auf **Neues Feld**:
   - **Name:** `license`
   - **Bezeichnung (DE):** `Lizenz`
   - **Bezeichnung (EN):** `License`
   - **Feldtyp:** `vocab`
   - **Vokabular:** Wähle `Lizenzen & Nutzungsrechte` aus.
   - **Öffentlich über APIs ausgeben:** Aktiviert lassen.
3. Unter **Erweiterte Optionen → Metadaten-Export**:
   - Mappe das Feld auf das Dublin-Core-Element `dcterms:license` (oder `dc:rights`).

#### Schritt 3: Rechteangaben bei Medien (Digitalisaten)

Medien-Datensätze (Bilder, Scans, Digitalisate) verfügen in Katalon bereits über ein integriertes Feld für Lizenz und Rechteinhaber. Wenn ein analoges Objekt und dessen Digitalisat unterschiedlichen Rechten unterliegen (z. B. historisches Objekt gemeinfrei, Repro-Fotografie lizenziert nach CC BY), wird die Objektlizenz über das Schemafeld `license` und die Bildlizenz direkt am Mediendatensatz erfasst.
