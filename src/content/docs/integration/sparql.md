---
title: SPARQL-Endpoint (Oxigraph)
description: W3C SPARQL 1.1 Protocol Endpoint zur semantischen Abfrage des Katalon-Wissensgraphen über den integrierten Triple Store.
---

:::note[Verfügbar ab Version 1.19.20]
:::

Katalon bietet neben der Volltext- und Facettensuche in Elasticsearch eine **optionale Linked-Data-Schicht** mit nativer **SPARQL 1.1**-Schnittstelle. Als Triple Store kommt die hochperformante Open-Source-Graphdatenbank **Oxigraph** zum Einsatz.

Die relationale PostgreSQL-Datenbank bleibt dabei stets die alleinige Quelle der Wahrheit (Single Source of Truth); Oxigraph dient als asynchron synchronisierte, read-only RDF-Projektion aller öffentlich publizierten Datensätze.


---

## Konzept: Relationales MMS mit RDF-Projektion (vs. Wikibase)

Bei der Evaluierung von Linked Data und SPARQL in Katalon ist die architektonische Stoßrichtung wichtig: **Katalon funktioniert genau umgekehrt wie ein nativer Graph-Store oder Wikibase.**

### 1. Zuerst die relationale Datenbank für den Sammlungsalltag

Im Zentrum steht ein schnelles, konsistentes und einfach zu bedienendes Sammlungsmanagementsystem (MMS) auf Basis von PostgreSQL und Elasticsearch:

- **7 feste GLAM-Kerntypen:** Objekte, Akteure/Körperschaften, Orte, Ereignisse/Werke, Sammlungen, Lagerorte und Vorgänge bilden das stabile Grundgerüst.
- **Pragmatische Schema-Engine:** Felder (`field_definitions`), Subtypen und kontrollierte Vokabulare (`skos:Concept`) werden administrativ über die Oberfläche konfiguriert und steuern direkt die Eingabemasken.
- **Relationennetz:** Typübergreifende Beziehungen zwischen Datensätzen besitzen Typ-Codes und Metadaten (JSONB).
- **Volltext & Facetten:** Elasticsearch liefert die performante Such- und Filterschicht für Portal und Admin-Bereich.

### 2. Automatische RDF-Projektion statt nativer Tripel-Erfassung

Statt Rohdaten direkt als Tripel (Subjekt, Prädikat, Objekt) zu erfassen, generiert Katalon den Wissensgraphen vollautomatisch als asynchrone Projektion nach Oxigraph.

Das trägt der GLAM-Praxis Rechnung: Kaum ein Museum erfasst im Alltag direkt native CIDOC-CRM-Tripel (`E22 Human-Made Object → P108i → E12 Production → P14 → E21 Person`). Der reale Datenfluss im Kulturbereich verläuft fast immer über lokale Systeme und zwischengeschaltete Austauschformate:

```text
Lokales System (Katalon / MuseumPlus / Alma)
        ↓  (relationales, institutseigenes Datenmodell)
Austauschformat (LIDO / MARCXML / EAD / Dublin Core)
        ↓
Aggregator (DDB / Europeana)
        ↓  (zentrale Harmonisierung, Normalisierung & Anreicherung)
EDM / RDF / Knowledge Graph
```

Aggregatoren wie die Deutsche Digitale Bibliothek (DDB) transformieren heterogene Zulieferungen nachträglich in RDF/EDM. Katalon schlägt die Brücke direkt im Haus: **Einfaches relationales Erfassungsmodell für den Arbeitsalltag, automatische Projektion nach CIDOC-CRM und LRMoo im Hintergrund.**

### 3. Konsequenz: Freie Modellierung und die Grenzen von SPARQL

Katalon erlaubt es, Schemafelder völlig frei zu konfigurieren. Für die Ausgabe über SPARQL hat diese Freiheit jedoch eine direkte Konsequenz:

**Der SPARQL-Endpunkt kann nur die Strukturen als Graph verknüpfen, die im relationalen Modell als Relation, Entität oder Vokabular angelegt wurden.**

Katalon übersetzt die erfassten Primärtypen und Relationen deterministisch in RDF-Klassen und Prädikate. Fehlt die relationale Struktur in den Rohdaten, kann auch die RDF-Projektion keine Wunder vollbringen.

#### Freitext versus relationales Netz im Vergleich

- **Szenario A: Freitext im Objekt (Sackgasse für SPARQL)**
  Wird die Urheberschaft als einfaches Textfeld im Objekt erfasst (z. B. `kuenstler = "Marta Keller, München"`), landet dieser Wert im Triple Store lediglich als flaches Literal an der Objekt-URI.
  *Folge:* Eine SPARQL-Abfrage nach allen Objekten von Künstler:innen aus einem bestimmten Ort oder eine Verknüpfung mit GND und Wikidata ist **unmöglich**. Im Graphen existiert weder ein Akteursknoten noch ein Ortsknoten, über den gefiltert oder traversiert werden könnte.

- **Szenario B: Relational modelliert (Echter Wissensgraph)**
  Das Objekt wird über eine typisierte Relation (`geschaffen von`) mit einem Datensatz vom Typ **Entität** (Person) verknüpft. Die Person besitzt eine GND-URI und ist wiederum über eine Relation mit dem **Ort** (München) verbunden.
  *Folge:* Katalon projiziert saubere CIDOC-CRM-Knoten und Prädikate:
  ```sparql
  # Liefert alle Objekte von Akteuren mit Wohn- oder Wirkort
  SELECT ?object ?actor ?place WHERE {
    ?object crm:P14_carried_out_by ?actor .
    ?actor  crm:P74_has_current_or_former_residence ?place .
  }
  ```

#### Leitlinien für ein SPARQL-fähiges Schema

1. **Akteure und Orte als eigene Datensätze:** Personen, Körperschaften und Orte nicht in Freitextfeldern vergraben, sondern als verknüpfte Entitäten (`entity`, `place`) modellieren.
2. **Typisierte Relationen nutzen:** Relationen präzise benennen (`geschaffen von`, `ausgestellt in`). Katalon bildet typisierte Relationen automatisch auf spezifische CRM-Prädikate ab (`crm:P14_carried_out_by`, `crm:P7_took_place_at`, `crm:P138_represents`).
3. **Kontrollierte Vokabulare für Typen:** Für Objekttypen, Techniken und Rollen Vokabulare einsetzen. Diese werden als `skos:Concept` projiziert und erlauben hierarchische Graph-Abfragen (`skos:broader*`).
4. **Normdaten und PIDs hinterlegen:** GND-, Wikidata- oder AAT-IDs am Datensatz erfassen. Katalon erzeugt daraus `owl:sameAs`- und Normdaten-Triples für das Semantic Web.

---

## Architektur & Synchronisation

- **Named Graphs:** Jeder öffentlich sichtbare Datensatz (`status: "public"`) wird als eigener Named Graph in Oxigraph gehalten:
  ```text
  urn:katalon:graph:<record_type>:<uuid>
  ```
  Beispiel: `urn:katalon:graph:object:550e8400-e29b-41d4-a716-446655440000`.
- **Echtzeit-Aktualisierung:** Bei Erstellung, Aktualisierung oder Löschung von Datensätzen synchronisiert ein Celery-Hintergrundtask (`sync_rdf_record_task` bzw. `remove_rdf_record_task`) den jeweiligen Named Graph atomar via W3C Graph Store Protocol (`PUT` / `DELETE`).
- **Sichtbarkeitsschutz:** Nicht-öffentliche Entwürfe oder interne Datensätze werden niemals in den Triple Store übertragen. Wird ein veröffentlichter Datensatz auf `draft` oder `internal` zurückgesetzt, wird sein Graph in Oxigraph sofort entfernt.
- **Ressourcenschonend:** Wenn die Option `OXIGRAPH_ENABLED=false` konfiguriert ist, erzeugt das System keinerlei Hintergrund-Overhead (Zero-Clutter-Prinzip).

---

## Endpunkt & Protokoll

Der SPARQL-Endpunkt implementiert das standardisierte **W3C SPARQL 1.1 Protocol**.

| Eigenschaft | Wert |
|---|---|
| **Kanonische URL** | `https://katalon.example.org/sparql` |
| **API-Pfad (Alias)** | `https://katalon.example.org/api/v1/sparql` |
| **Protokoll** | SPARQL 1.1 Query |
| **Erlaubte Operationen** | `SELECT`, `CONSTRUCT`, `DESCRIBE`, `ASK` |
| **Schreiboperationen** | Strikt abgewiesen (`INSERT`, `DELETE`, `DROP` etc.) |

### HTTP GET

Abfragen können per HTTP GET mit dem URL-Parameter `query` übermittelt werden:

```bash
curl -G "https://katalon.example.org/sparql" \
  --data-urlencode "query=SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10" \
  -H "Accept: application/sparql-results+json" \
  -H "Authorization: Bearer <dein-jwt-token>"
```

### HTTP POST (Form-encoded)

Für längere Abfragen empfiehlt sich POST mit `Content-Type: application/x-www-form-urlencoded`:

```bash
curl -X POST "https://katalon.example.org/sparql" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/sparql-results+json" \
  -H "X-API-Key: <dein-api-key>" \
  --data-urlencode "query=SELECT ?class (COUNT(?s) AS ?count) WHERE { ?s a ?class } GROUP BY ?class"
```

### HTTP POST (Direct SPARQL Query)

Alternativ kann die Abfrage direkt im Request-Body mit `Content-Type: application/sparql-query` übermittelt werden:

```bash
curl -X POST "https://katalon.example.org/sparql" \
  -H "Content-Type: application/sparql-query" \
  -H "Accept: text/turtle" \
  -H "Authorization: Bearer <dein-jwt-token>" \
  --data 'DESCRIBE <https://katalon.example.org/objects/550e8400-e29b-41d4-a716-446655440000>'
```

---

## Authentifizierung & Zugriffsschutz

Der Zugriff auf den SPARQL-Endpunkt ist standardmäßig geschützt:

1. **Authentifizierung erforderlich (`SPARQL_REQUIRE_AUTH=true`):**
   - Jeder Request muss entweder einen gültigen JWT-Bearer-Token (`Authorization: Bearer <token>`) oder einen gültigen API-Key (`X-API-Key: <key>`) übermitteln.
   - Unauthentifizierte Anfragen werden mit `401 Unauthorized` abgewiesen.
2. **Öffentlicher Zugriff (`SPARQL_REQUIRE_AUTH=false`):**
   - Für Open-Data-Portale kann der Betreiber den Endpunkt in der `.env` öffentlich schalten. Da im Triple Store ohnehin ausschließlich publizierte Daten liegen, ist dieser Modus sicher.

---

## Schutz vor Überlastung & Missbrauch

Der Endpunkt verfügt über integrierte Sicherheitsmechanismen:

- **Read-Only-Guard:** Jede eingehende Abfrage wird über einen AST-Parser (`rdflib`) geprüft. Schreibende Operationen (`INSERT`, `DELETE`, `CLEAR`, `DROP`, `LOAD`, `CREATE`) oder verkettete Multi-Statements werden sofort mit `400 Bad Request` zurückgewiesen.
- **Größenbegrenzung:** Anfragen über `SPARQL_MAX_QUERY_LENGTH` (Standard: 64 KB) werden mit `413 Content Too Large` abgelehnt.
- **Timeout:** Abfragen werden nach Ablauf von `SPARQL_QUERY_TIMEOUT` (Standard: 30 Sekunden) serverseitig abgebrochen (`504 Gateway Timeout`).
- **Rate-Limiting:** Der Endpunkt ist pro IP bzw. Token ratenbegrenzt (`RATE_LIMIT_SPARQL`, Standard: `60/minute`).

---

## Ergebnisformate (Content Negotiation)

Über den HTTP-Header `Accept` kann das gewünschte Ausgabeformat gewählt werden:

### Für `SELECT` und `ASK`-Abfragen:
- `application/sparql-results+json` (Standard)
- `application/sparql-results+xml`
- `text/csv`
- `text/tab-separated-values`

### Für `CONSTRUCT` und `DESCRIBE`-Abfragen:
- `text/turtle` (Standard)
- `application/ld+json`
- `application/n-triples`
- `application/rdf+xml`

---

## Verwendete Ontologien & Präfixe

Die Datensätze sind nach den Standards **CIDOC-CRM** (ISO 21127), **LRMoo** und **SKOS** modelliert:

```sparql
PREFIX crm:     <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX lrmoo:   <http://iflastandards.info/ns/lrm/lrmoo/>
PREFIX skos:    <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>
```

---

## Beispiel-Abfragen

### 1. Alle publizierten Objekte mit Titeln auflisten

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?object ?title WHERE {
  ?object a crm:E22_Human-Made_Object ;
          crm:P102_has_title / rdfs:label ?title .
}
LIMIT 50
```

### 2. Objekte und beteiligte Personen / Körperschaften

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?object ?title ?actorName WHERE {
  ?object a crm:E22_Human-Made_Object ;
          crm:P102_has_title / rdfs:label ?title ;
          crm:P14_carried_out_by ?actor .
  ?actor rdfs:label ?actorName .
}
LIMIT 50
```

### 3. Anzahl der Datensätze pro RDF-Klasse ermitteln

```sparql
SELECT ?class (COUNT(?instance) AS ?count) WHERE {
  ?instance a ?class .
}
GROUP BY ?class
ORDER BY DESC(?count)
```

### 4. Teilgraph eines bestimmten Datensatzes extrahieren (`CONSTRUCT`)

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>

CONSTRUCT {
  ?object ?p ?o .
} WHERE {
  GRAPH ?g {
    ?object ?p ?o .
  }
  FILTER(?object = <https://katalon.example.org/objects/550e8400-e29b-41d4-a716-446655440000>)
}
```

---

## Verwaltung im Admin-Bereich

In der Admin-Oberfläche steht Administratoren unter **Einstellungen** die Sektion **Linked Data & SPARQL** zur Verfügung:

- **Statusindikator:** Zeigt an, ob Oxigraph aktiv und erreichbar ist.
- **Triple-Zähler:** Aktuelle Gesamtanzahl der indexierten Tripel im Triple Store.
- **Endpunkt-URL:** Direkter Link und Kopier-Button zur Schnittstelle.
- **Index neu aufbauen:** Ein Klick auf *„RDF-Index neu aufbauen“* löst im Hintergrund einen asynchronen Celery-Task (`rebuild_rdf_all_task`) aus, der alle publizierten Datensätze aus PostgreSQL in Oxigraph neu materialisiert.

Für die Server-Konfiguration und das Docker-Setup siehe [Produktionsbetrieb: RDF-Projektion & SPARQL einrichten](/katalon-docs/administration/production/#optionale-rdf-projektion--sparql-schnittstelle-oxigraph).
