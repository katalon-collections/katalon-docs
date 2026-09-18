## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Versionsangaben (Pflicht bei neuen Features)

Jede neu dokumentierte Funktion — neuer Abschnitt, neue Konfigurationsoption, neues Verhalten — bekommt an der Stelle, wo sie im Text beschrieben wird, eine Starlight-Hinweisbox mit der Katalon-Version, ab der sie verfügbar ist:

```mdx
:::note[Verfügbar ab Version 1.19.7]
Kurzbeschreibung oder Detailtext zur Funktion.
:::
```

Ohne Detailtext genügt eine leere Box (`:::note[Verfügbar ab Version X.Y.Z]\n:::`) direkt unter der Überschrift.

Die Versionsnummer kommt aus `backend/pyproject.toml` (`version = "..."`) im Haupt-Repo `katalon-collections/katalon` zum Zeitpunkt der Doku-Änderung — nicht aus dem privaten `karkraeg/Katalon`-Repo, da dessen Versionsstände (Patches zwischen Minor-Releases) für Self-Hoster nicht sichtbar/installierbar sind. Bei Unsicherheit über die zutreffende Version im öffentlichen Repo nachsehen, nicht schätzen.

Rückwirkendes Nachtragen bei bestehenden, noch nicht versionierten Abschnitten ist nicht nötig — die Regel gilt ab jetzt für neu hinzukommende oder inhaltlich geänderte Abschnitte.

## Screenshot-Pipeline (Dokumentation)

Für UI-Screenshots existiert eine automatisierte Playwright-Pipeline. Sie läuft vollständig headless und benötigt keinen interaktiven Browser.

### Tooling & Architektur

- **Hauptskript**: [`scripts/screenshots.mjs`](file:///Users/karl/Coding/Katalon%20Collections/katalon-docs/scripts/screenshots.mjs)
  - Chromium Headless im Standard-Viewport `1440x900` mit Retina-Auflösung (`deviceScaleFactor: 2`).
  - Sprache auf `de-DE` eingestellt, HTTPS-Zertifikatsfehler werden für lokale/Self-Signed Zertifikate ignoriert (`ignoreHTTPSErrors: true`).
  - **Overlay-Handling**: Nach dem Login und bei Navigationen wird das modale Onboarding-Fenster (*„Willkommen bei Katalon...“*) automatisch via `dismissOnboarding(page)` über den Button *„Überspringen“* geschlossen, damit Screenshots frei von Overlays bleiben.
  - **SPA & Routing**: Das Admin-Frontend ist eine Single Page Application mit Hash-Routing (z. B. `#objects`, `#subtypes`, `#schema`, `#vocab`, `#collections-list`).
- **Shot-Definitionen**: [`scripts/screenshots.shots.mjs`](file:///Users/karl/Coding/Katalon%20Collections/katalon-docs/scripts/screenshots.shots.mjs)
  - Jeder Screenshot wird deklarativ hinterlegt:
    ```javascript
    {
      id: 'eindeutige-id',
      file: 'kategorie/dateiname.png', // Relativ zu src/assets/screenshots/
      path: '/objects',                 // Route / Pfad im Admin
      alt: 'Deutscher Alt-Text für Barrierefreiheit und Doku',
      before: async (page) => { ... }, // Optional: Klicks, Filter, Modals, Tastatureingaben
      waitFor: 'selector',            // Optional: Warten auf Element
      selector: '.sub-area',          // Optional: Nur Ausschnitt / Crop auf Element (z. B. .relations-card)
      // Spotlight-Dimming für Fokus auf bestimmte Bereiche/Modals:
      // In before() kann applySpotlight(page, targets, { padding, radius, opacity, borderColor, borderWidth }) genutzt werden.
    }
    ```
- **Spotlight-Dimming & Helpers**: [`scripts/screenshots.helpers.mjs`](file:///Users/karl/Coding/Katalon%20Collections/katalon-docs/scripts/screenshots.helpers.mjs)
  - `applySpotlight(page, targets, options)` blendet einen abgedunkelten Hintergrund (SVG-Maske mit Aussparung, abgerundeten Ecken und feinem blauem Rahmen) über die Seite ein, um bestimmte Felder oder Dialoge hervorzuheben.

### Ausführung

```bash
# Alle definierten Screenshots aufnehmen:
KATALON_ADMIN_EMAIL=admin@katalon.dev KATALON_ADMIN_PASSWORD=... npm run screenshots

# Nur einen bestimmten Screenshot aufnehmen:
... npm run screenshots -- --only=batch-bearbeitung-auswahl

# In temporären Ordner ausgeben (für Tests):
... npm run screenshots -- --only=... --out=/tmp/test-shots
```

### Einbindung in die Doku

- Bilder liegen in `src/assets/screenshots/<kategorie>/<name>.png`.
- In Markdown/MDX-Dateien relativ referenzieren:
  ```markdown
  ![Alt-Text](../../../assets/screenshots/<kategorie>/<name>.png)
  ```
- Astro / Starlight optimiert die Bilder beim Build automatisch mit Sharp und konvertiert sie zu performantem WebP.

### Markierungs-Konvention in Markdown

In Doku-Dateien werden geplante oder fehlende Screenshots mit folgendem Blockquote-Muster markiert:

```markdown
> **Bild vorgesehen: Kurzer Titel.**
> Zeigen: Was genau im Bild zu sehen sein soll. Alt-Text: „Passender Alt-Text.“
```

