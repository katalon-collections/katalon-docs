// Shot definitions for scripts/screenshots.mjs.
//
// Each shot describes one screenshot to capture from the live admin UI:
//   id       — stable identifier, also used for --only filtering
//   file     — output path relative to src/assets/screenshots/
//   path     — admin route to open, relative to admin base URL (e.g. "/#objects")
//   alt      — German alt text to use once the shot is embedded in a docs page
//   before   — optional async (page) => {} hook run after navigation
//   waitFor  — optional locator string to wait for
//   selector — optional CSS selector to crop to instead of full viewport
//   spotlight— optional { targets, padding, radius, opacity, borderColor, borderWidth }
//

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { applySpotlight } from './screenshots.helpers.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SAMPLE_CSV = resolve(__dirname, 'sample_import.csv')

export const shots = [
  // --- Getting Started: Eigene Sammlung ---
  {
    id: 'admin-navigation',
    file: 'getting-started/admin-navigation.png',
    path: '/',
    alt: 'Navigation der Katalon-Admin-UI mit den Bereichen für Konfiguration und Datensätze.',
    before: async (page) => {
      const inhalteGroup = page.locator('aside nav, aside').locator('text=INHALTE').locator('..')
      const konfigGroup = page.locator('aside nav, aside').locator('text=KONFIGURATION').locator('..')
      await applySpotlight(page, [inhalteGroup, konfigGroup], {
        padding: 10,
        radius: 8,
        opacity: 0.52,
        borderColor: '#38bdf8',
        borderWidth: 2,
      })
    },
  },
  {
    id: 'getting-started-subtyp-neu',
    file: 'getting-started/subtyp-neu.png',
    path: '/#subtypes',
    alt: 'Subtyp Fotografie mit dem internen Namen fotografie.',
    before: async (page) => {
      await page.getByRole('button', { name: /neuer subtyp/i }).click()
      await page.waitForTimeout(300)
      const flds = page.locator('input.fld')
      await flds.nth(0).fill('Fotografie')
      await flds.nth(1).fill('Photograph')
      await flds.nth(2).fill('fotografie')
      await page.getByLabel(/standard-subtyp/i).check()
      await page.waitForTimeout(300)
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'getting-started-relationstyp-editor',
    file: 'getting-started/relationstyp-editor.png',
    path: '/#vocab',
    alt: 'Relationstyp fotografiert von für Objekt zu Entität.',
    before: async (page) => {
      await page.getByText('relation_types').click()
      await page.waitForTimeout(400)
      const row = page.locator('tr:has-text("fotografiert_von")')
      await row.locator('button').click()
      await page.waitForTimeout(200)
      await page.getByText(/bearbeiten/i).click()
      await page.waitForTimeout(400)
      const modal = page.locator('.modal, [role="dialog"], .drawer').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'getting-started-schema-feldeditor',
    file: 'getting-started/schema-feldeditor.png',
    path: '/#schema',
    alt: 'Schemafeld Fotograf:in als Relation von einem Objekt zu einer Entität.',
    before: async (page) => {
      await page.getByRole('button', { name: /neues feld/i }).click()
      await page.waitForTimeout(400)
      const flds = page.locator('input.fld')
      await flds.nth(0).fill('Fotograf:in')
      await flds.nth(1).fill('Photographer')
      await flds.nth(2).fill('fotograf_in')
      await page.locator('select').nth(1).selectOption('relation')
      await page.waitForTimeout(300)
      await page.locator('select').nth(5).selectOption('entity')
      await page.waitForTimeout(200)
      await page.locator('select').nth(6).selectOption({ label: 'relation_types' })
      await page.waitForTimeout(300)
      await page.locator('select').nth(7).selectOption({ label: 'fotografiert von' })
      await page.waitForTimeout(300)
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'getting-started-objekt-relationen',
    file: 'getting-started/objekt-relationen.png',
    path: '/#objects',
    alt: 'Objektformular mit verknüpfter Entität, Ort und Occurrence.',
    before: async (page) => {
      await page.getByRole('button', { name: 'Neu anlegen' }).click()
      await page.waitForTimeout(600)

      const subtypSelect = page.locator('select.fld').first()
      await subtypSelect.selectOption({ label: 'Fotografie' }).catch(() => {})
      await page.waitForTimeout(500)

      const idInput = page.locator('input[placeholder*="FOT"], .field:has-text("ID") input').first()
      if (await idInput.isVisible()) await idInput.fill('FOT-1925-001')

      const labelInput = page.locator('.field:has-text("Label") input').first()
      await labelInput.fill('Marktplatz im Winter')

      const dateInput = page.locator('.field:has-text("Datierung") input.fld').first()
      if (await dateInput.isVisible()) await dateInput.fill('1925')

      // Fill Marta Keller in Urheber/in
      const urheberField = page.locator('.field:has-text("Urheber/in")')
      await urheberField.locator('input').fill('Marta')
      await page.waitForTimeout(400)
      const opt1 = page.locator('button:has-text("Marta Keller")').first()
      if (await opt1.isVisible()) {
        await opt1.click()
        await page.waitForTimeout(200)
        const linkBtn = urheberField.getByRole('button', { name: 'Verknüpfen' })
        if (await linkBtn.isVisible()) await linkBtn.click()
      }

      // Fill Marktplatz in Aufnahmeort
      const aufnahmeField = page.locator('.field:has-text("Aufnahmeort")')
      await aufnahmeField.locator('input').fill('Marktplatz')
      await page.waitForTimeout(400)
      const opt2 = page.locator('button:has-text("Marktplatz Neustadt")').first()
      if (await opt2.isVisible()) {
        await opt2.click()
        await page.waitForTimeout(200)
        const linkBtn = aufnahmeField.getByRole('button', { name: 'Verknüpfen' })
        if (await linkBtn.isVisible()) await linkBtn.click()
      }

      // Fill Winter in Bezug zu Werk/Ereignis
      const bezugField = page.locator('.field:has-text("Bezug zu Werk/Ereignis")')
      await bezugField.locator('input').fill('Winter')
      await page.waitForTimeout(400)
      const opt3 = page.locator('button:has-text("Winter in der Stadt")').first()
      if (await opt3.isVisible()) {
        await opt3.click()
        await page.waitForTimeout(200)
        const linkBtn = bezugField.getByRole('button', { name: 'Verknüpfen' })
        if (await linkBtn.isVisible()) await linkBtn.click()
      }

      // Scroll so the 3 relation fields with their chips are nicely centered
      await page.evaluate(() => {
        const scrollEl = document.querySelector('.scroll')
        if (scrollEl) scrollEl.scrollTop = 1150
      })
      await page.waitForTimeout(400)

      await applySpotlight(page, [urheberField, aufnahmeField, bezugField], {
        padding: 8,
        radius: 8,
        opacity: 0.52,
        borderColor: '#38bdf8',
        borderWidth: 2,
      })
    },
  },
  {
    id: 'getting-started-beziehungen-karte',
    file: 'getting-started/beziehungen-karte.png',
    path: '/#objects',
    alt: 'Beziehungen-Karte mit bestehenden Verknüpfungen eines Objekts.',
    selector: '.relations-card',
    before: async (page) => {
      const searchInput = page.getByPlaceholder('Suchen...')
      if (await searchInput.isVisible()) {
        await searchInput.fill('Marktplatz im Winter')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(600)
      }
      const row = page.locator('tr:has-text("Marktplatz im Winter")').first()
      if (await row.isVisible()) {
        const link = row.locator('.record-label-button').first()
        if (await link.isVisible()) await link.click()
        else await row.click()
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(800)
      }
    },
  },
  {
    id: 'getting-started-vorgang-leihgabe',
    file: 'getting-started/vorgang-leihgabe.png',
    path: '/#procedures-list',
    alt: 'Aktiver Vorgang Leihgabe ausgehend mit verknüpftem Objekt und empfangender Institution.',
    before: async (page) => {
      const row = page.locator('tr:has-text("Leihgabe an Kunstmuseum Basel"), tr:has-text("VOR-2026-001")').first()
      await row.waitFor({ timeout: 5000 })
      const btn = row.locator('.record-label-button, button, a').first()
      if (await btn.isVisible()) {
        await btn.click()
      } else {
        await row.click()
      }
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(800)
    },
  },

  // --- Administration: Batch-Bearbeitung ---
  {
    id: 'batch-bearbeitung-auswahl',
    file: 'batch-bearbeitung/auswahl.png',
    path: '/objects',
    alt: 'Mehrere Datensätze ausgewählt mit eingeblendeter Aktionsleiste für Massenbearbeitung',
    before: async (page) => {
      const checkboxes = await page.locator('input[type=checkbox]').all()
      if (checkboxes.length > 2) {
        await checkboxes[1].check()
        await checkboxes[2].check()
        await page.waitForTimeout(300)
      }
      const bar = page.locator('.batch-bar, [class*="batch"], [class*="action-bar"]').first()
      if (await bar.isVisible()) {
        await applySpotlight(page, bar, {
          padding: 6,
          radius: 8,
          opacity: 0.45,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'batch-bearbeitung-dialog',
    file: 'batch-bearbeitung/dialog.png',
    path: '/objects',
    alt: 'Massenbearbeitungs-Dialog zur Auswahl der durchzuführenden Operation',
    before: async (page) => {
      const checkboxes = await page.locator('input[type=checkbox]').all()
      if (checkboxes.length > 2) {
        await checkboxes[1].check()
        await checkboxes[2].check()
        await page.waitForTimeout(300)
      }
      const batchBtn = page.getByRole('button', { name: /massenbearbeitung/i })
      await batchBtn.click()
      await page.waitForTimeout(400)
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },

  // --- Administration: Cookbook ---
  {
    id: 'cookbook-relationsvokabular',
    file: 'cookbook/relationsvokabular.png',
    path: '/#vocab',
    alt: 'Vokabular-Einträge des Relationsvokabulars mit Rollen und Typbindung.',
    before: async (page) => {
      await page.getByText('relation_types').click()
      await page.waitForTimeout(500)
      const row = page.locator('tr:has-text("auftraggeber")').first()
      if (await row.isVisible()) {
        await applySpotlight(page, row, {
          padding: 6,
          radius: 6,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'cookbook-schemafeld-erweitert',
    file: 'cookbook/schemafeld-erweitert.png',
    path: '/#schema',
    alt: 'Internes Schemafeld, das nicht über öffentliche APIs ausgegeben wird.',
    before: async (page) => {
      await page.getByRole('button', { name: /neues feld/i }).click()
      await page.waitForTimeout(400)
      const flds = page.locator('input.fld')
      await flds.nth(0).fill('Restaurierungsnotiz (intern)')
      await flds.nth(1).fill('Conservation note (internal)')
      await flds.nth(2).fill('restaurierungsnotiz_intern')
      await page.getByText(/erweiterte optionen/i).click()
      await page.waitForTimeout(300)
      const publicApiCb = page.getByLabel(/öffentlich über apis/i)
      if (await publicApiCb.isVisible()) {
        await publicApiCb.uncheck()
      }
      await page.waitForTimeout(300)
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'cookbook-vorgangsschema-restaurierung',
    file: 'cookbook/vorgangsschema-restaurierung.png',
    path: '/#schema',
    alt: 'Schema-Editor für den Vorgangstyp Restaurierung mit subtypspezifischen Feldern.',
    before: async (page) => {
      await page.locator('.content, main, .main').getByRole('button', { name: 'Vorgänge', exact: true }).click()
      await page.waitForTimeout(500)
      await page.locator('button:has-text("Konservierung"), button:has-text("Restaurierung")').first().click()
      await page.waitForTimeout(600)
      const conservationRows = page.locator('.field-row:has-text("conservation")')
      if (await conservationRows.count() > 0) {
        await applySpotlight(page, conservationRows, {
          padding: 4,
          radius: 6,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },
  {
    id: 'cookbook-importer-probelauf',
    file: 'cookbook/importer-probelauf.png',
    path: '/#import',
    alt: 'Vorschau eines Importer-Laufs mit Split-Transformation für Mehrfachwerte.',
    before: async (page) => {
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(SAMPLE_CSV)
      await page.waitForTimeout(800)

      const selectFarben = page.locator('tr:has-text("farben") select').first()
      if (await selectFarben.isVisible()) {
        await selectFarben.selectOption({ label: 'Technik' }).catch(async () => {
          await selectFarben.selectOption('technik')
        })
        await page.waitForTimeout(300)
      }

      const gearBtn = page.locator('tr:has-text("farben") button').first()
      if (await gearBtn.isVisible()) {
        await gearBtn.click()
        await page.waitForTimeout(400)

        const transSelect = page.locator('.modal select, [role="dialog"] select').first()
        if (await transSelect.isVisible()) {
          await transSelect.selectOption({ label: 'Aufteilen (Split)' }).catch(async () => {
            await transSelect.selectOption('split')
          })
          await page.waitForTimeout(300)
        }

        const addBtn = page.locator('.modal button:has-text("Hinzufügen"), [role="dialog"] button:has-text("Hinzufügen")').first()
        if (await addBtn.isVisible()) {
          await addBtn.click()
          await page.waitForTimeout(300)
        }

        const delimInput = page.locator('.modal input, [role="dialog"] input').first()
        if (await delimInput.isVisible()) {
          await delimInput.fill(';')
          await page.waitForTimeout(300)
        }

        const modal = page.locator('.modal, [role="dialog"]').first()
        if (await modal.isVisible()) {
          await applySpotlight(page, modal, {
            padding: 8,
            radius: 8,
            opacity: 0.52,
            borderColor: '#38bdf8',
            borderWidth: 2,
          })
        }
      }
    },
  },

  // --- Integration & Portal: Suche & Facetten ---
  {
    id: 'portal-suche-facetten',
    file: 'portal/suche-facetten.png',
    path: 'https://katalon.local/search?q=',
    alt: 'Öffentliche Portalsuche mit Facetten nach Objekttyp, Subtyp und Material.',
    before: async (page) => {
      await page.waitForTimeout(600)
    },
  },
  {
    id: 'portal-erweiterte-suche',
    file: 'portal/erweiterte-suche.png',
    path: 'https://katalon.local/advanced-search',
    alt: 'Erweiterte Suche im Portal mit Bedingungen für verknüpfte Datensätze.',
    before: async (page) => {
      const relSelect = page.locator('select:has-text("Feld auswählen")').first()
      if (await relSelect.isVisible()) {
        await relSelect.selectOption({ label: 'Urheber/in → Person/Org' }).catch(() => {})
        await page.waitForTimeout(500)
      }
    },
  },

  // --- Administration: Einstellungen (Facetten & Startseite) ---
  {
    id: 'einstellungen-facetten',
    file: 'einstellungen/facetten-konfiguration.png',
    path: '/#settings',
    alt: 'Konfiguration der Suchfacetten pro Datensatztyp in den Admin-Einstellungen.',
    before: async (page) => {
      await page.getByRole('button', { name: 'Facetten', exact: true }).click()
      await page.waitForTimeout(500)
    },
  },
  {
    id: 'einstellungen-startseite',
    file: 'einstellungen/startseite-bausteine.png',
    path: '/#settings',
    alt: 'Modulare Konfiguration der Portal-Startseite mit sortierbaren Inhaltsbausteinen.',
    before: async (page) => {
      await page.getByRole('button', { name: 'Startseite', exact: true }).click()
      await page.waitForTimeout(500)
    },
  },

  // --- Administration: Normdaten ---
  {
    id: 'normdaten-quellen',
    file: 'normdaten/quellen-uebersicht.png',
    path: '/#settings',
    alt: 'Übersicht und Konfiguration der externen Normdatenquellen in den Admin-Einstellungen.',
    before: async (page) => {
      await page.getByRole('button', { name: 'Normdatenquellen', exact: true }).click()
      await page.waitForTimeout(500)
    },
  },

  // --- Administration: Schema-Verwaltung ---
  {
    id: 'schema-feldgruppe',
    file: 'schema/feldgruppe-editor.png',
    path: '/#schema',
    alt: 'Anlegen einer Feldgruppe im Schema-Editor mit Subfeldern und Mehrsprachigkeit.',
    before: async (page) => {
      await page.getByRole('button', { name: /neues feld/i }).click()
      await page.waitForTimeout(400)
      const flds = page.locator('input.fld')
      await flds.nth(0).fill('Maße & Gewicht')
      await flds.nth(1).fill('Dimensions & Weight')
      await flds.nth(2).fill('masse_gewicht')
      await page.locator('select').nth(1).selectOption('group')
      await page.waitForTimeout(300)
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },

  // --- Administration: Formularvarianten ---
  {
    id: 'administration-formularvariante-editor',
    file: 'administration/formularvariante-editor.png',
    path: '/#form-variants',
    alt: 'Formularvarianten-Editor zur Auswahl und Anordnung von Feldern für Schnellerfassungen.',
    before: async (page) => {
      await page.getByRole('button', { name: /neue variante/i }).click()
      await page.waitForTimeout(400)
      const flds = page.locator('.modal input.fld, [role="dialog"] input.fld')
      if (await flds.count() >= 2) {
        await flds.nth(0).fill('schnellerfassung')
        await flds.nth(1).fill('Schnellerfassung Leihverkehr')
      }
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },

  // --- Administration: Sammlungen ---
  {
    id: 'sammlungen-baum',
    file: 'sammlungen/sammlungsbaum.png',
    path: '/#collections-list',
    alt: 'Hierarchische Sammlungsstruktur in der Katalon-Sammlungsverwaltung.',
    before: async (page) => {
      await page.waitForTimeout(600)
    },
  },

  // --- Administration: Lagerorte ---
  {
    id: 'lagerorte-standort-hierarchie',
    file: 'lagerorte/standort-hierarchie.png',
    path: '/#storage-locations',
    alt: 'Lagerorthierarchie mit ausgewähltem Depot und zugeordneten Objekten.',
    before: async (page) => {
      const node = page.locator('button:has-text("LOC-LOC-DEPOT-A"), .tree-node:has-text("DEPOT-A")').first()
      if (await node.isVisible()) await node.click()
      await page.waitForTimeout(500)
    },
  },

  // --- Administration: Datensatz-Sperren ---
  {
    id: 'administration-sperre-banner',
    file: 'administration/sperre-banner.png',
    path: '/#objects',
    alt: 'Aktive Datensatz-Sperre mit violettem Hinweisbalken und Sperrgrund im Formular.',
    before: async (page) => {
      const searchInput = page.getByPlaceholder('Suchen...')
      if (await searchInput.isVisible()) {
        await searchInput.fill('Marktplatz im Winter')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(600)
      }
      const row = page.locator('tr:has-text("Marktplatz im Winter")').first()
      if (await row.isVisible()) {
        const link = row.locator('.record-label-button').first()
        if (await link.isVisible()) await link.click()
        else await row.click()
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(600)
      }
      const lockBtn = page.getByRole('button', { name: 'Sperren', exact: true })
      if (await lockBtn.isVisible()) {
        await lockBtn.click()
        await page.waitForTimeout(300)
        const textarea = page.locator('.modal textarea, [role="dialog"] textarea').first()
        if (await textarea.isVisible()) {
          await textarea.fill('Restaurierungsdokumentation läuft bis Ende der Woche.')
          await page.locator('.modal button:has-text("Sperren"), [role="dialog"] button:has-text("Sperren")').last().click()
          await page.waitForTimeout(500)
        }
      }
      const banner = page.locator('.record-lock-banner, div:has-text("Dieser Datensatz ist gesperrt")').first()
      if (await banner.isVisible()) {
        await applySpotlight(page, banner, {
          padding: 6,
          radius: 8,
          opacity: 0.45,
          borderColor: '#a855f7',
          borderWidth: 2,
        })
      }
    },
    after: async (page) => {
      const unlockBtn = page.getByRole('button', { name: /sperre aufheben/i })
      if (await unlockBtn.isVisible()) {
        await unlockBtn.click()
        await page.waitForTimeout(400)
      }
    },
  },

  // --- Administration: Audit-Log ---
  {
    id: 'administration-audit-log',
    file: 'administration/audit-log-diff.png',
    path: '/#audit',
    alt: 'Lückenlose Änderungshistorie im Audit-Log mit Aktionsfiltern und Feldänderungen.',
    before: async (page) => {
      await page.waitForTimeout(500)
    },
  },

  // --- Administration: Arbeitslisten ---
  {
    id: 'arbeitslisten-uebersicht',
    file: 'arbeitslisten/uebersicht-modal.png',
    path: '/#working-sets',
    alt: 'Anlegen einer neuen Arbeitsliste mit Typbeschränkung und Freigabeoption.',
    before: async (page) => {
      const btn = page.getByRole('button', { name: /neue arbeitsliste/i })
      await btn.waitFor({ state: 'visible', timeout: 10000 })
      await btn.click()
      await page.waitForTimeout(400)
      const nameInput = page.locator('.modal input, [role="dialog"] input').first()
      if (await nameInput.isVisible()) {
        await nameInput.fill('Auswahl Sonderausstellung 2027')
      }
      const modal = page.locator('.modal, [role="dialog"]').first()
      if (await modal.isVisible()) {
        await applySpotlight(page, modal, {
          padding: 8,
          radius: 8,
          opacity: 0.52,
          borderColor: '#38bdf8',
          borderWidth: 2,
        })
      }
    },
  },

  // --- Administration: Banner (als allerletzter Shot, damit Banner keine anderen Screenshots überlagert) ---
  {
    id: 'administration-banner',
    file: 'administration/banner-hinweis.png',
    path: '/#banners',
    alt: 'Aktiver Hinweisbanner im Kopfbereich der Admin-Oberfläche und Banner-Übersicht.',
    before: async (page, { setBannersActive }) => {
      if (setBannersActive) await setBannersActive(true)
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(600)
    },
    after: async (page, { setBannersActive }) => {
      if (setBannersActive) await setBannersActive(false)
    },
  },
]


