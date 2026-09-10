---
title: Portal-Themes und Erweiterungen
description: Das öffentliche Portal mit einem dateibasierten Theme gestalten und institutionelle Normdaten-Adapter bereitstellen.
---

:::note[Verfügbar ab Version 1.29.0]
Dateibasierte Portal-Themes und die hier beschriebene Downstream-Image-Erweiterung stehen ab dieser Version zur Verfügung.
:::

Das öffentliche Portal kann unabhängig von der Admin-Oberfläche angepasst werden. Ein Theme bleibt bei einem Update erhalten, weil es als eigenes Verzeichnis in die Container eingebunden wird. Die Admin-Oberfläche selbst ist nicht thematisierbar.

Für einfache Änderungen an Titel, Logo, Akzentfarbe und einigen Farbwerten genügt **Einstellungen → Portal & Institution**. Diese Einstellungen gelten auch mit einem installierten Theme und überschreiben dessen entsprechende Farbwerte.

## Dateibasiertes Theme anlegen

Lege im Installationsverzeichnis ein Theme-Verzeichnis an:

```text
themes/
└── museum/
    ├── theme.json
    ├── custom.css
    ├── favicon.svg
    └── fonts/
        └── MeineSchrift.woff2
```

`theme.json` legt den Namen, Farbwerte und statische Dateien fest. Nicht gesetzte Tokens behalten die Katalon-Standardwerte.

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

`custom.css` wird als Stylesheet geladen. Es kann eigene Schriftarten mit `@font-face` und CSS-Anpassungen enthalten. Alle Dateien müssen im Theme selbst liegen: Die Sicherheitsrichtlinie des Portals erlaubt keine Schriften, Stylesheets oder Skripte von externen CDNs.

## Theme im Container bereitstellen

Die Verzeichnisse müssen sowohl für die API als auch für das Portal verfügbar sein. Ergänze oder übernimm dafür die lokale `docker-compose.override.yml`:

```yaml
services:
  api:
    volumes:
      - ./themes:/var/lib/katalon/themes:ro
  portal:
    volumes:
      - ./themes:/usr/share/nginx/html/themes:ro
```

Setze in der `.env` den Verzeichnisnamen und starte anschließend API und Portal neu:

```bash
PORTAL_THEME=museum
docker compose up -d api portal
```

Die API liest `PORTAL_THEME` nur beim Start. Prüfe danach, ob das Manifest erreichbar ist, und ob das Portal das Stylesheet lädt:

```bash
curl http://localhost/v1/theme
```

## Wie weit ein Theme reicht

Mit `theme.json` und `custom.css` lassen sich Farben, Schriften, Favicon und viele Layoutdetails des bestehenden Portals anpassen, etwa Abstände, Karten, Kopf- und Fußbereich. Das ist der update-sichere Weg für ein institutionelles Erscheinungsbild.

Ein optionales `custom.js` kann ergänzende, idempotente DOM-Anpassungen ausführen. Es muss als lokale Datei im Theme-Verzeichnis liegen und über eine eigene Portal-nginx-Konfiguration eingebunden werden. Das ist nur sinnvoll, wenn CSS nicht reicht; bei einem Theme-Wechsel müssen der `sub_filter`-Pfad in nginx und `PORTAL_THEME` denselben Namen verwenden.

Ein grundlegender Umbau, etwa eine neue Navigationsstruktur, eigene Seiten oder eine Sidebar anstelle der Kopf-Navigation, ist kein Template-Override: Das Portal ist eine React-Anwendung ohne serverseitige Templates. Solche Eingriffe erfolgen im Portal-Quellcode und benötigen ein eigenes Portal-Image. Sie bilden damit bewusst einen wartungsintensiveren, separaten Erweiterungsweg.

## Eigene Normdaten-Adapter

Institutionelle Normdatenquellen können als Python-Paket in einem Downstream-Image bereitgestellt werden. Das Paket implementiert den Katalon-Adaptervertrag; das Image basiert auf dem jeweiligen Katalon-API-Image und installiert das Paket zusätzlich. Dadurch bleibt der Adapter bei Updates reproduzierbar und ist nicht von einem beschreibbaren Container abhängig.

Nach der Bereitstellung wird die Quelle in Katalon registriert, mit einer eindeutigen ID, einem sichtbaren Label, dem vollständigen Python-Klassenpfad und gegebenenfalls einer Konfiguration für den Konstruktor. Zugangsdaten gehören in die Instanz-Konfiguration oder einen Secret-Store, nicht in das Image oder in die Adapterdatei.

Die Admin-Oberfläche unter **Einstellungen → Normdatenquellen** kann bereits registrierte Quellen aktivieren, deaktivieren und testen. Eine neue Python-Klasse lässt sich dort derzeit nicht hochladen oder registrieren. Anschließend wählst du die aktivierte Quelle beim Anlegen eines Feldes vom Typ **Normdaten** im Schema aus. Die genaue Adapter-Schnittstelle richtet sich an Entwickler:innen und ist in der technischen Anpassungsdokumentation beschrieben.

## Grenzen und Fehlerdiagnose

- `GET /v1/theme` liefert Standardwerte: `PORTAL_THEME` fehlt, der API-Container wurde nicht neu gestartet oder `theme.json` ist im API-Container nicht unter `/var/lib/katalon/themes/<name>/` vorhanden.
- Farben erscheinen, aber die Schrift oder CSS nicht: Der Portal-Mount fehlt oder der Pfad in `fonts.body` zeigt nicht auf `/themes/<name>/custom.css`.
- Eine Admin-Farbe setzt sich gegen das Theme durch: Das ist beabsichtigt. Portal-Einstellungen aus der Admin-Oberfläche werden zuletzt angewendet.
- Das Browser-Protokoll meldet eine CSP-Verletzung: Die Datei ist nicht lokal unter `/themes/` eingebunden oder verwendet eine externe Ressource.
