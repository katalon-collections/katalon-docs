---
title: Production Operation
description: Run Katalon in production on a Linux server with Docker Compose and Nginx.
---

This document describes how to run Katalon in production on a Linux server.

**Recommended path for new instances:** [`katalon-cli`](https://github.com/katalon-collections/katalon-cli) (`uv tool install katalon-cli`) installs and updates production instances using pinned release images, without a repository checkout — see the [katalon-cli repository](https://github.com/katalon-collections/katalon-cli). The manual path below (clone the repository, maintain the compose files yourself) remains relevant for special cases and for understanding the underlying compose topology, but is no longer recommended as the primary installation path.

## The `katalon-manage` administration tool

:::note[Available from version 1.35.0]
:::

`katalon-manage` is available inside the API container for maintenance tasks:

```bash
docker compose exec api katalon-manage --help
```

### Reset collection data

`katalon-manage db-reset` deletes collection data and creates a PostgreSQL backup by
default. Without `--all`, it retains configuration, user accounts, schemas,
vocabularies, and role and feature permissions. `--all` also deletes that configuration
and is only suitable when intentionally resetting an entire instance.

Options: `--backup-dir PATH` selects the backup directory, `--no-backup` skips the
backup, and `--yes` skips the interactive confirmation.

### Import CSV

`katalon-manage import-csv FILE --type TYPE --mapping MAPPING.json` imports objects,
entities, places, or occurrences through a JSON mapping. `--dry-run` validates and
prints a preview without changing data. `--subtype`, `--idno-strategy` (`auto`, `column`,
`skip`), `--upsert-strategy` (`skip`, `merge`, `replace`), and `--auto-publish` control
the import; `--media-selector` maps filenames during object imports.

### Import XML

`katalon-manage import-xml FILE --type TYPE --mapping MAPPING.json --record-xpath XPATH`
imports the same record types from XML. `--record-xpath` selects the individual records;
use Clark notation for XML namespaces. Its options match the CSV importer, while
`--media-selector` expects an XPath.

### Reset an administrator password

`katalon-manage reset-admin` interactively generates a new random password for an admin
or superuser account. When more than one exists, it prompts for the target account. It
prints the password and also writes it with `0600` file permissions to
`/var/lib/katalon/reset-credentials.txt`. Treat it as a secret and change it after login.

## Prerequisites

- Linux server (Debian/Ubuntu recommended), min. 4 GB RAM, 20 GB disk
- Docker ≥ 24 and Docker Compose v2 installed
- Public IP address, DNS records set for your domains
- TLS certificates (Let's Encrypt recommended)

## Checklist before the first production start

- [ ] Domain name(s) decided and DNS records set
- [ ] URL layout chosen (subdomain or subpath, → section 4)
- [ ] TLS certificates issued
- [ ] `.env` fully filled in — especially `SECRET_KEY`, database password, `KATALON_BASE_URL`, `CORS_ORIGINS`
- [ ] `MEDIA_ROOT` host directory exists and is owned by UID/GID `1000` (`install -d -o 1000 -g 1000 -m 755 /srv/katalon/media`, **not** `mkdir -p`) — the `api` and `worker` containers run as the non-root user `app` (UID 1000). If this is missing, uploads silently fail with `Permission denied`, without triggering a health-check alarm — see "Media upload fails" below.
- [ ] `docker/nginx.prod.conf` adapted to your own domain(s) (already includes `/robots.txt`/`/llms.txt` routing for the portal, as well as a static `Disallow: /` for the admin subdomain)
- [ ] Rate limits for public endpoints reviewed (`RATE_LIMIT_*`, defaults usually sufficient) — see [Access protection for public endpoints](#access-protection-for-public-endpoints) below
- [ ] `.env` VITE build arguments for admin/portal set
- [ ] Wikidata adapter: set `WIKIDATA_USER_AGENT`, or fully configure `KATALON_BASE_URL` + `OAI_ADMIN_EMAIL` (Wikidata's policy requires an identifiable user agent)
- [ ] Backup strategy set up (cron for DB dump, media volume backed up)
- [ ] Automatic certificate renewal (certbot cron) set up
- [ ] For transactional emails: SMTP relay, sender domain, and SPF/DKIM/DMARC set up
- [ ] After first start: ran `alembic upgrade head`
- [ ] After first start: changed the first-run `superuser` password

## 1. Clone the repository

```bash
git clone https://github.com/katalon-collections/katalon.git
cd Katalon
```

## 2. Configure environment variables

```bash
cp .env.example .env
nano .env
```

Adjust at least these values:

| Variable | Description |
|---|---|
| `POSTGRES_PASSWORD` | Strong database password |
| `DATABASE_URL` | Must contain the same password |
| `SECRET_KEY` | JWT key — generate with `openssl rand -hex 32` |
| `KATALON_BASE_URL` | Public base URL of the instance (e.g. `https://katalon.example.org`) |
| `FIRST_RUN_CREDENTIALS_PATH` | Path inside the API container for the one-time generated credentials file (place on a persistent volume if needed) |
| `DEFAULT_ADMIN_EMAIL` | Fallback email for local development without `KATALON_BASE_URL` |
| `DEFAULT_ADMIN_PASSWORD` | Fallback password for local development without `KATALON_BASE_URL` |
| `CORS_ORIGINS` | Comma-separated list of allowed frontends |
| `OAI_ADMIN_EMAIL` | Appears in the OAI-PMH Identify response |
| `WIKIDATA_USER_AGENT` | Optional user agent for Wikidata. Empty = built automatically from `KATALON_BASE_URL` + `OAI_ADMIN_EMAIL`. |
| `SMTP_*` | Optional external SMTP relay for transactional emails. Set the password only as an operator secret. |
| `RATE_LIMIT_*` | Rate limits for public endpoints (portal search, OAI-PMH, JSON-LD/Turtle export, authority proxy, global default) — see [Access protection for public endpoints](#access-protection-for-public-endpoints) below. |
| `ROBOTS_DISALLOW_PATHS` / `LLMS_TXT_*` | Controls `/robots.txt` and `/llms.txt` — see below. |

### Setting up ARKs

ARKs are minted locally in Katalon, but only become globally resolvable via your own NAAN registered with the ARK Alliance. Before activation:

1. Set a permanent public domain name and `KATALON_BASE_URL`.
2. Apply for a NAAN via the [ARK Alliance's NAAN request form](https://arks.org/about/getting-started-implementing-arks/).
3. Register the local resolver `https://katalog.example.org/ark:/<NAAN>/` in the NAAN registry. N2T then forwards full ARKs to the instance.

Then set in `.env`:

```bash
ARK_ENABLED=true
ARK_NAAN=12345
ARK_RESOLVER_URL=https://n2t.net/
ARK_SUFFIX_LENGTH=10
```

Katalon answers `https://katalog.example.org/ark:/12345/<suffix>` with a redirect to the current public portal detail page. `ARK_ENABLED` only turns off new minting; resolution of already-minted ARKs remains active. The test NAAN `99999` is not suitable for production data and is not resolved.

### SMTP for transactional emails

Katalon does not run its own mail server. An external SMTP relay is used for password reset and future notifications. Sending remains disabled with `SMTP_ENABLED=false` until the relay and sender are fully configured.

```bash
SMTP_ENABLED=true
SMTP_HOST=smtp.example.org
SMTP_PORT=587
SMTP_USERNAME=noreply@example.org
SMTP_PASSWORD=OPERATOR_SECRET
SMTP_FROM=Katalon <noreply@example.org>
SMTP_STARTTLS=true
SMTP_SSL_TLS=false
KATALON_BASE_URL=https://katalon.example.org
```

Port 587 typically uses STARTTLS. For implicit TLS (usually port 465), set `SMTP_STARTTLS=false` and `SMTP_SSL_TLS=true`. When SMTP is enabled, exactly one TLS mode must be active and `KATALON_BASE_URL` must be set so secure reset links can be generated. The sender domain needs SPF, DKIM, and DMARC; the server must also be able to reach the SMTP host. `SMTP_PASSWORD` belongs exclusively in the unversioned production environment or secret management.

### Instance-specific Docker Compose adjustments

If you need custom ports, volume paths, or additional environment variables, **do not** modify the central `docker-compose.yml` for this.

Instead:

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

`docker-compose.override.yml` is automatically picked up by Docker Compose and remains untouched across updates.

## 3. Set up TLS certificates

### Option A: Let's Encrypt with certbot (recommended)

```bash
# install certbot (Debian/Ubuntu)
apt install certbot

# issue certificate (DNS must point to the server)
certbot certonly --standalone -d example.org -d admin.example.org

# copy certificates to the Docker path
mkdir -p docker/certs
cp /etc/letsencrypt/live/example.org/fullchain.pem docker/certs/
cp /etc/letsencrypt/live/example.org/privkey.pem   docker/certs/
chmod 644 docker/certs/*.pem
```

Automatic renewal (crontab):
```
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/example.org/fullchain.pem /path/to/katalon/docker/certs/ && cp /etc/letsencrypt/live/example.org/privkey.pem /path/to/katalon/docker/certs/ && docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Option B: Your own certificate

Place `fullchain.pem` and `privkey.pem` in `docker/certs/`.

### Option C: TLS is terminated externally (e.g. Traefik, nginx-proxy)

If a reverse proxy that terminates TLS already runs in front of the stack (Traefik label setup, external nginx, …), the `nginx` service itself no longer needs TLS — it is then only addressed internally on port 80 via the Docker network, and port 443 is usually not published at all anymore.

Both `docker/nginx.conf` and `docker/nginx.prod.conf` contain a `listen 443 ssl` block that requires loadable certificates under `docker/certs/` at startup — even if port 443 is never externally reachable (otherwise: `cannot load certificate ... BIO_new_file() failed`). Generating a self-signed certificate just to boot in production is not a good fix (`make certs` is explicitly meant for local development, not prod containers).

Cleaner: include your own, lean nginx config **without** the 443 block (identical to `docker/nginx.conf`, just with `listen 443 ssl` and the two `ssl_certificate*` lines removed) and mount it in the relevant compose overlay instead of `docker/nginx.conf`. This reverse-proxy-specific config is part of the instance configuration, not the repo — it belongs locally to the instance (like a dedicated `docker-compose.traefik.yml` overlay).

## 4. Choose the URL layout and adjust nginx

There are two supported layouts. Decide once, then apply it consistently.

---

### Option A — Subdomain (default, recommended)

```
https://myurl.com           → Public portal
https://admin.myurl.com     → Admin UI
```

`docker/nginx.prod.conf` is prepared for this layout. Replace the domains:

```bash
sed -i 's/example\.org/myurl.com/g; s/admin\.example\.org/admin.myurl.com/g' docker/nginx.prod.conf
```

Issue TLS certificates for both domains:

```bash
certbot certonly --standalone -d myurl.com -d admin.myurl.com
```

Set frontend build arguments in `.env` (passed to the build stages via `docker-compose.prod.yml`):

```bash
ADMIN_VITE_API_URL=https://admin.myurl.com
PORTAL_URL=https://myurl.com
PORTAL_VITE_API_URL=https://myurl.com
```

---

### Option B — Subpath (one domain, two paths)

```
https://myurl.com              → Public portal
https://myurl.com/cataloging   → Admin UI
```

Vite must embed the asset paths at build time. Add this to `frontend/admin/vite.config.ts`:

```ts
export default defineConfig({
  base: '/cataloging/',   // ← new
  // … rest unchanged
})
```

`docker/nginx.prod.conf` — replace the separate `server` block for `admin.example.org` with a `location` block inside the portal server:

```nginx
# add inside the portal server block (after the /v1/ block):
location /cataloging/ {
    proxy_pass http://admin/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Remove the `server` block for `admin.example.org` and its associated HTTP redirect entry entirely.

Only one certificate needed:

```bash
certbot certonly --standalone -d myurl.com
```

Frontend build arguments in `.env`:

```bash
ADMIN_VITE_API_URL=https://myurl.com
PORTAL_URL=https://myurl.com
PORTAL_VITE_API_URL=https://myurl.com
```

---

### TLS volume in docker-compose.prod.yml (both options)

```yaml
nginx:
  volumes:
    - ./docker/nginx.prod.conf:/etc/nginx/conf.d/default.conf:ro
    - ./docker/certs:/etc/nginx/certs:ro
  ports:
    - "80:80"
    - "443:443"
```

`docker/nginx.prod.conf` expects `fullchain.pem` and `privkey.pem` directly under `/etc/nginx/certs/` (i.e. `docker/certs/fullchain.pem` and `docker/certs/privkey.pem`).

## 6. Build and start the images

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Watch the logs:
```bash
docker compose logs -f api worker
```

## 7. Run database migrations

On the first start, the API container does not automatically run migrations — this must be triggered manually:

```bash
docker compose exec api alembic upgrade head
```

Run this after every update as well.

## 8. Initialize the Elasticsearch index

After the first start, build the index and mappings:

```bash
# The index is created automatically on the first API start via ensure_index()
# Index all existing records:
curl -X POST https://your-domain.com/v1/search/reindex
```

After the procedures update (`0.2.x`), the object index must be rebuilt at minimum for existing data, because `collection_status` was added to the public search filters:

```bash
curl -X POST https://your-domain.com/v1/search/reindex/object
```

## 9. First login

On the first API start without an existing admin/superuser, Katalon automatically generates:

- Email: `admin@<domain-from-KATALON_BASE_URL>`
- Password: cryptographically random (one-time)

The credentials are printed in the API log within the `====== KATALON FIRST RUN ======` block and are also stored in `./first-run-credentials.txt` (via `install.sh` using `docker cp`).

1. Browser: `https://admin.your-domain.com`
2. Log in with the first-run credentials
3. Change the password immediately (Admin → Users → own account)

## Access protection for public endpoints

:::note[Available from version 1.19.7]
:::

Portal search, OAI-PMH, and the [JSON-LD/Turtle export endpoints](/katalon-docs/en/integration/linked-data-export/) are deliberately reachable without an API key — every record with status `public` is freely retrievable through them (see [REST API: Authentication](/katalon-docs/en/integration/rest-api/#authentication)). Protection against mass access/scraping therefore relies on rate limiting and crawler conventions, not access restriction.

### Rate limits

All configurable via `.env` (slowapi syntax `"N/unit"`, e.g. `30/minute`, `500/hour`):

| Variable | Default | Applies to |
|---|---|---|
| `RATE_LIMIT_DEFAULT` | `200/minute` | Global fallback for all endpoints without their own limit |
| `RATE_LIMIT_PUBLIC_EXPORT` | `30/minute` | JSON-LD/Turtle export per record (`/{type}/{id}/export`) — the most likely target endpoint for bulk scraping |
| `RATE_LIMIT_PUBLIC_SEARCH` | `100/minute` | Portal search (`/portal/v1/search`, `/portal/v1/search/advanced`) |
| `RATE_LIMIT_OAI` | `100/minute` | OAI-PMH (`/oai`) |
| `RATE_LIMIT_AUTHORITY_PROXY` | `60/minute` | Authority-data proxy (GND/GeoNames, requires a logged-in user anyway) |
| `RATE_LIMIT_SPARQL` | `60/minute` | SPARQL endpoint (`/sparql`, queries against the triple store) |

Login and password reset have their own, hard-coded brute-force limits and are not controllable via `.env` — a different threat model than crawler/scraper traffic.

### robots.txt & llms.txt

Katalon serves `/robots.txt` and `/llms.txt` on the portal domain — both are pure conventions for well-behaved bots/agents, not technical access protection:

```bash
curl https://your-domain.com/robots.txt
curl https://your-domain.com/llms.txt
```

- `ROBOTS_DISALLOW_PATHS` — paths that `/robots.txt` blocks for all bots (default `["/v1/"]`; portal HTML pages remain crawlable).
- `LLMS_TXT_ENABLED` / `LLMS_TXT_EXTRA_NOTES` — `/llms.txt` explicitly points LLM agents to the JSON-LD/Turtle export endpoints and OAI-PMH as a structured data source, instead of scraping HTML. Can be toggled, with optional free-text addition.

`docker/nginx.prod.conf` routes both paths to the API on the portal domain; the admin subdomain instead gets a static `Disallow: /`, so the admin UI is never indexed. For a custom nginx config, replicate these routes accordingly.

---

## Optional RDF projection & SPARQL interface (Oxigraph)

:::note[Available from version 1.19.20]
:::

Katalon includes an optional triple store (**Oxigraph**) for semantic graph queries via SPARQL 1.1. To keep standard operation resource-light, the Oxigraph service is designed as the Docker Compose profile `rdf` and is inactive by default (zero clutter).

### 1. Enable in `.env`

Add the following variables to your `.env` file:

```bash
# enable Docker Compose profile
COMPOSE_PROFILES=rdf

# Oxigraph triple store integration
OXIGRAPH_ENABLED=true
OXIGRAPH_URL=http://oxigraph:7878

# SPARQL 1.1 protocol endpoint
SPARQL_ENDPOINT_ENABLED=true
SPARQL_REQUIRE_AUTH=true          # set 'false' for open, anonymous read access
SPARQL_QUERY_TIMEOUT=30.0         # maximum duration of a SPARQL query in seconds
SPARQL_MAX_QUERY_LENGTH=65536     # maximum query size in bytes (64 KB)
RATE_LIMIT_SPARQL=60/minute       # rate limit for SPARQL requests
```

### 2. Start the containers

Start the stack with the `rdf` profile:

```bash
docker compose --profile rdf up -d
```

Docker now also starts the `oxigraph` container with the persistent volume `oxigraph_data`.

### 3. Build named graphs initially (rebuild)

After the first start, the triple store is still empty. Data is not synchronized automatically at boot, but via a Celery task:

1. **Via the admin interface:**
   - Go to **Settings** (gear icon).
   - In the **Linked Data & SPARQL** section you see the status and the triple counter.
   - Click **"Rebuild RDF index"**.
2. **Or via API / curl:**
   ```bash
   curl -X POST "https://admin.your-domain.com/sparql/rebuild" \
     -H "Authorization: Bearer <your-admin-token>"
   ```

The worker processes all published records in the background and generates the corresponding named graphs (`urn:katalon:graph:<type>:<uuid>`).

### Ongoing synchronization

As soon as `OXIGRAPH_ENABLED=true` is active, Katalon automatically synchronizes the corresponding named graph in Oxigraph on every publish, update, or deletion of a record. Non-public drafts remain isolated in PostgreSQL.

### Backup & restore

Since Oxigraph is a purely derived projection from PostgreSQL, the entire triple store can be losslessly reconstructed from the database at any time via *"Rebuild RDF index"* in a disaster scenario. A separate backup of the `oxigraph_data` volume is therefore not strictly required in normal operation.

## Optional S3-compatible media storage backend

:::note[Available from version 1.29.0]
:::

By default, media files reside under `MEDIA_ROOT` on the local filesystem (unchanged behavior, no action needed). Alternatively, media files can be stored in an S3-compatible object store — Ceph RADOSGW, MinIO, Hetzner Object Storage, Garage, or AWS S3. Strictly opt-in via `STORAGE_BACKEND=s3`; logos and portal themes always remain local under `MEDIA_ROOT` regardless of the chosen backend — only the actual object media files move to S3.

### 1. Prepare the bucket

The bucket must exist before activation; Katalon does not create it itself. The configured credentials need Put, Get, and Delete permissions on the bucket.

### 2. Configure in `.env`

```bash
STORAGE_BACKEND=s3
S3_ENDPOINT_URL=https://s3.example-provider.com
S3_BUCKET=katalon-media
S3_REGION=us-east-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_FORCE_PATH_STYLE=true
S3_VERIFY_TLS=true
#S3_CA_BUNDLE=/path/to/ca-bundle.pem   # only needed for a private CA
```

| Variable | Default | Meaning |
|---|---|---|
| `STORAGE_BACKEND` | `local` | `s3` enables the object storage backend |
| `S3_ENDPOINT_URL` | empty | Empty = AWS default endpoint. Set the respective endpoint URL for Ceph RADOSGW/MinIO/Hetzner/Garage |
| `S3_BUCKET` | empty | Required when `STORAGE_BACKEND=s3` |
| `S3_REGION` | `us-east-1` | RADOSGW/MinIO ignore the region content-wise, but SigV4 still needs a value |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | empty | Required when `STORAGE_BACKEND=s3` |
| `S3_FORCE_PATH_STYLE` | `true` | Path-style addressing (`endpoint/bucket/key`) works everywhere without a DNS wildcard setup |
| `S3_VERIFY_TLS` | `true` | `false` only for test environments with a self-signed certificate |
| `S3_CA_BUNDLE` | empty | Path to a CA bundle, if the endpoint uses a certificate from a private CA |

If `S3_BUCKET`, `S3_ACCESS_KEY`, or `S3_SECRET_KEY` are missing while `STORAGE_BACKEND=s3`, the API refuses to start with a corresponding error message.

### 3. Enable the compose overlay

`docker-compose.s3.yml` passes the `S3_*` variables through to `api`, `worker`, **and** `cantaloupe`, and switches Cantaloupe to `S3Source`. Append it as the last overlay after the others:

```bash
docker compose -f docker-compose.yml -f docker-compose.cantaloupe.yml \
  -f docker-compose.prod.yml -f docker-compose.s3.yml up -d
```

**Important — Cantaloupe needs DNS for the bucket:** Cantaloupe's `S3Source` (version 5.0.x) does not support path-style addressing, but speaks exclusively virtual-hosted (`<bucket>.<endpoint-host>`). So `<bucket>.<endpoint-host>` must be resolvable — either via wildcard DNS on the object storage endpoint, or via an explicit DNS entry for exactly this bucket name. The backend itself (boto3, for upload/download via the API), on the other hand, speaks path-style by default (`S3_FORCE_PATH_STYLE=true`) and does not need this DNS setup.

### Testing without a cloud account (MinIO)

`docker-compose.minio.yml` is available for the dev stack — it starts a local MinIO container including a console (`http://localhost:9001`, `minioadmin`/`minioadmin`) and automatically wires up `api`, `worker`, and `cantaloupe` against it:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml \
  -f docker-compose.cantaloupe.yml -f docker-compose.minio.yml up -d
```

The bucket must also be created once here (MinIO console or S3 API).

### Limitations

- **No live migration:** Switching between `local` and `s3` does not automatically move existing media files. A backend switch only makes sense for new instances or before the first production start; already-stored files would need to be manually transferred to the new bucket or back to `MEDIA_ROOT`, including updating the `storage_key` values in the database.
- **No presigned URLs:** Delivered media files (`/objects/{id}/media/{media_id}/file`) always stream through the API with S3, never via redirect to a presigned URL. This keeps the visibility check (public/private) effective — private media cannot be routed around the API via a directly callable S3 URL. The local backend path, by contrast, continues to use the efficient `FileResponse` sendfile delivery.

## Applying updates

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker compose exec api alembic upgrade head
# If schema changes occurred: trigger a reindex
curl -X POST https://your-domain.com/v1/search/reindex
```

For updates that only change object search fields, this is enough:

```bash
curl -X POST https://your-domain.com/v1/search/reindex/object
```

## Server migration

For moving to a new host, see [Migrating Katalon to a new server](/katalon-docs/en/administration/serverumzug/). The guide backs up the database, media, instance configuration, and TLS files; Elasticsearch is reindexed on the target system.

## Backups

### Automatic (backup service)

The compose stack includes a `backup` service (`docker/backup.sh`) that runs **daily** and backs up both:

- Database: `pg_dump` → `db_<timestamp>.sql.gz`
- Media files (`MEDIA_ROOT`): `media_<timestamp>.tar.gz`

Dumps land in the host directory `BACKUP_ROOT` (default `/srv/katalon/backups`) and are automatically deleted after `BACKUP_RETENTION_DAYS` (default 14).

Configuration via `.env`:

| Variable | Default | Meaning |
|----------|---------|-----------|
| `BACKUP_ENABLED` | `true` | `false` = the service runs but doesn't make backups |
| `BACKUP_ROOT` | `/srv/katalon/backups` | Host target directory |
| `BACKUP_RETENTION_DAYS` | `14` | older dumps are deleted |
| `BACKUP_AT` | `03:00` | fixed time `HH:MM` (container timezone, see below) |
| `BACKUP_INTERVAL_SECONDS` | `86400` | only effective when `BACKUP_AT` is **empty** |

Two scheduling modes: if `BACKUP_AT` is set, the backup runs daily at the fixed time. If it is empty, interval mode applies (`BACKUP_INTERVAL_SECONDS`, backup immediately at start + then every N seconds).

**Timezone:** `BACKUP_AT` is interpreted in the container timezone (default UTC). For local time, set `TZ=Europe/Berlin` in the `environment` of the `backup` service.

```bash
# trigger a one-off backup immediately (e.g. before a deploy)
docker compose run --rm backup once

# view existing backups
ls -lh /srv/katalon/backups
```

**Off-site recommended:** additionally mirror `BACKUP_ROOT` via `rsync`/S3 to a second location — a backup on the same host doesn't protect against host loss.

### Restore

Database:

```bash
gunzip -c /srv/katalon/backups/db_20260101_030000.sql.gz \
  | docker compose exec -T db psql -U katalon katalon
```

Media files (`.` = contents of `MEDIA_ROOT`):

```bash
tar xzf /srv/katalon/backups/media_20260101_030000.tar.gz -C "$MEDIA_ROOT"
```

After the DB restore, rebuild Elasticsearch:

```bash
curl -X POST https://your-domain.com/v1/search/reindex/object   # per type
```

### Restore drill (last performed 2026-07-13)

A restore is only worth as much as its last test. Verified procedure on a fresh environment:

1. Fresh directory + `.env` with a **different** `POSTGRES_DB` (e.g. `katalon_restore`).
2. Start only the DB: `docker compose up -d db`.
3. Import the latest `db_*.sql.gz` using the `psql` command above.
4. Check row count against the source:
   `docker compose exec -T db psql -U katalon -d katalon_restore -c "SELECT count(*) FROM objects;"`
5. Extract the media tar into a test directory, compare file counts.
6. Start fully, `curl .../health` → `ok`, spot-check in the admin UI.

Result: the dump can be imported cleanly (PostGIS extension included), the media tar extracts completely. Repeat the drill at least twice a year.

### Elasticsearch

Elasticsearch data can be reindexed from the database at any time (`POST /v1/search/reindex`). A dedicated ES backup is not strictly necessary for normal operation.

## Monitoring

### Health check

```bash
curl https://your-domain.com/health
# → {"status": "ok", "checks": {"database": "ok", "elasticsearch": "ok"}}
```

The endpoint actively checks the database and Elasticsearch. If a dependency is unreachable, it returns HTTP `503` with `{"status": "degraded", ...}` — so a load balancer can detect a failed backend state.

### Logs

```bash
docker compose logs api        # API logs
docker compose logs worker     # Celery worker logs
docker compose logs nginx      # access log
```

### Testing the OAI-PMH endpoint

```bash
# Identify
curl "https://your-domain.com/oai?verb=Identify"

# All sets
curl "https://your-domain.com/oai?verb=ListSets"

# All records (paginated)
curl "https://your-domain.com/oai?verb=ListRecords&metadataPrefix=oai_dc"
```

## Resource recommendations

| Service | Minimum | Recommended |
|---|---|---|
| db (PostgreSQL) | 256 MB | 512 MB |
| redis | 64 MB | 128 MB |
| elasticsearch | 1 GB | 2 GB |
| api | 256 MB | 512 MB |
| worker (Celery) | 256 MB | 512 MB |
| cantaloupe | 256 MB | 512 MB |
| nginx | 32 MB | 64 MB |
| **Total** | **~2.1 GB** | **~4 GB** |

## Common problems

### nginx doesn't start: "cannot load certificate ... BIO_new_file() failed"

`docker/certs/` contains no certificate files. This typically affects deployments behind an external reverse proxy (Traefik, …) that still include `docker/nginx.conf`, even though the 443 block is never needed there — see [Option C](#option-c-tls-is-terminated-externally-eg-traefik-nginx-proxy) above. Don't generate a certificate for prod — mount a custom config without `listen 443 ssl` instead.

### API doesn't start (database connection fails)

```bash
docker compose logs db | tail -20
# wait for the health check: depends_on with condition: service_healthy is set
```

### Elasticsearch unreachable

Katalon starts even without ES (API endpoints work, search returns empty results). ES needs 30–60 seconds on first start.

### Media upload fails

Check whether the `media_data` volume is writable by the API container:

```bash
docker compose exec api ls -la /var/lib/katalon/media/
```

`api` and `worker` run as the non-root user `app` (UID 1000). If the host directory behind `MEDIA_ROOT` is not writable for UID 1000, uploads fail with `PermissionError`. In that case, a startup check logs a warning (`MEDIA_ROOT not writable for UID ...`) — look for this message in the `api` logs instead of only noticing it at the first failed upload.

Fix (only the directory itself, not recursive — for a large media collection, `chown -R` could be very slow):

```bash
sudo chown 1000:1000 "${MEDIA_ROOT:-/srv/katalon/media}"
```

New subdirectories (`_batch_imports`, `logos`, `themes`) automatically and correctly inherit the parent directory's permissions when newly created by the `app` user; already-existing subdirectories with the wrong owner must be handled individually (`chown 1000:1000 <directory>`, also not needed recursively as long as only new files are added).

### Large IIIF images stay empty, even though thumbnails work

Cantaloupe can serve `info.json` and small thumbnails even though the writable derivative cache was not set up correctly. Large image requests may then return HTTP 200 with empty content. The compose stack now uses a `tmpfs` for the disposable derivative cache; existing installations with the former named volume need to recreate the service once.

```bash
docker compose up -d --force-recreate cantaloupe
```

This does not delete any database or media volume.

### Multiple instances on one host: tmpfs size of the Cantaloupe cache

The Cantaloupe derivative cache runs as `tmpfs`, limited via `CANTALOUPE_CACHE_TMPFS_SIZE` (default `512m`, see `.env.example`). Without this limit, Docker would allow up to 50% of host RAM per mount. If more than one Katalon-like instance runs on the same host, deliberately choose `CANTALOUPE_CACHE_TMPFS_SIZE` per instance so that the sum across all instances, together with Elasticsearch's and Postgres's memory needs, does not exceed the available host RAM.

For an older stack still using the former named volume, the cache can alternatively be repaired:

```bash
docker compose logs cantaloupe --tail=100 | grep -E "AccessDeniedException|FilesystemCache"
docker compose exec cantaloupe ls -ld /var/lib/cantaloupe/cache
docker compose exec cantaloupe sh -c 'chown -R cantaloupe:cantaloupe /var/lib/cantaloupe/cache && chmod -R u+rwX /var/lib/cantaloupe/cache'
curl -s -o /tmp/iiif-check.jpg -w 'HTTP %{http_code}, bytes %{size_download}\n' \
  "https://your-domain.com/iiif/3/<media-id>.<extension>/full/max/0/default.jpg"
```

The data in the media volume is not deleted in the process. The test must return a positive byte count; afterwards, hard-reload the affected portal page.

### Images not up to date after an update

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
```
