/*
 * Qulflangan qo'shimcha ma'lumot taklifini tekshiradi.
 *
 * Ikki foydalanuvchi bilan: `info` ruxsati borida (sinov muddati) hech qanday
 * taklif chiqmasligi, ruxsat yo'qida (Standart tarif) esa bloklar o'rnida
 * taklif turishi kerak.
 *
 * Ishlatish: node scripts/check-addinfo-lock.js
 */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, '..', '.screenshots')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:3000'
const PASSWORD = 'Test12345'

const USERS = [
  { name: 'ruxsatli', phone: '901112233', expectLock: false },
  { name: 'qulflangan', phone: '902223344', expectLock: true }
]

async function login(page, phone) {
  await page.goto(BASE + '/sign-in', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  const field = page.locator('input').first()
  await field.click()
  await field.type(phone, { delay: 60 })
  await page.fill('input[type="password"]', PASSWORD)
  await page.click('button[type="submit"], form button')
  await page.waitForTimeout(5000)
}

;(async () => {
  const browser = await chromium.launch()

  for (const user of USERS) {
    // Har foydalanuvchi uchun toza kontekst — sessiyalar aralashmasin.
    const context = await browser.newContext({ viewport: { width: 1600, height: 900 } })
    const page = await context.newPage()

    await login(page, user.phone)

    for (const theme of ['light', 'sepia', 'dark']) {
      await page.goto(BASE + '/article/gastrit', { waitUntil: 'domcontentloaded' })
      await page.evaluate(t => window.localStorage.setItem('theme', t), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(2500)

      /*
       * Barcha bo'limlarni ochamiz — taklif qaysi bo'limda ekani noma'lum.
       * Faqat YOPIQlarini bosamiz: ochiq bo'limni bosish uni yopib yuborardi
       * va natija ishga tushirishdan ishga tushirishga o'zgarardi.
       */
      const items = page.locator('.library-accordion__item')
      const total = await items.count()
      for (let i = 0; i < total; i++) {
        const item = items.nth(i)
        const cls = (await item.getAttribute('class')) || ''
        if (!cls.includes('active')) {
          await item.locator('.library-accordion__head').click()
          await page.waitForTimeout(150)
        }
      }
      await page.waitForTimeout(1500)

      const state = await page.evaluate(() => {
        const cards = document.querySelectorAll('.addinfo-lock--card')
        const pills = document.querySelectorAll('.addinfo-lock--inline')
        const lockedBtn = document.querySelector('.reader-tools__btn--locked')
        const firstCard = cards[0]
        return {
          cards: cards.length,
          pills: pills.length,
          hiddenU: document.querySelectorAll('.dangerous u').length,
          addinfoOnly: document.querySelectorAll('.dangerous .addinfo-only').length,
          toolbarLocked: !!lockedBtn,
          cardText: firstCard ? firstCard.textContent.replace(/\s+/g, ' ').trim().slice(0, 90) : null,
          pillText: pills[0] ? pills[0].textContent.replace(/\s+/g, ' ').trim().slice(0, 70) : null
        }
      })

      const ok = user.expectLock ? state.cards + state.pills > 0 : state.cards + state.pills === 0
      console.log(
        `${user.name.padEnd(11)} ${theme.padEnd(6)} kartochka=${state.cards} lenta=${state.pills} ` +
          `qolgan<u>=${state.hiddenU} addinfo-only=${state.addinfoOnly} panel-qulf=${state.toolbarLocked} ${ok ? 'OK' : 'XATO'}`
      )
      if (state.cardText) console.log(`             kartochka: "${state.cardText}"`)
      if (state.pillText) console.log(`             lenta    : "${state.pillText}"`)

      if (user.expectLock) {
        const el = page.locator('.addinfo-lock--card, .addinfo-lock--inline').first()
        if (await el.count()) {
          await el.scrollIntoViewIfNeeded()
          await page.waitForTimeout(400)
          const box = await el.boundingBox()
          if (box) {
            await page.screenshot({
              path: path.join(OUT, `lock-${theme}.png`),
              clip: {
                x: Math.max(0, box.x - 40),
                y: Math.max(0, box.y - 120),
                width: Math.min(1600 - Math.max(0, box.x - 40), 1100),
                height: Math.min(360, 900 - Math.max(0, box.y - 120))
              }
            })
          }
        }
      }
    }

    await context.close()
  }

  await browser.close()
})()
