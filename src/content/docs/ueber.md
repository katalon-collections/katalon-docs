---
title: Über Katalon Collections
description: Was Katalon Collections ist, warum es entstanden ist und wer dahintersteht.
---

## Was ist Katalon Collections?

Katalon Collections ist ein Open-Source **Metadata Management System (MMS)** für den GLAM-Sektor — Galerien, Bibliotheken, Archive und Museen. Es verbindet flexible, dynamische Metadatenschemata mit einer sauberen REST-API, zwei spezialisierten Frontends (Admin-Oberfläche und öffentliches Portal) und einer containerisierten Deployment-Infrastruktur.

Die fachlichen Daten liegen in sieben Kerntypen: **Objekte**, **Entitäten** (Personen/Organisationen), **Orte**, **Occurrences** (Werke, Ereignisse, Konzepte), **Sammlungen**, **Lagerorte** und **Vorgänge** (Leihverkehr, Erwerbung, Restaurierung). Felder, Formulare und kontrollierte Vokabulare mit Normdatenanbindung (GND, GeoNames, VIAF, Wikidata, Getty TGN, ICONCLASS) lassen sich vollständig über die Oberfläche konfigurieren, ohne Code oder Konfigurationsdateien anzufassen.

Katalon ist eigenständig und nicht mit [katalon.com](https://katalon.com/) (Test-Automatisierung) verbunden — daher der ausgeschriebene externe Name „Katalon Collections".

## Warum Katalon Collections?

Sammlungsverantwortliche stehen vor der Herausforderung, heterogene Bestände mit individuellen Metadatenfeldern zu erfassen, zu verknüpfen und der Öffentlichkeit zugänglich zu machen. Katalon setzt dabei konsequent auf **Configuration over Coding**: Schemata werden über die Oberfläche konfiguriert statt programmiert. Dahinter stehen ein paar feste Prinzipien:

- **Datenintegrität und Sicherheit** von Metadaten und Medien haben Vorrang vor Feature-Tempo.
- **Simplizität und Flexibilität für Kurator:innen.** Schemata werden über die Oberfläche angepasst, nicht über Config-Dateien oder Code — die Software passt sich an die Sammlung an, nicht umgekehrt.
- **Moderner, etablierter Techstack**, überschaubar zu installieren und zu betreiben; eine Portalansicht ist von Anfang an dabei.
- **Kostenlos und selbst betreibbar.** Katalon ist Open Source, ohne Lizenzkosten. Institutionen mit kleinem Budget importieren ihre Bestände selbst (Smart Importer mit Dry-Run-Vorschau), statt zwingend einen Dienstleister zu beauftragen.
- **Kein Lock-in.** Dokumentierte REST-API mit OpenAPI-Spec, OAI-PMH und ein einfaches, offengelegtes Datenmodell — Institutionen nehmen ihre Daten jederzeit mit.
- **Standardkonformität.** Anschluss an GLAM-Standards (IIIF, Dublin Core, perspektivisch LIDO/EAD) statt proprietärer Formate, mit Normdaten-Anbindung.
- **Barrierefreiheit** des öffentlichen Portals für alle Nutzer:innen.
- **Anpassbarkeit**, falls doch eine Speziallösung oder ein eigenes Portal benötigt wird.

Lizenzrechtlich ist Katalon unter der **AGPL-3.0-or-later** freigegeben — derselben Copyleft-Familie wie CollectiveAccess, das vergleichbarste etablierte Open-Source-System für Sammlungsverwaltung. Die Netzwerk-Klausel der AGPL verhindert, dass ein modifiziertes Katalon als geschlossener, gehosteter Dienst angeboten wird, ohne die Änderungen zurückzugeben — unmodifizierter kommerzieller Weiterbetrieb bleibt davon unberührt.

## Wer steht dahinter?

Katalon Collections wird von **Karl Krägelin** entwickelt und gepflegt.

- **Lizenz:** [AGPL-3.0-or-later](https://github.com/katalon-collections/katalon/blob/main/LICENSE)
- **Quellcode:** [github.com/katalon-collections/katalon](https://github.com/katalon-collections/katalon)
- **Diese Dokumentation:** [github.com/katalon-collections/katalon-docs](https://github.com/katalon-collections/katalon-docs)

:::note
Dieser Abschnitt wird noch um Hintergrund zu Person und Entstehungsgeschichte ergänzt.
:::
