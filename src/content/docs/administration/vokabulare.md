---
title: Vokabulare verwalten
description: Kontrollierte Vokabulare, hierarchische Begriffslisten und Relationstyp-Vokabulare anlegen und pflegen.
---

Kontrollierte Vokabulare sind wiederverwendbare Begriffslisten, die an Schemafeldern vom Typ `vocab`/`vocab_free` referenziert werden (siehe [Schema verwalten](schema#vocab--vokabularfeld)) oder — als Sonderfall — die zulässigen Relationstypen zwischen Datensätzen definieren.

Die Verwaltung erfolgt in der Admin-UI unter **Konfiguration → Vokabulare**.

---

## Vokabular anlegen

1. Auf **Neues Vokabular** klicken.
2. **Name** (technischer Bezeichner, z. B. `materialien`) vergeben.
3. **Art** wählen:
   - **Begriffsvokabular** (`term`) — gewöhnliche Begriffsliste, z. B. Materialien, Genres, Techniken.
   - **Relationstyp-Vokabular** (`relation`) — definiert die benannten Beziehungstypen zwischen Datensätzen (z. B. „Autor:in von", „Abgebildet in"). Siehe unten.
4. **Hierarchisch** aktivieren, wenn Begriffe Eltern-/Kind-Beziehungen haben sollen (Broader/Narrower, z. B. eine Materialtaxonomie). Bei Relationstyp-Vokabularen nicht verfügbar.
5. Optional eine **kanonische URI** (Basis- oder ConceptScheme-URI, z. B. `http://vocab.getty.edu/aat/`) für die Linked-Data-Anbindung hinterlegen.

Das System legt bei der Erstinstallation zwei feste Systemvokabulare an: `relation_types` (Relationstypen) und `media_types` (Medientypen). Sie lassen sich nicht löschen, ihre Begriffe aber wie gewohnt bearbeiten.

---

## Begriffe pflegen

Pro Begriff (Term) lassen sich erfassen:

| Feld | Bedeutung |
|---|---|
| **Term** | Technischer Wert, wird in Datensätzen gespeichert. |
| **Label** | Sprachspezifische Anzeigebezeichnung (eine pro konfigurierter Sprache). |
| **Übergeordneter Begriff** | Nur bei hierarchischen Vokabularen — ordnet den Begriff in die Baumstruktur ein. |
| **URI** | Kanonische Identifikator-URI des Begriffs (z. B. `http://vocab.getty.edu/aat/300026816`), wird bei URIs direkt verlinkt. |
| **Cross-Konkordanzen (exactMatch)** | Liste externer Match-URIs (z. B. Wikidata- und GND-URIs für denselben Begriff), kommagetrennt oder je Zeile. |
| **Eigene Felder** | Falls unter **Konfiguration → Schemata** Felder für den Zieltyp `vocabulary_term` dieses Vokabulars definiert wurden, erscheinen sie zusätzlich im Termformular. |

Begriffe lassen sich einzeln über **Neuer Begriff** anlegen sowie per CSV/TSV/JSON oder SKOS (Turtle, RDF/XML, JSON-LD, N-Triples) im Reiter **Import** in Serie einspielen — siehe [Normdaten & Linked Data](normdaten#vokabulare--skos-linked-data) für den SKOS-Import und Details zu URIs und Cross-Konkordanzen.

---

## Relationstyp-Vokabulare

Beim Relationstyp-Vokabular (`relation_types`) bekommt jeder Begriff zusätzlich:

- **Gegenrichtung (Inverse Label)** — die Bezeichnung aus der umgekehrten Blickrichtung (z. B. „Autor:in von" ↔ „verfasst von").
- **Zieltypen (applies_from / applies_to)** — welche Primärtypen als Quelle bzw. Ziel der Beziehung erlaubt sind (z. B. nur Entität → Objekt).

Diese Begriffe stehen anschließend an Relationsfeldern (Feldtyp `relation`) im Schema-Editor zur Auswahl — siehe [Beziehungen → verknüpfung-zu-einem-anderen-datensatz](schema).

---

## Löschen

Ein Vokabular lässt sich nur löschen, wenn kein Schemafeld mehr darauf verweist. Einzelne Begriffe können jederzeit gelöscht werden; bereits gespeicherte Datensätze behalten den früher gewählten Wert als reinen Text, verlieren aber die Verknüpfung zum Begriff.
