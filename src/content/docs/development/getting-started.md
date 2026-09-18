---
title: Erste Schritte für Entwickler
description: Schnelleinstieg in die Entwicklungsumgebung von Katalon Collections mit Docker Compose oder lokalem Stack.
---

Willkommen bei der Entwicklung von Katalon Collections! Dieser Leitfaden führt Sie durch das Einrichten einer lokalen Entwicklungsumgebung, das Starten der Dienste, den Umgang mit Zugangsdaten und das Laden von Testdaten.

:::note[Verfügbar ab Version 1.36.0]
Die empfohlene Entwicklungsumgebung basiert auf Docker Compose v2 mit Live-Reload für Backend, Frontends und Worker.
:::

## Systemvoraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgende Software auf Ihrem System installiert ist:

- **Git** (zur Quellcodeverwaltung)
- **Docker & Docker Compose v2** (Docker Desktop, OrbStack oder Docker Engine ab v24+)
- *(Optional für rein lokale Entwicklung ohne Docker)*:
  - **Python 3.14+** und [uv](https://docs.astral.sh/uv/) (extrem schneller Python-Paketmanager)
  - **Node.js 20+** und **npm** bzw. **pnpm**
  - **libvips** (unter macOS: `brew install vips`)

---

## Repository klonen

Klonen Sie das offizielle Repository und wechseln Sie in das Projektverzeichnis:

```bash
git clone https://github.com/katalon-collections/katalon.git
cd katalon
```

---

## Entwicklungsstack starten: `make dev` vs. `make up`

Katalon stellt ein komfortables `Makefile` bereit, das die wichtigsten Compose-Befehle kapselt:

### 1. Empfohlen: Entwicklungsmodus mit Live-Reload (`make dev`)

Der Entwicklungsmodus bindet den lokalen Quellcode als Volumes in die Container ein. Jede Änderung an Python-Dateien oder Frontend-Komponenten wird sofort ohne Neubau der Images wirksam:

```bash
make dev
# Alternativer direkter Compose-Aufruf:
# docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Was automatisch neu lädt:**
- **FastAPI Backend:** Uvicorn lädt bei Änderungen in `backend/src/` per Hot-Reload neu.
- **Admin UI:** Vite Hot Module Replacement (HMR) spiegelt Änderungen in `frontend/admin/src/` sofort wider.
- **Portal UI:** Vite HMR spiegelt Änderungen in `frontend/portal/src/` wider.
- **Celery Worker:** Überwacht Änderungen via `watchfiles` und startet die Worker-Prozesse neu.

### 2. Produktivitätsnaher Stack (`make up`)

Für Integrationstests, das Prüfen von Nginx-Routing, SSL-Terminierung und finalen Produktions-Builds:

```bash
make up
# Alternativer Aufruf:
# docker compose up -d --build
```

Im produktiven Modus laufen alle Frontends als vorkompilierte Nginx-Container; es gibt keinen automatischen Live-Reload.

---

## Lokale URLs & Port-Regel

Achten Sie auf die Unterscheidung der Ports zwischen Dev- und Prod-Stack:

| Dienst | Entwicklungs-Stack (`make dev`) | Prod-Stack (`make up` via Nginx) |
|---|---|---|
| **Admin-Oberfläche** | [http://localhost:4000](http://localhost:4000) | [http://localhost/admin/](http://localhost/admin/) |
| **Öffentliches Portal** | [http://localhost:4001](http://localhost:4001) | [http://localhost/](http://localhost/) |
| **FastAPI REST-API** | [http://localhost:8000](http://localhost:8000) | [http://localhost/v1/](http://localhost/v1/) (intern geproxied) |
| **Interaktive API-Docs** | [http://localhost:8000/api/docs](http://localhost:8000/api/docs) | [http://localhost/api/docs](http://localhost/api/docs) |

:::caution[Port-Verwechslung vermeiden]
Rufen Sie im normalen Compose-Stack (`make up`) niemals direkt `http://localhost:3000` auf. Der Admin-Container wird mit `VITE_BASE_PATH=/admin/` gebaut und erwartet das Routing über den äußeren Nginx-Proxy. Direkter Zugriff auf Port 3000 führt zu einer leeren weißen Seite.
:::

---

## Zugangsdaten & Erststart

### Standard-Zugangsdaten im Dev-Stack

Beim ersten Start des Dev-Containers richtet das System automatisch ein administratives Erstkonto ein:

- **E-Mail:** `admin@katalon.dev`
- **Passwort:** `adminadmin`

### Zufallspasswort bei gesetzter Basis-URL (`first-run-credentials.txt`)

Wird eine feste Basis-URL konfiguriert (z. B. `KATALON_BASE_URL=https://katalon.local`), generiert Katalon aus Sicherheitsgründen beim ersten Start ein kryptografisch sicheres Einmalkennwort:

1. Das Passwort wird in den Logs des API-Containers ausgegeben:
   ```bash
   docker compose logs api | grep "KATALON FIRST RUN" -A 5
   ```
2. Zusätzlich wird die Datei `/app/first-run-credentials.txt` im API-Container abgelegt:
   ```bash
   docker compose exec api cat /app/first-run-credentials.txt
   ```

### Admin-Passwort zurücksetzen

Sollten Sie ein Kennwort vergessen haben, setzen Sie es über das integrierte CLI-Tool zurück:

```bash
# Zufälliges neues Passwort generieren und anzeigen:
docker compose exec api katalon-manage reset-admin --email admin@katalon.dev

# Oder explizit setzen:
docker compose exec api katalon-manage reset-admin --email admin@katalon.dev --password meinNeuesPasswort123
```

---

## Demo- und Testdaten einspielen

Um Katalon mit einem realistischen Datenbestand auszuprobieren, existiert ein Seed-Skript für eine fiktive **Weimarer Mustersammlung**. Es erzeugt 100 verknüpfte Datensätze über alle 7 Kerntypen (Objekte, Akteure, Orte, Ausstellungen, Sammlungen, Lagerorte, Leihvorgänge) inklusive Bildern und Vokabularen.

Führen Sie das Skript im laufenden API-Container aus:

```bash
docker compose exec api python /app/scripts/seed_demo.py
```

### Nützliche Optionen für das Seeding

- `--skip-downloads`: Erzeugt synthetische Testbilder lokal per Pillow statt Beispieldateien aus dem Internet zu laden (extrem schnell und offline-fähig).
- `--no-images`: Legt nur Metadatensätze ohne Medienverknüpfungen an.
- `--no-iiif`: Überspringt das Einreihen von IIIF-Kachelungsaufgaben in die Celery-Queue.

Beispiel für ultraschnelles Offline-Seeding:

```bash
docker compose exec api python /app/scripts/seed_demo.py --skip-downloads --no-iiif
```

---

## Datenbank & Suchindex zurücksetzen

Wenn Sie nach Schema-Experimenten oder Importtests wieder einen sauberen Zustand herstellen möchten:

### 1. Schneller Datenreset über die CLI (Schema bleibt erhalten)

```bash
# Setzt alle Erfassungsdaten zurück, behält aber Schema und Nutzer:
docker compose exec api katalon-manage db-reset --yes

# Vollständiger Reset inklusive Schema-Tabellen und Vokabularen:
docker compose exec api katalon-manage db-reset --all --no-backup --yes
docker compose restart api
```

### 2. Kompletter Docker-Volume-Reset (alles neu aufsetzen)

Löscht sämtliche Docker-Volumes (PostgreSQL-Datenbank, Elasticsearch-Index, Medienablage):

```bash
# Stack stoppen und Volumes vernichten:
make down-volumes
# Alternativ: docker compose down -v

# Stack neu starten (Alembic-Migrationen laufen automatisch beim Start):
make dev
```

:::warning[Keine Volume-Löschung in Produktivumgebungen]
Der Befehl `docker compose down -v` löscht sämtliche Datenbanken unwiderruflich. Verwenden Sie diesen Befehl ausschließlich auf lokalen Entwicklungsrechnern.
:::
