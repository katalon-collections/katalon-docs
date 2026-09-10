---
title: "Datensatz sperren (Exklusive Sperre)"
---

## Übersicht

Neben der automatischen Bearbeitungsanzeige (siehe unten) gibt es eine manuelle, persistente Sperre: Wer einen Datensatz sperrt, verhindert damit aktiv, dass andere Benutzer ihn speichern — z. B. während einer längeren Recherche, einer Abstimmung mit externen Stellen oder solange ein Datensatz aus fachlichen Gründen unangetastet bleiben muss.

:::note[Verfügbar ab Version 1.26.0]
:::

## Berechtigung

Das Setzen einer Sperre ist eine eigene Berechtigung (**Manuelle Sperre setzen**) und wird pro Rolle unter **Konfiguration → Benutzer & Rollen** vergeben. Ohne diese Berechtigung erscheint der Button **Sperren** im Bearbeitungsformular nicht.

Administratoren und Superuser können jede Sperre unabhängig von dieser Berechtigung aufheben (siehe [Sperre erzwungen aufheben](#sperre-erzwungen-aufheben)).

## Sperre setzen

1. Datensatz im Bearbeitungsformular öffnen.
2. Im Kopf des Formulars auf **Sperren** klicken.
3. Optional einen Grund eintragen und/oder ein Ablaufdatum setzen.
4. Mit **Sperren** bestätigen.

Der Datensatz zeigt danach oberhalb des Formulars einen violetten Hinweisbalken mit Benutzer, Grund und — falls gesetzt — Ablaufdatum.

## Wirkung der Sperre

Solange eine Sperre aktiv ist, weist der Server jeden Speicherversuch anderer Benutzer mit einem Konfliktfehler zurück, unabhängig vom Kanal (Formular oder API). Die Sperre gilt für alle sieben Datensatztypen (Objekte, Entitäten, Orte, Occurrences, Vorgänge, Sammlungen, Lagerorte).

Die sperrende Person selbst kann den Datensatz weiterhin bearbeiten und speichern.

## Sperre aufheben

Die Person, die die Sperre gesetzt hat, hebt sie über denselben Button (jetzt **Sperre aufheben**) wieder auf. Ist ein Ablaufdatum gesetzt, entfällt die Sperre automatisch nach Ablauf, auch ohne manuelles Aufheben.

## Sperre erzwungen aufheben

Administratoren und Superuser können eine fremde Sperre jederzeit aufheben, etwa wenn die sperrende Person nicht erreichbar ist. Das erzwungene Aufheben steht unabhängig von der Berechtigung **Manuelle Sperre setzen** zur Verfügung.

## Abgrenzung zur Bearbeitungsanzeige

Die exklusive Sperre ist unabhängig von der automatischen Bearbeitungsanzeige, die anzeigt, wenn ein anderer Benutzer denselben Datensatz gerade geöffnet hat. Diese Anzeige ist rein informativ und verschwindet, sobald das Formular geschlossen wird — sie verhindert kein Speichern. Nur die manuelle Sperre in diesem Kapitel blockiert das Speichern aktiv.

## Sperren in der Listenansicht

In den Listenansichten markiert eine violette Sperr-Pille jeden gesperrten Datensatz. Ein Mauszeiger über der Pille zeigt sperrende Person und Grund.
