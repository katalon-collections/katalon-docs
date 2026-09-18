---
title: Updates and Data Maintenance
description: How Katalon is updated and what to watch out for across version jumps.
---

This document explains how Katalon is updated, what happens to your data and customizations in the process, and what to watch out for with certain version jumps.

## The basic principle: Docker-first

Katalon runs entirely in Docker containers. What this means for updates is easiest to explain like this:

**Code and data are separate.**

- The **code** (backend, frontend, nginx) lives in Docker images. These images are published by Katalon and can be updated with a single command.
- The **data** (records, schemas, media files, configuration) lives in Docker volumes and in your `.env` file — completely outside the images. An image update does not touch them.

This means: a Katalon update never overwrites your data or your configuration. What you've configured in the admin interface — fields, vocabularies, records — is preserved.

What you have to manage manually: your `.env` file and, where applicable, `docker-compose.override.yml` for instance-specific customizations. More on that below.

## Standard update (no breaking changes)

This is the normal case for bugfix and minor releases (e.g. 1.0.1 → 1.0.2, 1.1.0 → 1.2.0).

```bash
# download the latest images
docker compose pull

# restart containers with the new images
docker compose up -d

# apply database migrations (if any)
docker compose exec api alembic upgrade head
```

Done. Your data is untouched. The migrations (`alembic upgrade head`) are always safe to apply — at most they add new columns or tables, never delete data.

**When is `alembic upgrade head` needed?** Whenever you know a release introduces new database fields. When in doubt: just run it, nothing bad happens if there's no pending migration.

## Breaking changes

Some updates require a manual step because `.env` variables or the structure of `docker-compose.yml` have changed. This happens with major releases (e.g. 1.x → 2.0).

Such changes are documented in `UPGRADING.md` (in the repository root) — with versioned sections that describe exactly what to do. **Before every major update: read `UPGRADING.md`.**

### A new `.env` variable was added

Example: a new version introduces the `MAIL_FROM` variable.

1. Check `.env.example` for new variables.
2. Add them to your `.env`.
3. Only then: `docker compose pull && docker compose up -d`.

Tip: a diff between your `.env` and the current `.env.example` immediately shows what's missing:
```bash
diff .env .env.example
```

### `docker-compose.yml` has changed

If you haven't customized `docker-compose.yml`, you can just adopt it (`git pull`).

If you've made your own changes (e.g. ports, volume paths), use `docker-compose.override.yml` for your customizations — this keeps the main `docker-compose.yml` clean and updatable without conflicts:

```yaml
# docker-compose.override.yml — your customizations, automatically merged
# by Docker Compose, never overwritten by updates
services:
  nginx:
    ports:
      - "8443:443"
```

Starting point: copy `docker-compose.override.yml.example` to `docker-compose.override.yml` and enter only instance-specific settings there.

## What survives an update

| What | Why it's safe |
|---|---|
| All records (Objects, Entities, Places, Occurrences, Collections, Storage Locations, Procedures) | PostgreSQL volume |
| Schemas and field definitions | PostgreSQL volume |
| Vocabularies | PostgreSQL volume |
| Configured authority sources | PostgreSQL volume |
| Media files | Media volume |
| Your `.env` | Lives outside the containers |
| `docker-compose.override.yml` | Lives outside the containers |

## What you should check after an update

- [ ] Open the admin interface and briefly navigate through the main areas
- [ ] Open and save a record (checks write access to the DB)
- [ ] Elasticsearch status: `docker compose exec api curl -s localhost:9200/_cluster/health`
- [ ] Check logs for errors: `docker compose logs --tail=50 api`

## Full reinstall (deleting data)

If you want to completely reset an instance — for example in a test environment — you'll find the instructions in the developer documentation. For production data: **never** without a backup, and read the developer documentation completely beforehand.

## Backup before an update

A database dump is recommended before every major update:

```bash
docker compose exec db pg_dump -U katalon katalon > backup_$(date +%Y%m%d).sql
```

Keep the dump outside the server. An automated backup strategy is described in [Production Operation](/katalon-docs/en/administration/production/).
