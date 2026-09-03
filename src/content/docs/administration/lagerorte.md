---
title: "Katalon – Lagerorte"
---

# Katalon – Lagerorte

## Übersicht

Lagerorte bilden ab, wo sich ein Objekt physisch befindet (Depot, Raum, Regal, Schublade, Vitrine …), in beliebiger Hierarchietiefe. Die Verwaltung erfolgt in der Admin-UI unter **Konfiguration → Lagerorte**.

Nur Benutzer mit der Rolle `admin` oder `superuser` sehen diesen Menüpunkt und können Lagerorte anlegen, ändern oder löschen.

Lagerorte sind reine Bestandsverwaltungsdaten. Sie erscheinen nicht im Portal, nicht in der öffentlichen Suche und nicht im Datenimport – der physische Standort eines Objekts gilt aus Diebstahlschutzgründen als intern und wird nie öffentlich angezeigt. Anders als Objekte, Entitäten, Orte, Occurrences, Vorgänge und Sammlungen haben Lagerorte deshalb kein Entwurf/Intern/Öffentlich-Statusfeld.

---

## Lagerorte anlegen und strukturieren

1. Admin-UI öffnen, im linken Menü unter **Konfiguration** den Punkt **Lagerorte** wählen.
2. Links in der Baumansicht **Neuer Lagerort** (Wurzel-Ebene) oder bei einem bestehenden Eintrag **Untereintrag** klicken.
3. Im Formular rechts die Felder ausfüllen und speichern.

Lagerorte lassen sich beliebig tief verschachteln (z. B. Depot → Raum → Regal → Fach). Ein Lagerort ohne übergeordneten Eintrag erscheint als Wurzelknoten im Baum. Beim Verschieben eines Eintrags über **Übergeordneter Lagerort** verhindert das System Zyklen – ein Eintrag darf nicht sein eigener Vorfahre werden.

---

## Felder

| Feld | Pflicht | Beschreibung |
|---|---|---|
| Inventarnummer / ID | Ja | Eindeutige Kennung des Lagerorts. Muss beim Speichern ausgefüllt sein, es sei denn, unter **Konfiguration → ID-Nummern** ist für Lagerorte ein automatisches Nummernschema hinterlegt – dann wird die ID beim Anlegen automatisch vergeben. |
| Lagerort-Typ | Nein | Klassifiziert den Lagerort nach Art (z. B. Depot, Regal, Schublade, Vitrine). Neue Typen werden unter [Subtypen verwalten](/katalon-docs/administration/subtypen) für den Bereich „Lagerorte" angelegt und ermöglichen typspezifische Zusatzfelder. |
| Übergeordneter Lagerort | Nein | Bestimmt die Position in der Hierarchie. Leer lassen für einen Wurzelknoten. |

Zusätzlich zu diesen festen Feldern erscheinen im Formular alle für den gewählten Lagerort-Typ konfigurierten Zusatzfelder, siehe [Schema-Verwaltung](/katalon-docs/administration/schema) – z. B. Kapazität, Klimabedingungen oder eine Fotodokumentation des Regals.

---

## Objekte einem Lagerort zuordnen

Die Zuordnung erfolgt nicht im Lagerort-Formular, sondern beim Objekt selbst:

1. Objekt-Datensatz öffnen.
2. In der Seitenleiste die Karte **Zugeordnete Lagerorte** öffnen.
3. **Hinzufügen** klicken, im Suchfeld den gewünschten Lagerort auswählen (die Liste zeigt beim Klick ins Feld sofort die vorhandenen Lagerorte, weitere Eingabe filtert die Liste) und einen Beziehungstyp wählen.

Zwei Beziehungstypen sind vorgesehen:

- **Normaler Standort** (`normal_location`) – der reguläre Aufbewahrungsort des Objekts.
- **Aktueller Standort** (`current_location`) – der Ort, an dem sich das Objekt gerade befindet, falls er vom normalen Standort abweicht (z. B. während einer Ausleihe, Ausstellung oder Restaurierung).

Ein Objekt kann mehrere Lagerort-Zuordnungen gleichzeitig haben. Die Standortgeschichte eines Objekts lässt sich über das Audit-Log der Beziehung nachvollziehen – jede Änderung, jedes Hinzufügen und Entfernen einer Zuordnung wird protokolliert.

Die Karte „Zugeordnete Lagerorte" erscheint nur, wenn im System mindestens ein Lagerort angelegt ist. Institutionen, die keine Lagerortverwaltung nutzen, sehen keine Spur der Funktion im Objektformular.

---

## Lagerorte löschen

Das Löschen eines Lagerorts, der noch mit Objekten verknüpft ist, fragt zur Bestätigung nach, da bestehende Zuordnungen mitgelöscht werden.
