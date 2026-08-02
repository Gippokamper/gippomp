# Gippokamp v2 — Frontend (React)

Bu loyiha `app.gippokamp.uz` saytining **manba kodi**dir. U dasturchilardan olinmagan —
saytning o'zidan (source map orqali) tiklangan.

## Nima uchun tiklash kerak bo'ldi

`app.gippokamp.uz` serverга **development (ishlab chiqish) rejimida** qo'yilgan edi
(`webpack-dev-server`, bundle 6.83 MB). Shu sababli manba kod (`bundle.js.map`)
internetда ochiq turgan va undan loyihani qayta yig'ish imkoni bo'ldi.

## Texnologiyalar

| | |
|---|---|
| Asos | React 18 + TypeScript (Create React App) |
| Holat (state) | Redux Toolkit |
| So'rovlar | axios + react-query |
| Formalar | react-hook-form + yup |
| Tillar | i18next (uz / ru / en) |
| Uslub | SCSS |
| Backend API | `https://api.gippokamp.uz/api/v1` |

## Ishga tushirish

```bash
npm install
cp .env.example .env      # kerak bo'lsa manzillarni o'zgartiring
npm start                 # http://localhost:3000
```

Ishlab chiqarish uchun yig'ish:

```bash
npm run build             # build/ papkasi hosil bo'ladi
```

> ⚠️ **Muhim:** serverga **hech qachon `npm start` bilan qo'ymang.**
> Faqat `npm run build` natijasini (`build/` papkasini) joylang.
> Hozirgi sayt aynan shu xatoga yo'l qo'ygan: 13 barobar og'ir, sekin va manba kod ochiq.

## Loyiha tuzilmasi

```
src/
├── components/     # qayta ishlatiladigan komponentlar (25+)
├── pages/          # sahifalar (home, news, quizzes, videos, account, ...)
├── layouts/        # umumiy karkaslar (header, footer, sidebar)
├── store/          # Redux slice'lar (html, quiz, site)
├── helpers/        # request.ts — API mijozi
├── configs/        # i18n sozlamasi
├── providers/      # context provider'lar
├── data/           # nav_data, router_data, Lottie animatsiya
├── img/ + fonts/   # rasm, ikonka va Gilroy shriftlari
└── css/            # umumiy uslublar
```

## Tiklash haqida — nima to'liq, nima yo'q

**Tiklandi (to'liq):**
- 166 ta manba fayl (110 `.tsx`, 13 `.ts`, SCSS va boshqalar)
- 35 ta resurs: Gilroy shriftlari (12), SVG ikonkalar, Lottie animatsiya
- `public/` fayllari (index.html, manifest.json, favicon)

**Qayta yozilgan (asl nusxasi bundle'ga tushmagan):**
- `src/img/icons/FullScreenIcon.tsx` — shakli `fullscreen.svg` dan aynan olindi
- `src/img/news-slider.jpg` — **placeholder**, asl rasmni almashtirish kerak

**Taxminiy (aniqlashtirish kerak):**
- `package.json` — kutubxonalar ro'yxati bundle'dan aniqlandi (75 ta paket),
  lekin **versiyalar taxminiy**. `npm install` dan keyin loyiha ishlashini tekshiring.
- `tsconfig.json` — CRA standarti asosida yozildi

**Yo'q:**
- `.git` tarixi (kommitlar tarixi tiklanmaydi)
- Test fayllari (agar bo'lgan bo'lsa)
