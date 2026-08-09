/* Bosh sahifadagi qidiruvni yozib, natijani suratga oladi. */
const { chromium } = require('playwright')
const path = require('path')

const OUT = path.join(__dirname, '..', '.screenshots')
const STATE = path.join(OUT, 'state.json')

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: STATE })
  const page = await context.newPage()

  await page.goto('http://localhost:3000/home', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)

  const box = page.locator('.find-box input')
  await box.click()
  await box.type('gastrit', { delay: 80 })
  await page.waitForTimeout(2500)

  await page.screenshot({ path: path.join(OUT, 'search.png') })
  console.log('rasm:', path.join(OUT, 'search.png'))

  await browser.close()
})()
