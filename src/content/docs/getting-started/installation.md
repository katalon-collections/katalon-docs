---
title: Installation
description: Katalon lokal oder auf einem Server mit Docker Compose starten.
---

# Installation

Katalon ist Docker-first. Für einen normalen Start brauchst du Docker und Docker Compose v2.

```bash
git clone https://github.com/karkraeg/Katalon.git
cd Katalon
./install.sh --up
```

Der Installer legt die `.env` an, startet die Container und zeigt die ersten Admin-Zugangsdaten an.

## Erster Login

Beim ersten Start erzeugt Katalon automatisch einen Admin-Account. Die Zugangsdaten liegen danach in:

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
| OpenAPI | `http://localhost:8000/api/docs` |

Im Dev-Compose-Stack liegen Admin und Portal auf `4000` und `4001`.

## Produktion

Für produktive Installationen siehe [Produktionsbetrieb](/administration/production/).
