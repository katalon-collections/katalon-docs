---
title: Portal Themes and Extensions
description: Style the public portal with a file-based theme and provide institutional authority-data adapters.
---

:::note[Available from version 1.29.0]
File-based portal themes and the downstream image extension described here are available from this version onward.
:::

The public portal can be customized independently of the admin interface. A theme survives an update because it is mounted into the containers as its own directory. The admin interface itself cannot be themed.

For simple changes to title, logo, accent color, and a few color values, **Settings → Portal & Institution** is sufficient. These settings also apply with an installed theme and override the theme's corresponding color values.

## Creating a file-based theme

Create a theme directory in the installation directory:

```text
themes/
└── museum/
    ├── theme.json
    ├── custom.css
    ├── favicon.svg
    └── fonts/
        └── MeineSchrift.woff2
```

`theme.json` defines the name, color values, and static files. Tokens that are not set keep Katalon's default values.

```json
{
  "name": "Museum",
  "version": "1.0.0",
  "tokens": {
    "--accent": "#005a70",
    "--bg": "#f7f5f0",
    "--fg": "#17212b",
    "--header-bg": "#005a70",
    "--header-fg": "#ffffff"
  },
  "fonts": { "body": "/themes/museum/custom.css", "mono": null },
  "favicon": "museum/favicon.svg"
}
```

`custom.css` is loaded as a stylesheet. It can contain custom fonts via `@font-face` and CSS adjustments. All files must reside within the theme itself: the portal's security policy does not allow fonts, stylesheets, or scripts from external CDNs.

## Deploying the theme in the container

The directories must be available to both the API and the portal. Add or adopt this in your local `docker-compose.override.yml`:

```yaml
services:
  api:
    volumes:
      - ./themes:/var/lib/katalon/themes:ro
  portal:
    volumes:
      - ./themes:/usr/share/nginx/html/themes:ro
```

Set the directory name in `.env` and then restart the API and portal:

```bash
PORTAL_THEME=museum
docker compose up -d api portal
```

The API reads `PORTAL_THEME` only at startup. Afterwards, check whether the manifest is reachable and whether the portal loads the stylesheet:

```bash
curl http://localhost/v1/theme
```

## How far a theme reaches

With `theme.json` and `custom.css`, you can customize colors, fonts, favicon, and many layout details of the existing portal, such as spacing, cards, header and footer areas. This is the update-safe way to achieve an institutional look and feel.

An optional `custom.js` can perform supplementary, idempotent DOM adjustments. It must reside as a local file in the theme directory and be included via a dedicated portal nginx configuration. This only makes sense when CSS isn't enough; when switching themes, the `sub_filter` path in nginx and `PORTAL_THEME` must use the same name.

A fundamental restructuring, such as a new navigation structure, custom pages, or a sidebar instead of header navigation, is not a template override: the portal is a React application without server-side templates. Such changes are made in the portal source code and require a dedicated portal image. They are therefore deliberately a more maintenance-intensive, separate extension path.

## Custom authority-data adapters

Institutional authority data sources can be provided as a Python package in a downstream image. The package implements the Katalon adapter contract; the image is based on the respective Katalon API image and additionally installs the package. This keeps the adapter reproducible across updates and independent of a writable container.

After deployment, the source is registered in Katalon with a unique ID, a visible label, the full Python class path, and, if applicable, a configuration for the constructor. Credentials belong in the instance configuration or a secret store, not in the image or the adapter file.

The admin interface under **Settings → Authority Sources** can enable, disable, and test already-registered sources. A new Python class currently cannot be uploaded or registered there. You then select the enabled source when creating a field of type **Authority data** in the schema. The exact adapter interface is aimed at developers and is described in the technical customization documentation.

## Limitations and troubleshooting

- `GET /v1/theme` returns default values: `PORTAL_THEME` is missing, the API container was not restarted, or `theme.json` is not present in the API container under `/var/lib/katalon/themes/<name>/`.
- Colors appear, but the font or CSS doesn't: the portal mount is missing, or the path in `fonts.body` doesn't point to `/themes/<name>/custom.css`.
- An admin color takes precedence over the theme: this is intentional. Portal settings from the admin interface are applied last.
- The browser console reports a CSP violation: the file is not mounted locally under `/themes/`, or it uses an external resource.
