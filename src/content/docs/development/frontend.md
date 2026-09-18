---
title: Frontend-Entwicklung
description: Architektur, lokales Setup, Typisierung und Lokalisierungsrichtlinien für die Frontends von Katalon Collections.
---

Katalon Collections verfügt über zwei vollständig getrennte Frontend-Anwendungen im Verzeichnis `frontend/`:
1. **Admin UI (`frontend/admin`)**: Das geschützte Verwaltungswerkzeug für Inventarisierung, Schema-Konfiguration, Vokabulare und Benutzerverwaltung.
2. **Public Portal (`frontend/portal`)**: Das öffentlich zugängliche Rechercheportal mit facettierter Suche, Deep-Zoom-Bildbetrachter und anpassbarem Theming.

Beide Frontends basieren auf **React**, **TypeScript** und **Vite**.

:::note[Verfügbar ab Version 1.36.0]
Beide Frontends setzen auf striktes TypeScript ohne `any` und erzwingen vollständige Zweisprachigkeit (Deutsch und Englisch).
:::

---

## Lokale Entwicklung (ohne Docker)

Wenn Sie das Backend bereits lokal (z. B. auf Port 8000) oder über den Docker-Dev-Stack ausführen, können Sie die Frontend-Entwicklungsserver direkt starten.

### 1. Admin-Oberfläche starten

```bash
cd frontend/admin

# Abhängigkeiten installieren (einmalig)
npm install
# Alternativ: pnpm install

# Entwicklungsserver starten
npm run dev
```
Die Admin-Oberfläche startet standardmäßig auf [http://localhost:5173](http://localhost:5173).

### 2. Öffentliches Portal starten

```bash
cd frontend/portal

# Abhängigkeiten installieren (einmalig)
npm install
# Alternativ: pnpm install

# Entwicklungsserver starten
npm run dev
```
Das Portal startet standardmäßig auf [http://localhost:5174](http://localhost:5174).

---

## Routing & Architektur im Vergleich

| Eigenschaft | Admin UI (`frontend/admin`) | Public Portal (`frontend/portal`) |
|---|---|---|
| **Routing-Muster** | **Hash-basiert** (`#objects`, `#schema`, `#vocab`) | **URL-basiert** via *React Router v6* (`/objects/:id`) |
| **Zustandscodierung** | Deep-Links im Hash (z. B. `#form-variants/objects.person`) | URL-Suchparameter (`?q=...&type=object`) |
| **Authentifizierung** | Erforderlich (JWT Bearer Token im SessionStorage) | Keine (ausschließlich öffentliche Daten) |
| **Hauptkomponenten** | `src/components/screens/Screen*.tsx` | `src/pages/*Page.tsx` |
| **Layout** | `AppShell.tsx`, `Sidebar.tsx`, `Topbar.tsx` | Header, Footer, Hero, Suche, Detailansichten |

---

## Code-Qualität, Linting & Typprüfung

### Linting mit ESLint

Prüfen Sie den Code vor jedem Commit auf Stil- und Syntaxfehler:

```bash
# Im jeweiligen Frontend-Verzeichnis:
npm run lint
```

### Typüberprüfung mit TypeScript

TypeScript ist mit `strict: true` konfiguriert. Fehler verhindern den Build:

```bash
# Typprüfung ohne Build-Artefakte:
npm run typecheck
# Oder: npx tsc --noEmit
```

### Verbindliche Codierregeln

- **Absolutes `any`-Verbot:** Die gesamte Codebase ist frei von TypeScript-`any`. Definieren Sie präzise Interfaces und Typen für API-Payloads.
- **Keine Debug-Logs:** Committen Sie niemals `console.log()`-Aufrufe.
- **Sicheres HTML-Rendering:** `dangerouslySetInnerHTML` darf niemals mit Rohdaten aufgerufen werden; verwenden Sie immer eine Sanitisierung über `DOMPurify`.
- **Modale Dialoge:** Verwenden Sie niemals native Browser-Dialoge wie `window.confirm()` oder `window.alert()`. Nutzen Sie stattdessen:
  - `src/components/ui/ConfirmModal.tsx` für einfache Bestätigungen (z. B. Löschabfragen).
  - Spezifische Modalkomponenten (`*Modal.tsx`) mit der einheitlichen CSS-Klasse `batch-modal-backdrop` für komplexere Dialoge mit Optionen.

---

## Mehrsprachigkeit & I18n-Pflicht

Katalon Collections richtet sich an internationale Kulturinstitutionen. Jede Benutzeroberfläche muss uneingeschränkt auf **Deutsch** und **Englisch** bedienbar sein.

### Regeln für neue UI-Texte

1. **Keine fest codierten Strings:** Fügen Sie im Admin-Frontend niemals fest verdrahtete deutsche oder englische Strings direkt in JSX-Elemente ein.
2. **Zweisprachige Wörterbücher:** Neue Bezeichner, Hilfetexte, Tabellen-Spaltenüberschriften und Fehlermeldungen müssen in beiden Sprachen in den Lokalisierungsdateien bzw. Translation-Objekten hinterlegt werden:
   ```typescript
   // Beispiel für ein zweisprachiges Label-Objekt:
   label: {
     de: "Inventarnummer",
     en: "Accession Number"
   }
   ```
3. **Admin-Topbar:** Neue Screens oder Ansichten müssen im `ROUTE_DOCS`-Mapping in `src/components/layout/Topbar.tsx` registriert werden, damit das Hilfe-Icon direkt auf die passende Seite der Anwenderdokumentation verlinkt.

---

## Kritische Build-Konfiguration für Docker

:::caution[Deployment-Kritisch: VITE_BASE_PATH]
In `docker/Dockerfile.admin` ist der Build-Parameter `VITE_BASE_PATH=/admin/` fest vorgegeben. 

Ohne diesen Parameter baut Vite die JavaScript- und CSS-Assets mit dem absoluten Pfad `/assets/`. Da der äußere Reverse Proxy `/assets/` an das Portal leitet, können die Skripte der Admin-UI in Produktions-Deployments nicht geladen werden (404-Fehler und weiße Seite).

Ändern Sie vor Änderungen an `frontend/admin/vite.config.ts`, `docker/Dockerfile.admin` oder `docker/nginx.admin.conf` stets die Konsistenz zwischen `VITE_BASE_PATH` und den Nginx-`location`-Blöcken.
:::
