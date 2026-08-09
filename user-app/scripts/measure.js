/*
 * Sahifadagi "chrome" (sarlavha, mundarija, nom qatori) qancha vertikal joy
 * egallayotganini o'lchaydi — o'qish maydoniga qancha qolganini ko'rish uchun.
 *
 * Ishlatish: node scripts/measure.js /article/gastrit
 */
const { chromium } = require('playwright')
const path = require('path')

const OUT = path.join(__dirname, '..', '.screenshots')
const STATE = path.join(OUT, 'state.json')
const route = process.argv[2] || '/article/gastrit'

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    storageState: STATE
  })
  const page = await context.newPage()
  await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)

  const rows = await page.evaluate(() => {
    const pick = sel => {
      const el = document.querySelector(sel)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        sel,
        height: Math.round(r.height),
        top: Math.round(r.top),
        padding: `${cs.paddingTop} / ${cs.paddingBottom}`,
        margin: `${cs.marginTop} / ${cs.marginBottom}`
      }
    }
    return [
      pick('.side-logo'),
      pick('.header'),
      pick('.toc'),
      pick('.library-head'),
      pick('.library__title'),
      pick('.library-accordion')
    ].filter(Boolean)
  })

  console.log('viewport: 1600 x 900\n')
  console.log('element                 balandlik   tepadan   padding(t/b)      margin(t/b)')
  console.log('-'.repeat(82))
  rows.forEach(r =>
    console.log(
      `${r.sel.padEnd(22)}  ${String(r.height).padStart(6)}px  ${String(r.top).padStart(6)}px   ${r.padding.padEnd(16)}  ${r.margin}`
    )
  )

  const acc = rows.find(r => r.sel === '.library-accordion')
  if (acc) {
    const chrome = acc.top
    console.log(`\nkontent boshlangunicha: ${chrome}px  (${Math.round((chrome / 900) * 100)}% ekran)`)
    console.log(`o'qishga qolgan       : ${900 - chrome}px`)
  }

  await browser.close()
})()
