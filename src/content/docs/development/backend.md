---
title: Backend-Entwicklung
description: Leitfaden für die lokale Entwicklung am Python/FastAPI-Backend von Katalon Collections mit uv, Alembic und pytest.
---

Das Backend von Katalon Collections basiert auf Python 3.14+, FastAPI, SQLAlchemy 2.0 Async und Celery. Für schnelle Debugging-Zyklen und IDE-Integration können Sie das Backend direkt auf Ihrem Hostsystem ohne Docker ausführen.

:::note[Verfügbar ab Version 1.36.0]
Die Backend-Entwicklung setzt auf den modernen Paketmanager `uv` und strikt typisiertes Python mit `ruff` und `mypy`.
:::

## Lokales Setup mit `uv`

Wir empfehlen [uv](https://docs.astral.sh/uv/) für das Management von Python-Versionen und virtuellen Umgebungen.

### 1. Virtuelle Umgebung erstellen & Abhängigkeiten installieren

Wechseln Sie in das Hauptverzeichnis und initialisieren Sie die Entwicklungsumgebung:

```bash
# Virtuelle Umgebung im Repo-Root erzeugen
uv venv
source .venv/bin/activate

# Backend-Paket im Editiermodus inklusive Entwicklungs-Tools installieren
cd backend
uv pip install -e ".[dev]"
cd ..
```

:::tip[uv Workspace]
Katalon nutzt einen `uv`-Workspace mit `backend` als Mitglied. Dadurch können Befehle wie `uv run katalon-manage` oder `uv run pytest` direkt aus dem Hauptverzeichnis ausgeführt werden.
:::

---

## Begleitdienste über Docker starten

Auch bei lokaler Backend-Ausführung werden PostgreSQL, Redis, Elasticsearch und Cantaloupe benötigt. Starten Sie diese einfach im Hintergrund:

```bash
docker compose up -d db redis elasticsearch cantaloupe
```

Nach wenigen Sekunden sind die Dienste auf den Standardports erreichbar:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Elasticsearch: `localhost:9200`
- Cantaloupe: `localhost:8182`

---

## Datenbankmigrationen mit Alembic

Katalon verwaltet das Datenbankschema streng versioniert über **Alembic**.

### Migrationen anwenden

Führen Sie alle ausstehenden Migrationen auf die lokale Datenbank aus:

```bash
cd backend
alembic upgrade head
```

:::warning[Niemals Tabellen manuell erzeugen]
Erzeugen Sie die Datenbankstruktur niemals direkt über `Base.metadata.create_all()` mit anschließendem `alembic stamp`. Die Alembic-Migrationsskripte enthalten essenzielle Initialdaten (wie die Standard-Rollen- und Berechtigungsmatrix sowie Systemvokabulare), die andernfalls fehlen würden.
:::

### Neue Migration erstellen

Wenn Sie Modelle in `backend/src/katalon/core/models.py` ändern, generieren Sie ein neues Migrationsskript:

```bash
cd backend
alembic revision --autogenerate -m "add_curation_notes_to_objects"
```

Prüfen Sie die neu erzeugte Datei in `backend/migrations/versions/` sorgfältig auf Richtigkeit (insbesondere Indizes und Fremdschlüssel-Constraints), bevor Sie sie committen.

---

## Dienste lokal starten

Für die vollständige lokale Ausführung starten Sie drei separate Terminals:

### Terminal 1: FastAPI Webserver (Uvicorn)

```bash
cd backend
uvicorn katalon.main:app --reload --port 8000
```
Die interaktive OpenAPI-Dokumentation (Swagger UI) ist nun unter [http://localhost:8000/api/docs](http://localhost:8000/api/docs) erreichbar.

### Terminal 2: Celery Worker (Task Queue)

Der Celery-Worker verarbeitet asynchrone Aufgaben wie Bildkonvertierung und Volltext-Indizierung:

```bash
cd backend
celery -A katalon.workers.celery_app worker --loglevel=info
```

### Terminal 3: Celery Beat (Periodische Aufgaben)

Für wiederkehrende Hintergrundjobs (z. B. nächtliche Cache- und Upload-Bereinigungen):

```bash
cd backend
celery -A katalon.workers.celery_app beat --loglevel=info
```

---

## Tests ausführen mit `pytest`

Die Testsuite deckt Unit-Tests, Schemaprüfungen, Autorisierungsregeln und API-Integrationstests ab.

### Wichtige Umgebungsvariablen

Für die Testausführung müssen Sie einen mindestens 32 Zeichen langen Testschlüssel setzen:

```bash
KATALON_SECRETS_KEY="test-katalon-secrets-key-32-chars" uv run pytest backend/tests/
```

### macOS-Besonderheit: libvips und `DYLD_LIBRARY_PATH`

Auf Apple Silicon Macs installiert Homebrew die Bibliothek `libvips` unter `/opt/homebrew/opt/vips/lib`. Damit die Python-Bindung `pyvips` die dynamische Bibliothek `libvips.42.dylib` findet, muss der Suchpfad beim Testaufruf mitgegeben werden:

```bash
KATALON_SECRETS_KEY="test-katalon-secrets-key-32-chars" \
DYLD_LIBRARY_PATH="/opt/homebrew/opt/vips/lib" \
uv run pytest backend/tests/
```

### Gezielte Testläufe

Führen Sie Tests gezielt für das Modul aus, an dem Sie arbeiten, um schnelle Rückmeldungen zu erhalten:

```bash
# Nur Schema- und Mapping-Tests:
uv run pytest backend/tests/test_metadata_mapping_spec.py

# Nur Berechtigungs- und Rollenprüfungen:
uv run pytest backend/tests/test_route_security_boundaries.py

# Bestimmte Testfunktion mit ausführlicher Ausgabe:
uv run pytest backend/tests/test_objects.py -k "test_create_object" -vv
```

---

## Code-Qualität & Linting

Katalon setzt auf strikte automatisierte Prüfungen für Code-Formatierung und Typensicherheit:

### Ruff (Linter & Formatter)

Ruff prüft Imports, Stilrichtlinien, Best Practices und formatiert den Code einheitlich (Zeilenlänge: 100 Zeichen):

```bash
# Linter prüfen:
uvx ruff check backend/src backend/tests

# Bekannte Probleme automatisch beheben:
uvx ruff check --fix backend/src backend/tests

# Code automatisch formatieren:
uvx ruff format backend/src backend/tests
```

### Mypy (Statische Typprüfung)

Das Backend erzwingt Typannotationen (`strict = true`):

```bash
uv run mypy backend/src
```

### Architektur- und Codierrichtlinien

- **Schichtentrennung:** Halten Sie API-Handler dünn. Geschäftslogik gehört in `services/`, externe Systemaufrufe in `integrations/`.
- **Parametrisierte Abfragen:** Nutzen Sie ausnahmslos parametrisierte SQLAlchemy-Statements — niemals String-Interpolation oder ungesäuberte SQL-Strings.
- **Fehlerbehandlung:** Vermeiden Sie stille `except Exception: pass` Blöcke. Fehler müssen mindestens über `logger.warning(..., exc_info=True)` protokolliert werden.
- **Hierarchien (`parent_id`):** Neue selbstreferenzierende Tabellen (wie Sammlungen oder Lagerorte) erfordern verpflichtend eine Zyklus-Prüfung beim Update sowie Guards gegen stilles Verwaisen beim Löschen.
