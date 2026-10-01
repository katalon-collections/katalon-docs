---
title: Installation
description: Start Katalon locally or on a server with Docker Compose.
---

Katalon is Docker-first. For a normal start you need Docker and Docker Compose v2.

## Quick Start with `katalon-cli`

The normal way is the [`katalon-cli`](https://github.com/katalon-collections/katalon-cli) CLI tool. It uses pinned release images and automates configuration management:

```bash
# Install the CLI
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install katalon-cli

# Interactive setup wizard (asks for directory, version, domain, ports, and TLS)
katalon install
```

At the end the wizard asks whether to start the stack right away. To start and check later:

```bash
katalon start
katalon status
```

### Installation directory

The default path depends on the operating system: `/opt/katalon` on Linux, `~/katalon` on macOS. `katalon install` without `--dir` asks for the target directory interactively, offering this default.

On Linux, `/opt` belongs to root, but `katalon install` runs without root privileges. The directory must therefore exist beforehand and belong to your own user:

```bash
sudo mkdir -p /opt/katalon && sudo chown $USER:$USER /opt/katalon
```

If the instance is not in the default path, pass `--dir` with **every** command, not only `install`. The CLI does not remember the path and otherwise looks in the default location:

```bash
katalon install --dir ~/katalon
katalon start --dir ~/katalon
katalon status --dir ~/katalon
```

### Additional commands

- `katalon doctor`: Checks the Docker daemon, available disk space, and port usage.
- `katalon update`: Performs a release update with an automatic database backup.
- `katalon rollback`: Restores the state prior to the last update.
- `katalon backup`: Creates a manual backup.
- `katalon logs [service]`: Shows container logs.

## Alternative: manual setup with Docker Compose

For development, or if you want to use the repository directly:

```bash
git clone https://github.com/katalon-collections/katalon.git
cd Katalon
./install.sh --up
```

The installer creates the `.env` file, starts the containers, and displays the initial admin credentials.

## First Login

On first start, Katalon automatically creates a superuser account. The credentials are then located in:

```bash
./first-run-credentials.txt
```

When installed via `katalon-cli`, `katalon start` displays the admin login once in the terminal. The password is not stored in `.env`: save it now and change it at first login. If lost, run `docker compose exec api katalon-manage reset-admin` in the instance directory (see Production Operation). To choose your own initial password, set `INITIAL_ADMIN_PASSWORD` in `.env` before the stack starts for the first time.

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
