// Helper utilities for the screenshot pipeline.

/**
 * Injects a smooth SVG mask overlay to dim the entire page while keeping
 * specified target elements brightly highlighted with optional border rings.
 *
 * @param {import('playwright').Page} page
 * @param {string|import('playwright').Locator|Array<string|import('playwright').Locator>} targets
 * @param {object} [options]
 * @param {number} [options.padding=8]
 * @param {number} [options.radius=8]
 * @param {number} [options.opacity=0.52]
 * @param {string} [options.borderColor='#38bdf8']
 * @param {number} [options.borderWidth=2]
 */
export async function applySpotlight(page, targets, options = {}) {
  const {
    padding = 8,
    radius = 8,
    opacity = 0.52,
    borderColor = '#38bdf8',
    borderWidth = 2,
  } = options

  const targetList = Array.isArray(targets) ? targets : [targets]
  const rects = []

  for (const target of targetList) {
    if (typeof target === 'string') {
      const locators = await page.locator(target).all()
      for (const loc of locators) {
        if (await loc.isVisible().catch(() => false)) {
          const box = await loc.boundingBox().catch(() => null)
          if (box) rects.push(box)
        }
      }
    } else if (target && typeof target.all === 'function') {
      const locators = await target.all().catch(() => [])
      for (const loc of locators) {
        if (await loc.isVisible().catch(() => false)) {
          const box = await loc.boundingBox().catch(() => null)
          if (box) rects.push(box)
        }
      }
    } else if (target && typeof target.boundingBox === 'function') {
      const box = await target.boundingBox().catch(() => null)
      if (box) rects.push(box)
    } else if (target && typeof target.x === 'number') {
      rects.push(target)
    }
  }

  await page.evaluate(({ rects, padding, radius, opacity, borderColor, borderWidth }) => {
    const existing = document.getElementById('__screenshot_spotlight__')
    if (existing) existing.remove()
    if (rects.length === 0) return

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = '__screenshot_spotlight__'
    svg.setAttribute('width', '100vw')
    svg.setAttribute('height', '100vh')
    svg.style.position = 'fixed'
    svg.style.top = '0'
    svg.style.left = '0'
    svg.style.width = '100vw'
    svg.style.height = '100vh'
    svg.style.pointerEvents = 'none'
    svg.style.zIndex = '999999'

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
    mask.id = '__spotlight_mask__'

    const baseWhite = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    baseWhite.setAttribute('width', '100%')
    baseWhite.setAttribute('height', '100%')
    baseWhite.setAttribute('fill', 'white')
    mask.appendChild(baseWhite)

    for (const r of rects) {
      const cutout = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      cutout.setAttribute('x', String(Math.max(0, r.x - padding)))
      cutout.setAttribute('y', String(Math.max(0, r.y - padding)))
      cutout.setAttribute('width', String(r.width + padding * 2))
      cutout.setAttribute('height', String(r.height + padding * 2))
      cutout.setAttribute('rx', String(radius))
      cutout.setAttribute('ry', String(radius))
      cutout.setAttribute('fill', 'black')
      mask.appendChild(cutout)
    }
    defs.appendChild(mask)
    svg.appendChild(defs)

    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    overlay.setAttribute('width', '100%')
    overlay.setAttribute('height', '100%')
    overlay.setAttribute('fill', `rgba(15, 23, 42, ${opacity})`)
    overlay.setAttribute('mask', 'url(#__spotlight_mask__)')
    svg.appendChild(overlay)

    if (borderWidth > 0 && borderColor) {
      for (const r of rects) {
        const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        border.setAttribute('x', String(Math.max(0, r.x - padding)))
        border.setAttribute('y', String(Math.max(0, r.y - padding)))
        border.setAttribute('width', String(r.width + padding * 2))
        border.setAttribute('height', String(r.height + padding * 2))
        border.setAttribute('rx', String(radius))
        border.setAttribute('ry', String(radius))
        border.setAttribute('fill', 'none')
        border.setAttribute('stroke', borderColor)
        border.setAttribute('stroke-width', String(borderWidth))
        svg.appendChild(border)
      }
    }

    document.body.appendChild(svg)
  }, { rects, padding, radius, opacity, borderColor, borderWidth })
}
