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
import { applySpotlight } from './screenshots.helpers.mjs'

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

async function dismissOnboarding(page) {
  try {
    const skipBtn = page.getByRole('button', { name: /überspringen/i })
    if (await skipBtn.isVisible({ timeout: 2000 })) {
      await skipBtn.click()
      await page.waitForTimeout(500)
    }
  } catch {}
}

async function login(page) {
  await page.goto(ADMIN_URL + '/')
  await page.getByLabel('E-Mail').fill(EMAIL)
  await page.getByLabel('Passwort').fill(PASSWORD)
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.waitForURL(u => !u.pathname.endsWith('/login'), { timeout: 15000 }).catch(() => {})
  await page.waitForLoadState('networkidle')
  await dismissOnboarding(page)
}

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
    locale: 'de-DE',
  })
  console.log(`Logging into ${ADMIN_URL} as ${EMAIL}...`)
  let authToken = null
  context.on('request', req => {
    const auth = req.headers()['authorization']
    if (auth && auth.startsWith('Bearer ')) authToken = auth
  })

  const loginPage = await context.newPage()
  await login(loginPage)
  await loginPage.close()

  const apiBase = ADMIN_URL.replace(/\/admin\/?$/, '')
  async function setBannersActive(active) {
    if (!authToken) return
    try {
      const res = await context.request.get(`${apiBase}/v1/banners`, {
        headers: { Authorization: authToken }
      })
      if (res.ok()) {
        const banners = await res.json()
        for (const b of banners) {
          if (b.is_active !== active) {
            await context.request.put(`${apiBase}/v1/banners/${b.id}`, {
              headers: {
                Authorization: authToken,
                'Content-Type': 'application/json'
              },
              data: { is_active: active }
            })
          }
        }
      }
    } catch (err) {
      console.warn('Could not update banners via API:', err.message)
    }
  }

  // Ensure banners are inactive during regular screenshots
  await setBannersActive(false)

  const page = await context.newPage()
  try {
    for (const shot of selected) {
      console.log(`[${shot.id}] navigating to ${shot.path}`)
      const targetUrl = shot.path.startsWith('http://') || shot.path.startsWith('https://')
        ? shot.path
        : ADMIN_URL + shot.path
      await page.goto(targetUrl)
      await page.waitForTimeout(600)
      if (shot.before) await shot.before(page, { context, setBannersActive })
      if (shot.spotlight) {
        await applySpotlight(page, shot.spotlight.targets, shot.spotlight)
        await page.waitForTimeout(200)
      }
      if (shot.waitFor) await page.locator(shot.waitFor).first().waitFor({ timeout: 10000 })

      const outPath = join(OUT_DIR, shot.file)
      await mkdir(dirname(outPath), { recursive: true })
      const target = shot.selector ? page.locator(shot.selector) : page
      const screenshotOpts = { path: outPath }
      if (shot.clip) screenshotOpts.clip = shot.clip
      await target.screenshot(screenshotOpts)
      console.log(`[${shot.id}] wrote ${outPath}`)
      if (shot.after) await shot.after(page, { context, setBannersActive })
    }
  } finally {
    await page.close().catch(() => {})
    await setBannersActive(false)
    await browser.close()
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
