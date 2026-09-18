---
title: Server Migration
description: Move Katalon to a new server – transfer database, media, and configuration.
---

This guide applies to a manually operated Docker Compose installation. For an installation via `katalon-cli`, the installer project manages the files and the update path.

A migration carries over PostgreSQL, media files, the instance configuration, and TLS files. Elasticsearch is not copied: the index is rebuilt from the restored database.

## Before the maintenance window

On the current server, note the exact Katalon version that will be used on the new server:

```bash
git describe --tags --exact-match
```

Install Docker and Docker Compose on the new server. Check out the repository at exactly this tag and prepare the production prerequisites from [Production Operation](/katalon-docs/en/administration/production/). Do not start any containers yet.

## Final backup and shutdown

Write access must stop before the final backup. The following procedure first stops the API and worker, then creates a matching database and media export, and shuts down the old stack without deleting volumes:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml stop api worker beat
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm backup once
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

`docker compose down -v` must not be used here. It would delete the database volumes.

Determine and verify the latest backup set:

```bash
BACKUP_ROOT="$(sed -n 's/^BACKUP_ROOT=//p' .env | tail -n 1)"
BACKUP_ROOT="${BACKUP_ROOT:-/srv/katalon/backups}"
BACKUP_DB="$(find "$BACKUP_ROOT" -maxdepth 1 -name 'db_*.sql.gz' -print | sort | tail -n 1)"
BACKUP_ID="${BACKUP_DB##*/db_}"
BACKUP_ID="${BACKUP_ID%.sql.gz}"
test -n "$BACKUP_ID" -a -f "$BACKUP_ROOT/media_${BACKUP_ID}.tar.gz"
printf '%s\n' "$BACKUP_ID"
```

The output is the identifier of the matching database and media export. Transfer both files together with the configuration to the new server. `NEW_HOST` is its SSH name, `TARGET_DIR` the prepared repository directory on the target system:

```bash
NEW_HOST=katalon-new.example.org
TARGET_DIR=/srv/katalon
ssh "$NEW_HOST" "mkdir -p '$TARGET_DIR/backups'"
rsync -a --protect-args .env docker/certs/ "$NEW_HOST:$TARGET_DIR/"
if [ -f docker-compose.override.yml ]; then
  rsync -a --protect-args docker-compose.override.yml "$NEW_HOST:$TARGET_DIR/"
fi
rsync -a --protect-args "$BACKUP_DB" "$BACKUP_ROOT/media_${BACKUP_ID}.tar.gz" \
  "$NEW_HOST:$TARGET_DIR/backups/"
```

## Restoring data on the new server

In the new checkout, first start only PostgreSQL. The import goes into a fresh database, not into an existing system:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d db
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec -T db sh -c 'until pg_isready -U "$POSTGRES_USER"; do sleep 1; done'
BACKUP_DB="$(find /srv/katalon/backups -maxdepth 1 -name 'db_*.sql.gz' -print | sort | tail -n 1)"
BACKUP_ID="${BACKUP_DB##*/db_}"
BACKUP_ID="${BACKUP_ID%.sql.gz}"
test -f "/srv/katalon/backups/media_${BACKUP_ID}.tar.gz"
gunzip -c "$BACKUP_DB" \
  | docker compose -f docker-compose.yml -f docker-compose.prod.yml exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

For the media export, the file name must have the same identifier as the database export. The variable set in the previous block is now used:

```bash
MEDIA_ROOT="$(sed -n 's/^MEDIA_ROOT=//p' .env | tail -n 1)"
MEDIA_ROOT="${MEDIA_ROOT:-/srv/katalon/media}"
sudo install -d -o 1000 -g 1000 -m 755 "$MEDIA_ROOT"
sudo tar --no-same-owner --owner=1000 --group=1000 \
  -xzf "/srv/katalon/backups/media_${BACKUP_ID}.tar.gz" -C "$MEDIA_ROOT"
```

## Starting and verifying

Start the entire production stack and run migrations:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec api alembic upgrade head
```

Before switching DNS, test the new IP against the real hostname. The TLS files must already match the hostname:

```bash
NEW_SERVER_IP=203.0.113.10
curl --resolve your-domain.com:443:"$NEW_SERVER_IP" -f https://your-domain.com/health
```

Log in as admin, open the "Search & Indexing" section in settings, and select "Reindex everything". The task runs in the worker. Afterwards, check the portal, admin, a record with an image, and search.

The old instance stays turned off, but its volumes remain intact. It may only be decommissioned after successful verification and the DNS switch.

## Rolling back

If verification fails before the DNS switch, stop the new stack with `docker compose -f docker-compose.yml -f docker-compose.prod.yml down` and run the same compose command with `up -d` on the old server. After a DNS switch, first revert the DNS record, then restart the old instance. Both instances must never accept write access at the same time.
