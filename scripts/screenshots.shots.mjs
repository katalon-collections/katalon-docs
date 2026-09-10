// Shot definitions for scripts/screenshots.mjs.
//
// Each shot describes one screenshot to capture from the live admin UI:
//   id       — stable identifier, also used for --only filtering
//   file     — output path relative to the configured --out directory
//              (defaults to src/assets/screenshots/), e.g. "batch-bearbeitung/auswahl.png"
//   path     — admin route to open, relative to the admin base URL (e.g. "/objects")
//   alt      — German alt text to use once the shot is embedded in a docs page
//   before   — optional async (page) => {} hook run after navigation and before the
//              screenshot, to open modals, fill search fields, expand sections, etc.
//   waitFor  — optional selector or text (Playwright locator string) to wait for before
//              the screenshot is taken; defaults to networkidle.
//   selector — optional CSS selector to screenshot instead of the full viewport.
//
// Add real shots here once demo data is in place; keep `file` names aligned with the
// docs page + section they illustrate.
export const shots = [
  {
    id: 'objects-list-smoke-test',
    file: '_smoke-test/objects-list.png',
    path: '/objects',
    alt: '(Testaufnahme, nicht für die Doku bestimmt)',
  },
]
