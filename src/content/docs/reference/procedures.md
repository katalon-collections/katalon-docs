---
title: Vorgänge
description: Konzept und Dokumentation zu Vorgängen wie Leihverkehr, Erwerbung und Restaurierung.
---

Katalon verwaltet neben den Bestandsdaten (Objekte, Entitäten, Orte, Ereignisse, Sammlungen, Lagerorte) auch **Prozesse und Transaktionen** rund um den Bestand: Leihverkehr, Erwerbung, Restaurierung oder Eingangsprüfung.

Solche Vorgänge sind in Museen, Archiven und Bibliotheken täglich relevant – für Versicherung, Standortverwaltung, Berichtspflichten und institutionelles Gedächtnis.

---

## Was ist ein Vorgang?

Ein **Vorgang** (intern: *Procedure*) beschreibt einen zeitlich begrenzten Prozess an einem oder mehreren Objekten. Er besitzt:

- einen **Vorgangstyp** (z. B. Leihgabe ausgehend, Restaurierung, Erwerbung)
- einen **Status** (`draft` → `active` → `completed` oder `cancelled`)
- ein **Start- und Enddatum** (inkl. Rückgabefrist bei Leihe)
- eine **Referenznummer** (für interne Aktenzeichen oder externe Korrespondenz)
- **freie Metadatenfelder** (über die Schema-Engine konfigurierbar)
- **Verknüpfungen** zu Objekten, Entitäten und Orten über das Relationssystem

Vorgänge sind **keine Ereignisse** (Occurrences). Eine historische Ausstellung oder Aufführung ist ein Ereignis; der Leihvertrag oder Transport für ein ausgestelltes Objekt ist ein Vorgang.

---

## Vorkonfigurierte Vorgangstypen

Katalon liefert sechs praxiserprobte Typen mit:

| Typ | Bezeichnung | Typisches Szenario |
|---|---|---|
| `loan_out` | Leihgabe ausgehend | Eigenes Objekt geht an externe Institution |
| `loan_in` | Leihgabe eingehend | Fremdes Objekt kommt zur Ausstellung ins Haus |
| `acquisition` | Erwerbung | Kauf, Schenkung, Übertragung in die Sammlung |
| `conservation` | Restaurierung / Konservierung | Konservatorische Untersuchung oder Behandlung |
| `object_entry` | Eingangsprüfung | Vorläufige Annahme zur Begutachtung oder Auswahl |
| `deaccession` | Deakzession | Abgabe, Verkauf, Rückgabe oder Aussonderung |

Zusätzlich können unter **Konfiguration → Subtypen** für den Typ *Vorgänge* beliebig viele institutionsspezifische Vorgangstypen angelegt werden.

---

## Lebenszyklus und Status

Ein Vorgang durchläuft feste Phasen:

1. **Entwurf (`draft`):** Planung des Vorgangs. Pflichtfelder können unvollständig sein.
2. **Aktiv (`active`):** Der Vorgang läuft (z. B. Leihgabe ist unterwegs, Restaurierung in Arbeit).
3. **Abgeschlossen (`completed`):** Die Maßnahme ist beendet, das Objekt zurückgekehrt oder endgültig erworben.
4. **Storniert (`cancelled`):** Der Vorgang kam nicht zustande (z. B. Leihgesuch abgelehnt).

### Statuswechsel bei Objekten

Beim Abschließen eines Vorgangs schlägt Katalon passende Statusänderungen für verknüpfte Objekte vor:
- Bei `loan_out` schlägt das System vor, den Sammlungsstatus von *Ausgeliehen* wieder auf *Aktiv* zu setzen.
- Bei `acquisition` schlägt das System vor, den Sammlungsstatus von *In Bearbeitung* auf *Aktiv* zu setzen.

Der Vorschlag kann bestätigt oder unverändert übernommen werden.

### Integritätsregel bei `loan_out`

Katalon stellt sicher, dass ein Objekt nicht gleichzeitig Teil von zwei aktiven ausgehenden Leihgaben (`loan_out`) sein kann. Ein Versuch wird mit einer klaren Hinweismeldung blockiert.

---

## Schemafelder für Vorgänge

Jeder Vorgangstyp kann über **Konfiguration → Schemata** mit eigenen Feldern ausgestattet werden:
- Für `conservation`: Befundbericht, Konservierungsziel, verwendete Materialien, Werkstattnotizen.
- Für `loan_out`: Versicherungswert, Transportbedingungen, konservatorische Auflagen, Genehmigungsvermerke.
- Für `acquisition`: Kaufpreis, Beschlussnummer, Förderer, Zugangsart.
