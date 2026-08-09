/*
 * Maqola sahifasini uch rejimda va aylantirilgan holatda tekshiradi:
 * yopishqoq sarlavha o'z joyida qolyaptimi, mundarija tasmasi ko'rinyaptimi.
 *
 * Ishlatish: node scripts/check-article.js
 */
const { chromium } = require('playwright')
const path = require('path')

const OUT = path.join(__dirname, '..', '.screenshots')
const STATE = path.join(OUT, 'state.json')
const ROUTE = 'http://localhost:3000/article/gastrit'

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    storageState: STATE
  })
  const page = await context.newPage()

  for (const theme of ['light', 'sepia', 'dark']) {
    await page.goto(ROUTE, { waitUntil: 'domcontentloaded' })
    await page.evaluate(t => window.localStorage.setItem('theme', t), theme)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2500)

    // Birinchi bo'limni ochamiz — ichida aylantiradigan matn paydo bo'lsin
    const first = page.locator('.library-accordion__head').first()
    if (await first.count()) {
      await first.click()
      await page.waitForTimeout(900)
    }
    await page.mouse.move(800, 500)
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(600)

    const state = await page.evaluate(() => {
      const box = sel => {
        const el = document.querySelector(sel)
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { top: Math.round(r.top), height: Math.round(r.height) }
      }
      return { toc: box('.toc'), head: box('.library-head'), theme: document.body.className }
    })

    console.log(
      `${theme.padEnd(6)} body="${state.theme}"  toc=${JSON.stringify(state.toc)}  head=${JSON.stringify(state.head)}`
    )
    await page.screenshot({ path: path.join(OUT, `article-${theme}.png`) })
  }

  await browser.close()
})()
