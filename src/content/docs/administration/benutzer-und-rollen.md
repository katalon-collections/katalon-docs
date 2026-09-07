---
title: "Katalon – Benutzer & Rollen"
---

## Übersicht

:::note[Verfügbar ab Version 1.19.2]
:::

Katalon verfügt über ein rollenbasiertes Berechtigungssystem (RBAC). Benutzerkonten werden für Mitarbeiter in der Admin-UI eingerichtet. Die Verwaltung erfolgt unter **Verwaltung → Benutzer** sowie **Verwaltung → Benutzer → Rollenrechte**.

Nur Benutzer mit der Rolle `admin` oder `superuser` können Benutzerkonten anlegen, Rollen zuweisen oder Berechtigungen anpassen.

---

## Die Rollen im Überblick

Katalon unterscheidet fünf feste Rollen:

| Rolle | Technischer Bezeichner | Beschreibung & typische Zielgruppe |
|---|---|---|
| **Superuser** | `superuser` | Vollzugriff auf alle Funktionen und Datensätze, Umgehung aller Berechtigungsprüfungen. Wird bei der Erstinstallation automatisch angelegt. |
| **Administrator** | `admin` | Vollzugriff auf Bestandsdaten, Systemkonfiguration, Schemata, Formularvarianten, Vokabulare, Import, API-Keys und Benutzerverwaltung. |
| **Redakteur** | `editor` | Erfassen, Bearbeiten und Löschen von Bestandsdaten (Objekte, Entitäten, Orte, Occurrences, Vorgänge, Sammlungen). Kein Zugriff auf System- oder Schema-Konfiguration. |
| **Katalogisierer** | `cataloger` | Laufende Erfassung und Pflege von Bestandsdaten. Berechtigungen pro Datensatztyp über die Rechteverwaltung konfigurierbar. |
| **Betrachter** | `viewer` | **Reiner Lesezugriff** auf das Backend. Kann Bestandsdaten einsehen und durchsuchen, aber keine Datensätze erstellen, bearbeiten oder löschen (`manage_content` entfällt). |

---

## Funktionsumfang der Rolle „Betrachter“ (Viewer)

Die Rolle `viewer` eignet sich für:
- Externe oder interne Forschende, die Zugriff auf den kuratorischen Datenbestand im Backend benötigen.
- Mitarbeiter im Lesemodus (z. B. Ausleihe, Direktion, Aufsicht), die Datensätze recherchieren, aber nicht versehentlich verändern dürfen.

**Rechte & Einschränkungen:**
- **Bestandsdaten:** Kann Bestandsdaten (Objekte, Entitäten, Orte, Occurrences, Vorgänge, Sammlungen) und verknüpfte Medien einsehen.
- **Keine Schreibrechte:** Schaltflächen zum Anlegen neuer Datensätze, Speichern von Änderungen, Löschen von Datensätzen oder Hinzufügen/Entfernen von Verknüpfungen sind inaktiv bzw. ausgeblendet.
- **Kein Konfigurationszugriff:** Menüpunkte unter *Konfiguration* (Schemata, Subtypen, Lagerorte, Formularvarianten, Vokabulare, Export etc.) und *Verwaltung* (Benutzer, Einstellungen) sind für Betrachter nicht sichtbar.
- **Import / KI-Assistenz:** Keine Berechtigung zum Starten von Daten- oder Medienimporten sowie zur Nutzung schreibender KI-Vervollständigungen.

---

## Feingranulare Berechtigungen (Rollenrechte)

Unter **Verwaltung → Benutzer** führt die Schaltfläche **Rollenrechte** zur Konfigurationsmatrix (`/admin/user-roles`).

Hier können Administratoren für die Rollen `editor`, `cataloger` und `viewer` pro Datensatztyp (**Objekt**, **Entität**, **Ort**, **Occurrence**, **Vorgang**) festlegen, welche Aktionen gestattet sind:

- **Lesen (`read`):** Datensätze dieses Typs abfragen und Detailseiten aufrufen.
- **Erstellen (`create`):** Neue Datensätze dieses Typs anlegen.
- **Bearbeiten (`update`):** Bestehende Datensätze dieses Typs ändern oder Snapshots erstellen.
- **Löschen (`delete`):** Datensätze dieses Typs in den Papierkorb verschieben oder löschen.

> **Hinweis:** Administratoren (`admin`) und `superuser` besitzen für alle Datensatztypen stets Vollzugriff; ihre Berechtigungen werden nicht durch die Matrix eingeschränkt.

---

## Benutzer verwalten

### Neuen Benutzer anlegen
1. In der Admin-UI im linken Menü **Verwaltung → Benutzer** wählen.
2. Auf **Neuer Benutzer** klicken.
3. E-Mail-Adresse, ein sicheres Passwort (mindestens 8 Zeichen) und die gewünschte Rolle wählen.
4. **Anlegen** klicken.

### Rolle ändern oder Konto deaktivieren
In der Benutzerliste kann die Rolle bestehender Benutzer direkt angepasst werden. Benutzer können zudem deaktiviert werden (Login wird gesperrt, ohne den Account zu löschen). Das eigene Konto kann aus Sicherheitsgründen nicht selbst herabgestuft werden.
