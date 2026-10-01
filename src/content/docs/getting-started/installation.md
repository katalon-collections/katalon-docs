---
title: Installation
description: Katalon lokal oder auf einem Server mit Docker Compose starten.
---

Katalon ist Docker-first. Für einen normalen Start brauchst du Docker und Docker Compose v2.

## Schnellstart mit `katalon-cli`

Der normale Weg ist das CLI-Tool [`katalon-cli`](https://github.com/katalon-collections/katalon-cli). Es nutzt gepinnte Release-Images und verwaltet die Konfiguration automatisiert:

```bash
# CLI installieren
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install katalon-cli

# Interaktiver Setup-Wizard (fragt Verzeichnis, Version, Domain, Ports und TLS ab)
katalon install
```

Am Ende fragt der Wizard, ob der Stack direkt starten soll. Später starten und prüfen:

```bash
katalon start
katalon status
```

### Installationsverzeichnis

Der Standardpfad hängt vom Betriebssystem ab: unter Linux `/opt/katalon`, unter macOS `~/katalon`. `katalon install` ohne `--dir` fragt das Zielverzeichnis mit diesem Standard interaktiv ab.

Unter Linux gehört `/opt` root, `katalon install` läuft aber ohne root-Rechte. Das Verzeichnis muss deshalb vorab existieren und dem eigenen Benutzer gehören:

```bash
sudo mkdir -p /opt/katalon && sudo chown $USER:$USER /opt/katalon
```

Liegt die Instanz nicht im Standardpfad, übergibst du `--dir` bei **jedem** Befehl, nicht nur bei `install`. Das CLI merkt sich den Pfad nicht und sucht sonst im Standardpfad:

```bash
katalon install --dir ~/katalon
katalon start --dir ~/katalon
katalon status --dir ~/katalon
```

### Weitere Befehle

- `katalon doctor`: Prüft Docker-Daemon, verfügbaren Speicherplatz und Portbelegungen.
- `katalon update`: Führt ein Release-Update mit automatischem Datenbank-Backup durch.
- `katalon rollback`: Stellt den Zustand vor dem letzten Update wieder her.
- `katalon backup`: Legt ein manuelles Backup an.
- `katalon logs [service]`: Zeigt Container-Logs an.

## Alternative: manuell mit Docker Compose

Für Entwicklung oder wenn du das Repository direkt nutzen willst:

```bash
git clone https://github.com/katalon-collections/katalon.git
cd Katalon
./install.sh --up
```

Der Installer legt die `.env` an, startet die Container und zeigt die ersten Admin-Zugangsdaten an.

## Erster Login

Beim ersten Start erzeugt Katalon automatisch einen Superuser-Account. Die Zugangsdaten liegen danach in:

```bash
./first-run-credentials.txt
```

Bei Installation über `katalon-cli` zeigt `katalon start` den Admin-Login einmalig im Terminal an. Das Passwort steht nicht in der `.env`: jetzt speichern und beim ersten Login ändern. Bei Verlust: `docker compose exec api katalon-manage reset-admin` im Instanzverzeichnis (siehe Produktionsbetrieb). Wer ein eigenes Startpasswort möchte, setzt `INITIAL_ADMIN_PASSWORD` in der `.env`, bevor der Stack zum ersten Mal startet.

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
