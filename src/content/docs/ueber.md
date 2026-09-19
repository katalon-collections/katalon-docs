---
title: Über Katalon Collections
description: Was Katalon Collections ist, warum es entstanden ist und wer dahintersteht.
---

## Was ist Katalon Collections?

Katalon Collections ist ein Open-Source **Sammlungs Management System** für den GLAM-Sektor — Galerien, Bibliotheken, Archive und Museen. Es verbindet flexible, dynamische Metadatenschemata mit einer sauberen REST-API, zwei spezialisierten Frontends (Admin-Oberfläche und öffentliches Portal) und einer containerisierten Deployment-Infrastruktur.

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

Lizenzrechtlich ist Katalon unter der **AGPL-3.0-or-later** freigegeben. Die Netzwerk-Klausel der AGPL verhindert, dass ein modifiziertes Katalon als geschlossener, gehosteter Dienst angeboten wird, ohne die Änderungen zurückzugeben — unmodifizierter kommerzieller Weiterbetrieb bleibt davon unberührt.

## Wer steht dahinter?

Katalon Collections wird von **Karl Krägelin** entwickelt und gepflegt. Katalon ist aus mehreren Jahren Arbeit mit digitalen Sammlungen, Bibliothekssystemen, Metadaten und Forschungsdateninfrastrukturen entstanden.

### Werdegang

Seit 2016 arbeite ich an Software und Dateninfrastrukturen für wissenschaftliche Sammlungen, Bibliotheken und Forschungsdaten. Dabei habe ich sehr unterschiedliche Seiten solcher Systeme kennengelernt: Datenmodellierung und Datenbereinigung, Import und Export, Metadatentransformationen, Schnittstellen, Softwareentwicklung sowie inzwischen auch Architektur und IT-Projektmanagement.

Von 2016 bis 2018 habe ich für eine wissenschaftliche Sammlung historischer Bildpostkarten eine Datenbank auf Basis von CollectiveAccess aufgebaut. Dazu gehörten insbesondere die Entwicklung des Datenmodells, die Aufbereitung vorhandener Daten und die Vorbereitung der Migration in das neue System.

Ab 2018 arbeitete ich an der Niedersächsischen Staats- und Universitätsbibliothek Göttingen bei der Fachstelle Bibliothek der Deutschen Digitalen Bibliothek. Ein Schwerpunkt lag dort auf Austauschformaten und Datenpipelines, insbesondere METS/MODS sowie auf Transformation, Validierung und Verarbeitung größerer Metadatenbestände. In dieser Zeit entstanden auch mehrere Softwarewerkzeuge und Dienste.

Seit 2023 arbeite ich an der Universitäts- und Landesbibliothek Münster als Softwareentwickler im Bereich Forschungsdatenmanagement. Ein Schwerpunkt liegt auf dem institutionellen Forschungsdatenrepository und dem Publikationsserver der Universität auf Basis der Software InvenioRDM. Seit 2025 umfasst meine Arbeit zunehmend auch IT-Projektmanagement.

Daneben habe ich verschiedene kleinere Projekte betreut oder entwickelt, darunter weiterhin die Bildpostkarten-Datenbank, Arbeiten im Umfeld der "Internationalen Computerspielsammlung" sowie Open-Source-Werkzeuge für OAI-PMH wie <https://oaiexplorer.de/>.

### Warum eine weitere Software?

Ein wiederkehrendes Problem in diesen Projekten war die Lücke zwischen den fachlichen Anforderungen einer Einrichtung und der technischen Komplexität der vorhandenen Systeme.

Gerade Import, Export und standardisierte Austauschformate sind häufig technisch aufwendig. Anpassungen erfordern Konfigurationsdateien, Transformationen oder direkte Arbeit mit XML, XSLT und ähnlichen Technologien. Für kleinere Museen, Sammlungen, Archive oder Spezialbibliotheken ist das schwer dauerhaft zu betreiben, wenn entsprechendes technisches Personal nicht vorhanden ist.

Gleichzeitig gibt es etablierte Systeme, die leistungsfähig sind, deren Architektur und Bedienkonzepte aber teilweise aus einer anderen Generation von Software stammen. Viele Lösungen sind proprietär oder für kleinere Einrichtungen finanziell und organisatorisch schwer zugänglich.

Katalon entstand aus der Frage, wie ein solches System heute aussehen könnte: mit einer modernen Webarchitektur, frei konfigurierbaren Datenmodellen und möglichst vielen Funktionen, die normalerweise technische Anpassungen erfordern, direkt in der Anwendung.

Der Anspruch ist dabei durchaus breit: Datenmodelle, Beziehungen, Vokabulare, Workflows und Präsentation sollen so flexibel konfigurierbar sein, dass Katalon für sehr unterschiedliche Sammlungen und institutionelle Kontexte eingesetzt werden kann, ohne für jeden Anwendungsfall eine eigene Software entwickeln zu müssen.

### Standards statt Insellösung

Katalon erfindet dabei keine eigenen fachlichen Standards. Grundlage sind bestehende und sich weiterentwickelnde Standards: IIIF für digitale Medien, etablierte Metadaten- und Austauschformate (DC, LIDO, METS/MODS usw.) sowie standardisierte Schnittstellen.

Wenn sich relevante Standards oder Austauschformate weiterentwickeln und in der Praxis etablieren, zieht Katalon nach. Eine OAI-PMH-Schnittstelle gehört ebenso zum Grundverständnis wie eine REST-API, über die Daten und Funktionen auch außerhalb der Benutzeroberfläche zugänglich bleiben.

Import und Export gehören zum grundlegenden Konzept der Anwendung, keine nachträglich ergänzten Funktionen. Daten sollen einfach in das System gelangen, dort strukturiert bearbeitet werden und anschließend in möglichst offenen und standardisierten Formen wieder herauskommen.

### Linked Data als praktische Funktion

Ein weiterer Ausgangspunkt für Katalon ist die Erfahrung mit Linked Data und Linked Open Data im Kulturerbe-Bereich.

Seit vielen Jahren spielen semantische Modelle, kontrollierte Identifikatoren und verknüpfte Daten in der fachlichen Diskussion eine wichtige Rolle. In der alltäglichen Arbeit vieler Einrichtungen sind diese Ansätze jedoch häufig nur schwer praktisch nutzbar. Zwischen den theoretischen Möglichkeiten und Werkzeugen, die ohne spezielle technische Infrastruktur eingesetzt werden können, besteht weiterhin eine deutliche Lücke.

Katalon soll versuchen, diese Lücke zu verkleinern.

Relationen zwischen Objekten, Personen, Orten, Vorgängen, Sammlungen und kontrollierten Vokabularen gehören deshalb zum Datenmodell selbst und sind auch für standardisierte Linked-Data-Ausgaben und Abfragen nutzbar.

Bestehende Modelle und Identifikatoren sollen so eingebunden werden, dass verknüpfte Daten auch für Einrichtungen praktisch nutzbar werden, die keine eigene Semantic-Web-Infrastruktur betreiben können. Ein eigenes semantisches Modell neben etablierten Standards baut Katalon dafür nicht auf.

### Was Katalon nicht sein soll

Katalon ist kein Bibliotheksmanagementsystem und soll auch keins werden. Funktionen wie Ausleihe, Erwerbung, Zeitschriftenverwaltung oder klassische integrierte Bibliotheksverwaltung gehören nicht zum geplanten Funktionsumfang.

Es soll auch kein Aggregator sein, in dem hauptsächlich Datensätze aus anderen Systemen zusammengeführt und nachgewiesen werden. Katalon ist für Einrichtungen gedacht, die ihre Sammlungsdaten darin tatsächlich modellieren, pflegen, anreichern und veröffentlichen wollen.

Ebenso wenig soll Katalon bestehende Standards oder etablierte Datenmodelle durch proprietäre Alternativen ersetzen. Die Konfigurierbarkeit des Systems soll Einrichtungen Freiheit bei ihrem eigenen Datenmodell geben, ohne den Anschluss an gemeinsame Standards und Austauschwege zu verlieren.

Damit liegt der Anspruch zwischen zwei Polen: Katalon soll möglichst flexibel und für unterschiedliche Sammlungen einsetzbar sein, gleichzeitig aber einen klaren fachlichen Rahmen für Sammlungsmanagement, digitale Objekte, Metadaten, Beziehungen und Veröffentlichung behalten.

### Ein Open-Source-Projekt

Katalon wird derzeit im Wesentlichen von einer Person entwickelt. Das soll nicht verschleiert werden.

Gleichzeitig ist das Projekt bewusst so angelegt, dass daraus möglichst wenig Abhängigkeit entsteht. Der Quellcode ist offen, Daten können exportiert werden und die verwendeten Technologien sind etablierte Open-Source-Komponenten. Eine Einrichtung soll ihre Daten nicht deshalb in Katalon halten müssen, weil ein späterer Wechsel technisch kaum möglich ist.

Auch die starke Gewichtung von Schnittstellen, Austauschformaten und offenen Datenstrukturen gehört zu diesem Gedanken. Der mögliche Ausstieg aus einem System sollte bereits bei dessen Entwicklung mitgedacht werden.

Katalon ist ein Open-Source-Projekt, das neben meiner beruflichen Tätigkeit entstanden ist. Ich entwickle es weiter, solange es dafür sinnvolle Fragestellungen, Interesse und reale Nutzung gibt. Eine Zusage auf unbegrenzte Weiterentwicklung oder dauerhaften Support ist damit ausdrücklich nicht verbunden.

Antrieb dafür ist das Interesse an der Frage, wie gute Software für wissenschaftliche und kulturelle Sammlungen heute aussehen kann, kein Geschäftsmodell. Setzen weitere Einrichtungen Katalon ein, kann daraus perspektivisch auch eine breitere Zusammenarbeit rund um Entwicklung, Dokumentation, Standards und Betrieb entstehen.

- **Lizenz:** [AGPL-3.0-or-later](https://github.com/katalon-collections/katalon/blob/main/LICENSE)
- **Quellcode:** [github.com/katalon-collections/katalon](https://github.com/katalon-collections/katalon)
- **Diese Dokumentation:** [github.com/katalon-collections/katalon-docs](https://github.com/katalon-collections/katalon-docs)
