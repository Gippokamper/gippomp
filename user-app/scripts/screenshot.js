/*
 * Lokal ilovani brauzerda ochib skrinshot oladi.
 *
 * Ishlatish:  node scripts/screenshot.js <nom> <yo'l>
 * Masalan:    node scripts/screenshot.js article /article/gastrit
 *
 * Oldindan lokal muhit ko'tarilgan bo'lishi kerak:
 *   MariaDB :3306, Laravel :8000, `npm start` :3000
 *
 * Kirish bir marta bajariladi va sessiya `state.json` ga saqlanadi —
 * keyingi chaqiruvlarda qayta kirilmaydi.
 */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

// Suratlar shu papkaga tushadi (git tomonidan e'tiborga olinmaydi).
const OUT = path.join(__dirname, '..', '.screenshots')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })
const STATE = path.join(OUT, 'state.json')
const BASE = 'http://localhost:3000'
const PHONE = '901112233'
const PASSWORD = 'Test12345'

const name = process.argv[2] || 'page'
const route = process.argv[3] || '/home'
const width = Number(process.argv[4] || 1440)
const height = Number(process.argv[5] || 900)

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width, height },
    storageState: fs.existsSync(STATE) ? STATE : undefined
  })
  const page = await context.newPage()

  const errors = []
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 160))
  })

  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)

  // Kirish sahifasiga tashlab yuborilgan bo'lsa — kiramiz
  if (page.url().includes('/sign-in')) {
    // Telefon maydoni maskali — `fill` ishlamaydi, belgima-belgi teramiz.
    const phone = page.locator('input').first()
    await phone.click()
    await phone.type(PHONE, { delay: 60 })
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"], form button')
    await page.waitForTimeout(5000)
    await context.storageState({ path: STATE })
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2500)
  }

  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file, fullPage: false })

  console.log('URL   :', page.url())
  console.log('rasm  :', file)
  if (errors.length) {
    console.log('konsol xatolari:')
    errors.slice(0, 6).forEach(e => console.log('  -', e))
  }

  await browser.close()
})()
