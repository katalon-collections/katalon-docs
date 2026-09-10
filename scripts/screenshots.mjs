#!/usr/bin/env node
// Screenshot pipeline for the Katalon admin docs.
//
// Logs into a running Katalon admin instance, walks the shot list in
// screenshots.shots.mjs, and writes PNGs for use in the docs pages.
//
// Usage:
//   KATALON_ADMIN_EMAIL=... KATALON_ADMIN_PASSWORD=... node scripts/screenshots.mjs
//   node scripts/screenshots.mjs --only=objects-list-smoke-test
//   node scripts/screenshots.mjs --out=/tmp/katalon-screenshots
//
// Env vars:
//   KATALON_ADMIN_URL      Base admin URL, default https://katalon.local/admin/
//   KATALON_ADMIN_EMAIL    Admin login email (required)
//   KATALON_ADMIN_PASSWORD Admin login password (required)
//
// Notes:
// - Login happens through the real UI form (not a direct token fetch) so the
//   pipeline exercises the same path a user does and survives auth changes.
// - The admin instance commonly runs behind a self-signed dev certificate, so
//   the browser context ignores HTTPS errors.
// - Screenshots default to src/assets/screenshots/<file>; pass --out to divert
//   test runs elsewhere so they never land next to real, committed assets.

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { shots } from './screenshots.shots.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? true]
  })
)

const ADMIN_URL = (process.env.KATALON_ADMIN_URL ?? 'https://katalon.local/admin/').replace(/\/$/, '')
const EMAIL = process.env.KATALON_ADMIN_EMAIL
const PASSWORD = process.env.KATALON_ADMIN_PASSWORD
const OUT_DIR = resolve(repoRoot, args.out ?? 'src/assets/screenshots')

if (!EMAIL || !PASSWORD) {
  console.error('KATALON_ADMIN_EMAIL and KATALON_ADMIN_PASSWORD must be set.')
  process.exit(1)
}

const selected = shots.filter(s => !args.only || s.id === args.only)
if (selected.length === 0) {
  console.error(`No shot matches --only=${args.only}`)
  process.exit(1)
}

async function login(page) {
  await page.goto(ADMIN_URL + '/')
  await page.getByLabel('E-Mail').fill(EMAIL)
  await page.getByLabel('Passwort').fill(PASSWORD)
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.waitForURL(u => !u.pathname.endsWith('/login'), { timeout: 15000 }).catch(() => {})
  await page.waitForLoadState('networkidle')
}

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
    locale: 'de-DE',
  })
  const page = await context.newPage()

  console.log(`Logging into ${ADMIN_URL} as ${EMAIL}...`)
  await login(page)

  for (const shot of selected) {
    console.log(`[${shot.id}] navigating to ${shot.path}`)
    await page.goto(ADMIN_URL + shot.path)
    await page.waitForLoadState('networkidle')
    if (shot.before) await shot.before(page)
    if (shot.waitFor) await page.locator(shot.waitFor).first().waitFor({ timeout: 10000 })

    const outPath = join(OUT_DIR, shot.file)
    await mkdir(dirname(outPath), { recursive: true })
    const target = shot.selector ? page.locator(shot.selector) : page
    await target.screenshot({ path: outPath })
    console.log(`[${shot.id}] wrote ${outPath}`)
  }

  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
