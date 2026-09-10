---
title: Statische Seiten
description: Redaktionelle Seiten wie FAQ, Impressum oder Über-die-Sammlung im Portal verwalten.
---

Statische Seiten sind frei redigierbare Textseiten im Public-Portal — etwa FAQ, Impressum, Datenschutz oder „Über die Sammlung". Sie sind unabhängig von den sieben Kerntypen und werden separat verwaltet.

Die Verwaltung erfolgt in der Admin-UI unter **Konfiguration → Statische Seiten**.

---

## Seite anlegen

1. Auf **Neue Seite** klicken.
2. **Slug** vergeben — der URL-Pfad im Portal, z. B. `impressum`. Der Slug lässt sich nach dem Anlegen nicht mehr ändern.
3. Titel und Inhalt für die konfigurierten Sprachen eintragen. Deutsch ist Pflicht, weitere Sprachen sind optional.
4. **Inhalt** wird als **Markdown** erfasst (Überschriften, Listen, Links, Fettung etc.) und im Portal als formatierter Text gerendert.
5. **Speichern**.

Eine neu angelegte Seite ist standardmäßig **nicht veröffentlicht** (Entwurf) und im Portal noch nicht sichtbar.

---

## Veröffentlichen und verlinken

| Feld | Bedeutung |
|---|---|
| **Veröffentlicht** | Schaltet die Seite im Portal frei. Unveröffentlichte Seiten sind nur in der Admin-UI sichtbar (Kennzeichnung „Entwurf" in der Liste). |
| **Link im Portal** | Bestimmt, ob und wo automatisch ein Link zur Seite erscheint: **Header** (Hauptnavigation), **Footer** oder **Kein Link** (Seite ist nur über die direkte URL erreichbar, z. B. für verlinkte Landingpages). |
| **Reihenfolge** | Sortierposition unter mehreren Seiten am selben Linkplatz (Header oder Footer). |

Eine veröffentlichte Seite ist im Portal unter `/page/<slug>` erreichbar, unabhängig davon, ob ein Navigationslink gesetzt ist.

---

## Löschen

Der Papierkorb-Button in der Seitenliste löscht eine Seite unwiderruflich, inklusive aller Sprachversionen. Es gibt keine Snapshot- oder Wiederherstellungsfunktion für statische Seiten.
