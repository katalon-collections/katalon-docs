---
title: Über Katalon Collections
description: Was Katalon Collections ist, warum es entstanden ist und wer dahintersteht.
---

## Was ist Katalon Collections?

Katalon Collections ist ein Open-Source-Sammlungsmanagementsystem für Galerien, Bibliotheken, Archive und Museen (GLAM). Es bietet konfigurierbare Metadatenschemata, eine REST-API, eine Admin-Oberfläche und ein öffentliches Portal. Installation und Betrieb erfolgen mit Containern.

Die fachlichen Daten liegen in sieben Kerntypen: Objekte, Entitäten (Personen/Organisationen), Orte, Occurrences (Werke, Ereignisse, Konzepte), Sammlungen, Lagerorte und Vorgänge (Leihverkehr, Erwerbung, Restaurierung). Felder, Formulare und kontrollierte Vokabulare mit Normdatenanbindung (GND, GeoNames, VIAF, Wikidata, Getty TGN, ICONCLASS) lassen sich vollständig über die Oberfläche konfigurieren, ohne Code oder Konfigurationsdateien anzufassen.

Katalon ist eigenständig und nicht mit [katalon.com](https://katalon.com/) (Test-Automatisierung) verbunden. Zur Unterscheidung heißt das Projekt nach außen „Katalon Collections“.

## Warum Katalon Collections?

Sammlungsverantwortliche müssen unterschiedliche Bestände mit jeweils passenden Metadatenfeldern erfassen, verknüpfen und veröffentlichen können. Bei Katalon werden Schemata dafür über die Oberfläche konfiguriert statt programmiert (Configuration over Coding). Für die Entwicklung gelten folgende Prinzipien:

- Datenintegrität und Sicherheit von Metadaten und Medien haben Vorrang vor Feature-Tempo.
- Kurator:innen sollen Schemata einfach an ihre Sammlung anpassen können.
- Etablierte Technologien sollen Installation und Betrieb überschaubar halten. Ein öffentliches Portal gehört zur Anwendung.
- Katalon ist Open Source, ohne Lizenzkosten und selbst betreibbar. Institutionen mit kleinem Budget können ihre Bestände selbst importieren; der Smart Importer bietet dafür eine Dry-Run-Vorschau.
- Eine dokumentierte REST-API mit OpenAPI-Spec, OAI-PMH und ein offengelegtes Datenmodell ermöglichen es Einrichtungen, ihre Daten mitzunehmen.
- Katalon nutzt GLAM-Standards wie IIIF und Dublin Core sowie Normdaten. LIDO und EAD sind perspektivisch vorgesehen.
- Das öffentliche Portal soll für alle Nutzer:innen barrierefrei zugänglich sein.
- Die Anwendung soll bei Bedarf für Speziallösungen oder ein eigenes Portal anpassbar sein.

Katalon ist unter der AGPL-3.0-or-later freigegeben. Die Netzwerk-Klausel der AGPL verhindert, dass ein modifiziertes Katalon als geschlossener, gehosteter Dienst angeboten wird, ohne die Änderungen zurückzugeben. Unmodifizierter kommerzieller Weiterbetrieb bleibt davon unberührt.

## Wer steht dahinter?

Katalon Collections wird von **Karl Krägelin** entwickelt und gepflegt. Katalon ist aus mehreren Jahren Arbeit mit digitalen Sammlungen, Bibliothekssystemen, Metadaten und Forschungsdateninfrastrukturen entstanden.

### Contributors

- **Dr. Winfried Bergmeyer:** Feedback, Testing, Ideen, Logo
- **Adienne Karsten-Welker:** Feedback, Testing, UX & UI
- **Patrick Dinger:** Feedback, Testing, Ideen und Datenimport

### Werdegang

Seit 2016 arbeite ich an Software und Dateninfrastrukturen für wissenschaftliche Sammlungen, Bibliotheken und Forschungsdaten. Meine Arbeit umfasst Datenmodellierung und Datenbereinigung, Import und Export, Metadatentransformationen, Schnittstellen und Softwareentwicklung.

Von 2016 bis 2018 habe ich für eine [wissenschaftliche Sammlung historischer Bildpostkarten](https://bildpostkarten.uni-osnabrueck.de/) eine Datenbank auf Basis von CollectiveAccess mit aufgebaut. Dazu gehörten insbesondere die Entwicklung des Datenmodells, die Aufbereitung vorhandener Daten und die Vorbereitung der Migration in das neue System.

Ab 2018 arbeitete ich an der Niedersächsischen Staats- und Universitätsbibliothek Göttingen bei der Fachstelle Bibliothek der Deutschen Digitalen Bibliothek. Ein Schwerpunkt lag dort auf Austauschformaten und Datenpipelines, insbesondere METS/MODS sowie auf Transformation, Validierung und Verarbeitung größerer Metadatenbestände. In dieser Zeit entstanden auch mehrere Softwarewerkzeuge und Dienste.

Seit 2023 arbeite ich an der Universitäts- und Landesbibliothek Münster als Softwareentwickler im Bereich Forschungsdatenmanagement. Ein Schwerpunkt liegt auf dem institutionellen Forschungsdatenrepository und dem Publikationsserver der Universität auf Basis der Software [InvenioRDM](https://inveniosoftware.org/products/rdm/). Seit 2025 umfasst meine Arbeit zunehmend auch IT-Projektmanagement.

Daneben habe ich kleinere Projekte betreut oder entwickelt, darunter weiterhin die Bildpostkarten-Datenbank, Arbeiten im Umfeld der „Internationalen Computerspielsammlung“ sowie Open-Source-Werkzeuge wie <https://oaiexplorer.de/>.

### Warum eine weitere Software?

Ein wiederkehrendes Problem ist m.E. die Lücke zwischen den fachlichen Anforderungen einer Einrichtung und der technischen Komplexität der vorhandenen Systeme.

Gerade Import, Export und standardisierte Austauschformate sind häufig technisch aufwendig. Anpassungen erfordern Konfigurationsdateien, Transformationen oder direkte Arbeit mit XML, XSLT und ähnlichen Technologien. Für kleinere Museen, Sammlungen, Archive oder Spezialbibliotheken ist das schwer dauerhaft zu betreiben, wenn entsprechendes technisches Personal nicht vorhanden ist.

Gleichzeitig gibt es etablierte Systeme, die leistungsfähig sind, deren Architektur und Bedienkonzepte aber teilweise aus einer anderen Generation von Software stammen. Viele Lösungen sind proprietär oder für kleinere Einrichtungen finanziell und organisatorisch schwer zugänglich.

Mit Katalon möchte ich auf Basis einer modernen Webarchitektur Datenmodelle frei konfigurierbar machen und möglichst viele der sonst nötigen technischen Anpassungen in die Benutzeroberfläche verlagern.

Datenmodelle, Beziehungen, Vokabulare, Workflows und Präsentation sollen sich an unterschiedliche Sammlungen und Einrichtungen anpassen lassen, ohne für jeden Anwendungsfall eine eigene Software entwickeln zu müssen. Die Software soll außerdem skalierbar sein und quasi "KI-ready" sein auf beiden Seiten: für die Einrichtung, die ihre Daten pflegt, und im Sinne eines performanten, barrierefreien Portals für die Öffentlichkeit dass mit den Anfragen von KI Crawlern umgehen kann.

### Standards statt Insellösung

Katalon orientiert sich an bestehenden fachlichen Standards: IIIF für digitale Medien, Metadaten- und Austauschformaten wie DC, LIDO und METS/MODS sowie standardisierten Schnittstellen.

Wenn sich relevante Standards oder Austauschformate weiterentwickeln und in der Praxis etablieren, soll Katalon nachgezogen werden. OAI-PMH und die REST-API machen Daten auch außerhalb der Benutzeroberfläche zugänglich; die REST-API bietet zudem Zugriff auf alle Funktionen und macht Katalon für die Integration in andere Systeme und Power-User nutzbar.

Import und Export gehören von Anfang an zum Konzept der Anwendung. Daten sollen einfach in das System gelangen, dort strukturiert bearbeitet werden und anschließend in möglichst offenen und standardisierten Formaten wieder herauskommen.

### Linked Data als praktische Funktion

Ein weiterer Ausgangspunkt für Katalon ist die Erfahrung mit Linked Data und Linked Open Data im Kulturerbe-Bereich.

Semantische Modelle, kontrollierte Identifikatoren und verknüpfte Daten werden im Kulturerbe-Bereich seit vielen Jahren diskutiert. Ihre Nutzung erfordert jedoch häufig spezielle technische Infrastruktur, die vielen Einrichtungen fehlt. Katalon soll diese Ansätze über die Anwendung nutzbar machen.

Relationen zwischen Objekten, Personen, Orten, Vorgängen, Sammlungen und kontrollierten Vokabularen gehören deshalb zum Datenmodell selbst und sind auch für standardisierte Linked-Data-Ausgaben und Abfragen nutzbar.

Bestehende Modelle und Identifikatoren sollen so eingebunden werden, dass verknüpfte Daten auch für Einrichtungen praktisch nutzbar werden, die keine eigene Semantic-Web-Infrastruktur betreiben können. Ein eigenes semantisches Modell neben etablierten Standards baut Katalon dafür nicht auf.

### Was Katalon nicht sein soll

Katalon ist kein Bibliotheksmanagementsystem und soll auch keins werden. Funktionen wie Ausleihe, Erwerbung, Zeitschriftenverwaltung oder klassische integrierte Bibliotheksverwaltung gehören nicht zum geplanten Funktionsumfang.

Es soll auch nicht in erster Linie ein Aggregator sein, in dem hauptsächlich Datensätze aus anderen Systemen zusammengeführt und nachgewiesen werden. Katalon ist für Einrichtungen gedacht, die ihre Sammlungsdaten darin tatsächlich modellieren, pflegen, anreichern und veröffentlichen wollen.

Ebenso wenig soll Katalon bestehende Standards oder etablierte Datenmodelle durch proprietäre Alternativen ersetzen. Die Konfigurierbarkeit des Systems soll Einrichtungen Freiheit bei ihrem eigenen Datenmodell geben, ohne den Anschluss an gemeinsame Standards und Austauschwege zu verlieren.

Die Konfigurierbarkeit bleibt auf Sammlungsmanagement ausgerichtet: digitale Objekte, Metadaten, Beziehungen und Veröffentlichung.

### Ein Open-Source-Projekt

Ich entwickle Katalon derzeit im Wesentlichen allein.

Der offene Quellcode, der Datenexport und die verwendeten Open-Source-Komponenten sollen Einrichtungen einen späteren Systemwechsel ermöglichen.

Deshalb berücksichtige ich Schnittstellen, Austauschformate und offene Datenstrukturen schon beim Aufbau des Systems.

Katalon ist neben meiner beruflichen Tätigkeit entstanden. Ich entwickle es weiter, solange es dafür sinnvolle Fragestellungen, Interesse und Nutzung gibt. Unbegrenzte Weiterentwicklung oder dauerhaften Support kann ich nicht zusagen.

Mich interessiert, wie gute Software für wissenschaftliche und kulturelle Sammlungen heute aussehen kann. Ein Geschäftsmodell verfolge ich damit nicht. Wenn weitere Einrichtungen Katalon einsetzen, können wir bei Entwicklung, Dokumentation, Standards und Betrieb zusammenarbeiten.

- **Lizenz:** [AGPL-3.0-or-later](https://github.com/katalon-collections/katalon/blob/main/LICENSE)
- **Quellcode:** [github.com/katalon-collections/katalon](https://github.com/katalon-collections/katalon)
- **Diese Dokumentation:** [github.com/katalon-collections/katalon-docs](https://github.com/katalon-collections/katalon-docs)
