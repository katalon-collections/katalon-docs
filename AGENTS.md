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
