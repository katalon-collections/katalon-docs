---
title: Mitwirken & Richtlinien
description: Leitfaden für Beiträge, Code-Standards, Conventional Commits, Lizenzheader und CI-Workflows in Katalon Collections.
---

Wir freuen uns über Beiträge zu Katalon Collections! Ob Fehlerbehebungen, neue Exporter, Normdaten-Adapter oder Dokumentationsverbesserungen — jeder Beitrag hilft, Museen und Archiven eine moderne, freie Sammlungssoftware bereitzustellen.

:::note[Verfügbar ab Version 1.36.0]
Katalon Collections ist Open Source unter der Lizenz **AGPL-3.0-or-later**. Alle Beiträge unterliegen dieser Lizenz.
:::

---

## Contribution Workflow

Entwicklungsbeiträge folgen dem klassischen GitHub-Pull-Request-Modell:

1. **Repository forken:** Erstellen Sie einen eigenen Fork von [katalon-collections/katalon](https://github.com/katalon-collections/katalon).
2. **Branch erstellen:** Erstellen Sie von `main` ausgehend einen prägnanten Feature-Branch:
   ```bash
   git checkout -b feat/neuer-lido-export
   # oder: git checkout -b fix/issue-412-berechtigungsfehler
   ```
3. **Entwickeln & Testen:**
   - Schreiben Sie für Backend-Logik gezielte `pytest`-Tests.
   - Halten Sie Frontend-Komponenten frei von `any` und prüfen Sie mit `npm run typecheck`.
   - Fügen Sie bei UI-Änderungen stets beide Sprachen (Deutsch und Englisch) hinzu.
4. **Pull Request einreichen:**
   - Formulieren Sie eine aussagekräftige Beschreibung mit Verweis auf eventuelle GitHub-Issues (`Fixes #123`).
   - Stellen Sie sicher, dass alle automatisierten CI-Prüfungen grün durchlaufen.

---

## Conventional Commits

Commit-Nachrichten sollten dem Standard von [Conventional Commits](https://www.conventionalcommits.org/) folgen. Dies erleichtert das Nachvollziehen von Änderungen und die automatische Changelog-Pflege:

```text
<typ>(<bereich>): <kurze beschreibung im präsens>

[optionaler detailtext]

[optionales schließendes issue-tag, z.B. Fixes #245]
```

### Typische Typen

- `feat:` Ein neues Feature oder eine neue Funktion für Anwender oder Entwickler.
- `fix:` Eine Fehlerbehebung.
- `docs:` Änderungen oder Ergänzungen an der Dokumentation.
- `refactor:` Code-Umstrukturierung ohne funktionale Änderung oder Fehlerbehebung.
- `test:` Hinzufügen oder Korrigieren von automatisierten Tests.
- `perf:` Leistungsoptimierungen.
- `chore:` Aktualisierung von Abhängigkeiten, Build-Skripten oder Konfigurationen.

**Beispiele:**
```text
feat(export): LIDO 1.0 Export für Ereignisdatierungen ergänzen
fix(auth): Token-Ablaufprüfung im Refresh-Handler korrigieren
docs(api): Endpunkte für Arbeitslisten dokumentieren
```

---

## Lizenz- und SPDX-Header (Pflicht)

Katalon Collections steht unter der **GNU Affero General Public License v3.0 or later** (`AGPL-3.0-or-later`).

Jede neu erstellte Quellcodedatei (`.py`, `.ts`, `.tsx`, `.sh`, `.mjs`) **muss** zwingend am Dateianfang den standardisierten SPDX-Header tragen:

```python
# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (c) 2026 Karl Krägelin
```

Für TypeScript/JavaScript-Dateien verwenden Sie entsprechende Zeilenkommentare:

```typescript
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Karl Krägelin
```

Dateien ohne diesen Header können nicht in das Projekt aufgenommen werden.

---

## CI-Pipeline & Qualitätssicherung

Auf GitHub Actions laufen bei jedem Push und Pull Request automatisierte Qualitätsprüfungen:

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI                        │
├──────────────────────────────┬──────────────────────────────┤
│ Backend CI                   │ Frontend CI                  │
│ • Ruff (Linting & Format)    │ • ESLint                     │
│ • Mypy (Typprüfung)          │ • TypeScript (tsc --noEmit)  │
│ • Pytest (Datenbank-Tests)   │ • Vite Production Build      │
│ • OpenAPI Schema Check       │                              │
└──────────────────────────────┴──────────────────────────────┘
```

### Wichtige lokale Prüfungen vor dem Push

Führen Sie vor dem Einreichen eines Pull Requests folgende Checks lokal aus:

```bash
# 1. Backend Linting & Formatierung:
uvx ruff check backend/src backend/tests
uvx ruff format --check backend/src backend/tests

# 2. Backend Tests:
KATALON_SECRETS_KEY="test-katalon-secrets-key-32-chars" uv run pytest backend/tests/

# 3. OpenAPI-Spezifikation prüfen (darf keine ungecommitteten Änderungen aufweisen):
uv run katalon-manage openapi --check

# 4. Frontend-Checks (in frontend/admin und frontend/portal):
npm run lint
npm run typecheck
npm run build
```

---

## Entwicklungsphilosophie: YAGNI & Boring Technology

Beim Entwurf neuer Features und APIs orientiert sich Katalon Collections an bewährten Leitsätzen:

- **Radikale Einfachheit & YAGNI (You Aren't Gonna Need It):** Bauen Sie keine spekulativen Abstraktionen, Plugin-Layer oder universellen Konfigurationsoptionen für Anforderungen, die heute niemand benötigt. Wählen Sie stets den direktesten und wartungsärmsten Weg („Boring Technology“).
- **Wiederverwendung vor Neubau:** Nutzen Sie zuerst vorhandene Schemata, Standard-Services und bestehende UI-Komponenten, bevor neue Tabellen, Endpunkte oder externe Bibliotheken eingeführt werden.
- **Datenintegrität hat Vorrang:** Metadaten historischer Sammlungen sind unersetzlich. Transaktionssicherheit, optimistische Sperren (`version`) und lückenlose Audit-Logs haben immer Vorrang vor schnellen Feature-Releases.
