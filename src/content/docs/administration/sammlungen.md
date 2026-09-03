---
title: Sammlungen
description: Kuratorische Bestände und Sammlungen hierarchisch strukturieren und Objekten zuordnen.
---

Sammlungen bilden die kuratorische und bestandshistorische Gliederung eines Hauses ab (z. B. Vorlass, Sammlung Moderne, Teilbestand Grafiken). Sie sind in Katalon ein eigenständiger Primärtyp mit voller Schema-, Hierarchie- und Subtyp-Unterstützung.

Die Verwaltung erfolgt in der Admin-UI unter **Sammlungen**.

---

## Sammlungen und Bestände strukturieren

1. Admin-UI öffnen und im Hauptmenü **Sammlungen** wählen.
2. In der Sammlungsliste auf **Neue Sammlung** klicken.
3. Titel, eindeutige ID-Nummer und gewünschte Metadaten eingeben.
4. Bei hierarchischen Beständen über das Feld **Übergeordnete Sammlung** den Elternknoten auswählen (z. B. *Bestand Müller* → *Teilbestand Fotografien* → *Serie Porträts*).

Die Sammlungsliste (`#collections-list`) zeigt hierarchische Sammlungen automatisch eingerückt als Baumdarstellung an, solange keine Filter, Suche oder manuelle Sortierung aktiv sind.

Beim Verschieben oder Umhängen einer Sammlung über das Feld **Übergeordnete Sammlung** verhindert Katalon zyklische Abhängigkeiten (eine Sammlung kann nicht ihr eigenes Kind werden).

---

## Schemata und Subtypen für Sammlungen

Wie alle Primärtypen nutzen Sammlungen die Katalon-Schema-Engine:

- **Eigene Schemafelder:** Unter **Konfiguration → Schemata** beim Typ **Sammlungen** können beliebige Zusatzfelder definiert werden (z. B. Zugangsdatum, Provenienznotiz, rechtliche Einschränkungen).
- **Subtypen:** Unter **Konfiguration → Subtypen** können Sammlungs-Subtypen angelegt werden (z. B. *Teilbestand*, *Konvolut*, *Vorlass*), um feldspezifische Schemata oder Formularvarianten zu nutzen.

---

## Objekte einer Sammlung zuordnen

Die Verknüpfung zwischen Objekten und Sammlungen erfolgt direkt bei der Objekterfassung:

1. Objekt-Datensatz im Editor öffnen.
2. Im Objektformular erscheint das Feld **Sammlung**, sobald mindestens eine Sammlung im System angelegt ist.
3. Die gewünschte Sammlung auswählen und speichern.

Technisch wird die Verknüpfung als `member_of`-Beziehung in der Relationentabelle gespeichert. Ein Objekt kann so auch mehreren Sammlungen angehören.

> **Hinweis zur Begriffstrennung:** Das Feld `collection_status` an Objekten heißt in Katalon **Bestandsstatus** (Holding status), um es eindeutig von den kuratorischen **Sammlungen** (Collections) abzugrenzen.

---

## Suche und Portal

Sammlungen werden wie Objekte, Entitäten, Orte und Occurrences volltextindiziert und können über die Suche schnell aufgefunden werden. Veröffentlichte Sammlungen stehen auch im Portal zur Verfügung.
