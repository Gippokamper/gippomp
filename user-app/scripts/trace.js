/*
 * Sahifadagi muvaffaqiyatsiz so'rovlarni va yo'naltirishlarni ko'rsatadi.
 *
 * Ishlatish: node scripts/trace.js /article/gastrit
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

  page.on('response', r => {
    if (r.status() >= 400) console.log(`  ${r.status()}  ${r.request().method()}  ${r.url()}`)
  })
  page.on('framenavigated', f => {
    if (f === page.mainFrame()) console.log(`  -> ${f.url()}`)
  })

  console.log('so\'rovlar va yo\'naltirishlar:')
  await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)

  console.log(`\nyakuniy URL: ${page.url()}`)
  await browser.close()
})()
