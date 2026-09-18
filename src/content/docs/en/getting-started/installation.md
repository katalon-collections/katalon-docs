---
title: Installation
description: Start Katalon locally or on a server with Docker Compose.
---

Katalon is Docker-first. For a normal start you need Docker and Docker Compose v2.

## Quick Start with Docker Compose

```bash
git clone https://github.com/katalon-collections/katalon.git
cd Katalon
./install.sh --up
```

The installer creates the `.env` file, starts the containers, and displays the initial admin credentials.

## Alternative: Installation via `katalon-cli`

For production and server instances, the [`katalon-cli`](https://github.com/katalon-collections/katalon-cli) CLI tool is available, which uses pinned release images and automates configuration management:

```bash
# Install the CLI
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install katalon-cli

# Interactive setup wizard (asks for version, domain, ports, and TLS)
katalon install --dir ~/katalon

# Start, stop, and check the status of an instance
katalon start --dir ~/katalon
katalon status --dir ~/katalon
```

By default, `katalon-cli` uses the `/opt/katalon` directory. If `/opt/katalon` is to be used, the directory must be created beforehand and handed over to your own user (`sudo mkdir -p /opt/katalon && sudo chown $USER:$USER /opt/katalon`), since `katalon install` runs without root privileges.

Additional CLI commands:
- `katalon doctor`: Checks the Docker daemon, available disk space, and port usage.
- `katalon update`: Performs a release update with an automatic database backup.
- `katalon rollback`: Restores the state prior to the last update.
- `katalon logs [service]`: Shows container logs.

## First Login

On first start, Katalon automatically creates a superuser account. The credentials are then located in:

```bash
./first-run-credentials.txt
```

If the stack was started without `install.sh`:

```bash
docker compose exec api cat /var/lib/katalon/first-run-credentials.txt
docker compose logs api | grep -A5 "KATALON FIRST RUN"
```

## Local URLs

| Service | URL |
| --- | --- |
| Admin | `http://localhost:3000` |
| Portal | `http://localhost:3001` |
| API | `http://localhost:8000` |
| OpenAPI / Docs | `http://localhost:8000/api/docs` |

In the dev Compose stack (`docker compose -f docker-compose.dev.yml up`), admin and portal are located at `http://localhost:4000` and `http://localhost:4001`.

## Production

For production installations with TLS certificates, a custom Nginx reverse proxy, and backup strategies, see [Production Operation](/katalon-docs/en/administration/production/).
