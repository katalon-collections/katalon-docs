---
title: Installation
description: Katalon lokal oder auf einem Server mit Docker Compose starten.
---

# Installation

Katalon ist Docker-first. Für einen normalen Start brauchst du Docker und Docker Compose v2.

## Schnellstart mit Docker Compose

```bash
git clone https://github.com/katalon-collections/katalon.git
cd Katalon
./install.sh --up
```

Der Installer legt die `.env` an, startet die Container und zeigt die ersten Admin-Zugangsdaten an.

## Alternative: Installation über `katalon-cli`

Für Produktions- und Server-Instanzen steht das CLI-Tool [`katalon-cli`](https://github.com/katalon-collections/katalon-cli) zur Verfügung, das gepinnte Release-Images nutzt und Konfigurationen automatisiert verwaltet:

```bash
# CLI installieren
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install katalon-cli

# Interaktiver Setup-Wizard (fragt Version, Domain, Ports und TLS ab)
katalon install --dir ~/katalon

# Instanz starten, stoppen und Status prüfen
katalon start --dir ~/katalon
katalon status --dir ~/katalon
```

Standardmäßig verwendet `katalon-cli` das Verzeichnis `/opt/katalon`. Soll `/opt/katalon` genutzt werden, muss das Verzeichnis vorab angelegt und dem eigenen Benutzer übergeben werden (`sudo mkdir -p /opt/katalon && sudo chown $USER:$USER /opt/katalon`), da `katalon install` ohne root-Rechte ausgeführt wird.

Weitere Befehle des CLI-Tools:
- `katalon doctor`: Prüft Docker-Daemon, verfügbaren Speicherplatz und Portbelegungen.
- `katalon update`: Führt ein Release-Update mit automatischem Datenbank-Backup durch.
- `katalon rollback`: Stellt den Zustand vor dem letzten Update wieder her.
- `katalon logs [service]`: Zeigt Container-Logs an.

## Erster Login

Beim ersten Start erzeugt Katalon automatisch einen Superuser-Account. Die Zugangsdaten liegen danach in:

```bash
./first-run-credentials.txt
```

Wenn der Stack ohne `install.sh` gestartet wurde:

```bash
docker compose exec api cat /var/lib/katalon/first-run-credentials.txt
docker compose logs api | grep -A5 "KATALON FIRST RUN"
```

## Lokale URLs

| Dienst | URL |
| --- | --- |
| Admin | `http://localhost:3000` |
| Portal | `http://localhost:3001` |
| API | `http://localhost:8000` |
| OpenAPI / Docs | `http://localhost:8000/api/docs` |

Im Dev-Compose-Stack (`docker compose -f docker-compose.dev.yml up`) liegen Admin und Portal auf `http://localhost:4000` und `http://localhost:4001`.

## Produktion

Für produktive Installationen mit TLS-Zertifikaten, eigenem Nginx-Reverse-Proxy und Backup-Strategien siehe [Produktionsbetrieb](/katalon-docs/administration/production/).
