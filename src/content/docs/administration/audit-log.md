---
title: Audit-Log
description: Alle Änderungen an Datensätzen nachvollziehen, filtern und einem Datensatz zuordnen.
---

Das Audit-Log protokolliert jede Änderung an Bestandsdaten lückenlos: wer, wann, was geändert hat — inklusive Alt- und Neuwert je Feld. Es ist nicht abschaltbar und kann von Redakteur:innen nicht manipuliert werden.

Die typübergreifende Übersicht ist in der Admin-UI unter **Audit-Log** erreichbar; jeder einzelne Datensatz zeigt zusätzlich seine eigene Historie im Bearbeitungsformular.

---

## Protokollierte Aktionen

| Aktion | Beschreibung |
|---|---|
| **Erstellt** | Neuer Datensatz angelegt. |
| **Geändert** | Metadatenfeld(er) geändert — mit Alt-/Neuwert pro Feld. |
| **Gelöscht** | Datensatz gelöscht. |
| **Veröffentlicht** | Statuswechsel (z. B. Entwurf → Veröffentlicht). |
| **Medien hinzugefügt / geändert / gelöscht** | Änderungen an angehängten Mediendateien. |
| **Beziehung hinzugefügt / geändert / gelöscht** | Relationen zu anderen Datensätzen. |
| **KI-Schema-Assistenz** | Von der KI vorgeschlagene und übernommene Schemaänderungen, inkl. verwendetem Modell und Token-Verbrauch. |

Massenbearbeitungen erscheinen als einzelne Einträge pro betroffenem Datensatz, aber mit gemeinsamer Batch-Kennung — siehe [Massenbearbeitung](batch-bearbeitung).

---

## Filtern und suchen

- **Volltextsuche** über Datensatzlabel und geänderte Werte.
- **Zeitraum** über Von-/Bis-Datum.
- **Aktionstyp**-Filterleiste (Alle, Erstellt, Geändert, Gelöscht, Veröffentlicht, Medien, Beziehung).
- Ergebnisse sind paginiert (50 Einträge pro Seite).

Ein Klick auf den Datensatznamen in einem Eintrag öffnet den betroffenen Datensatz direkt im Editor — auch über Datensatztypen hinweg (z. B. von einer Entität zu einem über Beziehung verlinkten Objekt).

---

## Aufbewahrung

Audit-Log-Einträge werden nicht automatisch gelöscht oder rotiert. Sie bleiben auch nach dem Löschen des zugehörigen Datensatzes erhalten und dokumentieren damit auch dessen Löschzeitpunkt und die löschende Person.
