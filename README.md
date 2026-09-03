# Katalon Docs

Live: [https://katalon-collections.github.io/katalon-docs/](https://katalon-collections.github.io/katalon-docs/)

Starlight/Astro-Dokumentation für Katalon.

## Entwicklung

```bash
npm install
npm run dev
```

Lokale Vorschau:

```text
http://localhost:4321
```

## Build

```bash
npm run build
npm run preview
```

Der statische Build landet in `dist/`.

## Struktur

```text
src/content/docs/
├── getting-started/   # Installation und erste Schritte
├── administration/    # Betrieb und Admin-Aufgaben
├── integration/       # REST, OAI-PMH, Export
├── development/       # Architektur und Entwicklung
└── reference/         # Nachschlagewerk
```

## Deployment

Die Site ist statisch. Für den eigenen Server reicht:

```bash
npm run build
rsync -av --delete dist/ user@example.org:/var/www/katalon-docs/
```

Domain und konkretes Deployment-Ziel werden später in `astro.config.mjs` und in einem Deploy-Workflow eingetragen.
