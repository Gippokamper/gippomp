# Adminka yaxshilash rejasi

Maqsad: **Kontent** modulida qilingan yaxshilanishlarni qolgan modullarga ham
bosqichma-bosqich yoyish. Har bir modul bir xil qolip (drill-down + inline
formalar + bitta saqlash + soddalashtirilgan maydonlar) bo'yicha qayta yig'iladi.

---

## 1. Bajarildi — Kontent moduli (etalon)

`admin/src/pages/content/` — namuna sifatida shu qoladi:

- **Drill-down navigatsiya:** Kontent → kategoriya → ichki kategoriya → maqola.
  Menyuda bitta kirish nuqtasi, ichiga bosib kirasiz, tepada yo'lchi (breadcrumb).
- **Inline forma:** kategoriya ro'yxat ichida yaratiladi/tahrirlanadi (alohida
  panel emas).
- **Bitta saqlash:** yangi maqola = nom + matn birga, bir «Saqlash».
- **UZ/RU/EN** til almashtirgich.
- **Soddalashtirish:** «Tartib» olib tashlandi (avtomatik), keraksiz maydonlar
  yashirildi.
- **Premium:** butun maqola — переключатель; bir qismi — matnda «Premium»
  tugmasi (`<u>`, ilova o'zi qulflaydi).
- **Pickerlar:** eslatma/rasm — tanlanganda matnга avtomatik tushadi;
  test — QBank paketi nomi bo'yicha.
- **Muharrir** ochiq CDN'dan (domen qulfi yo'q).

---

## 2. Umumiy tamoyillar (har modulga qo'llanadi)

Har modulni ko'chirishda shu qoidalar:

1. **Drill-down:** papka/kategoriya → element, ichiga kirib borish + breadcrumb.
2. **Inline yaratish/tahrirlash** ro'yxat ichida (alohida sahifa/panel emas).
3. **Bitta saqlash** — imkon boricha bir bosishда.
4. **UZ/RU/EN** — barcha ko'p tilli maydonlarga bitta til almashtirgich.
5. **Keraksiz maydonlarni yashirish/olib tashlash** (Tartib → avtomatik; texnik
   ID lar → nomi bo'yicha picker).
6. **Xato bo'lganda ma'lumot yo'qolmaydi**, saqlashда tugma bloklanadi.
7. **Backend'ga tegmasdan** (mavjud endpoint'lar), tegish kerak bo'lsa — alohida
   belgilab, migratsiya orqali.
8. Eski sahifa ishlaganига ishonch bo'lgachgina menyudan olib tashlanadi.

---

## 3. Modullar bo'yicha reja (prioritet tartibida)

### 3.1. Videolar  ⭐ birinchi (eng oson)
- **Nega birinchi:** Kontentga eng o'xshashi — kategoriya → video.
- **Ekranlar:** V1 video-kategoriyalar → V2 kategoriya ichi (ichki kategoriyalar
  + videolar).
- **Video formasi:** nom (UZ/RU/EN), **havola (YouTube)**, kategoriya (kontekstdan),
  premium. Tartib — avtomatik.
- Backend: mavjud (`video_categories`, `videos`) — o'zgarish shart emas.
- Eski: `video-category`, `videos` sahifalari keyin olib tashlanadi.

### 3.2. Testlar tizimi (Question Folders + Quizzes)  ⭐⭐
- **Nega:** QBank shu yerdan keladi; kontent bilan bog'liq.
- **Question Folders (QBank):**
  - Ekranlar: papkalar → ichki papkalar → savollar → savol muharriri.
  - Savol muharriri: savol matni (UZ/RU/EN, rasm), **javoblar** (to'g'ri/xato),
    qo'shimcha ma'lumot. Hozirgi forma murakkab — soddalashtiriladi.
- **Quizzes:** kategoriya → testlar → test ichidagi savol bloklari.
  - Savollarni QBank pickeri orqali biriktirish (Kontentдagi kabi).
- Backend: mavjud. Diqqat — bo'lim (block) bog'lanishlari.

### 3.3. O'quv rejalari (Study Plans)  ⭐⭐
- Ekranlar: papkalar → rejalar → reja muharriri.
- Reja muharriri: nom/info (UZ/RU/EN), **maqolalar** (Kontentдan picker) +
  **testlar** (QBank picker) birlashtiriladi.
- Hozirgi forma eng og'iri — drill-down + picker bilan yengillashtiriladi.
- Backend: mavjud.

### 3.4. News / Labs  ⭐ (kichik, tez)
- Drill-down shart emas — oddiy ro'yxat + forma.
- Faqat forma tozalanadi: UZ/RU/EN yaxshi, muharrir CDN'dan (allaqachon),
  saqlash bitta, keraksiz maydonlar yo'q.
- News: sana + «actual» — allaqachon tuzatilgan; ko'rinishni sayqallash.

### 3.5. Sozlamalar bo'limi  ⭐ (oxirida, kam ishlatiladi)
- Translations, Landing (images/videos/categories), Partners, FAQ, Privacy.
- Oddiy ro'yxat/forma — faqat tartib va tushunarli yorliqlar.
- Tariffs — imkoniyatlar (advantages) formasini soddalashtirish.

### Holati yaxshi (hozircha tegilmaydi)
- **Users, Messages** — allaqachon qayta yig'ilgan.

---

## 4. Har modul uchun checklist

Modulni "tayyor" deyishдan oldin:

- [ ] Drill-down + breadcrumb ishlaydi
- [ ] Inline yaratish/tahrirlash
- [ ] Bitta saqlash, tugma saqlashда bloklanadi
- [ ] UZ/RU/EN barcha maydonlarda
- [ ] Keraksiz maydonlar yo'q (Tartib avtomatik, ID → picker)
- [ ] Ro'yxat so'rovlari to'g'ri kalitда (cache to'qnashuvi yo'q)
- [ ] `npx tsc --noEmit` toza
- [ ] `CI=true npx react-scripts build` toza (Vercel bilan bir xil)
- [ ] Brauzerда sinab ko'rilgan (foydalanuvchi tomonidan)
- [ ] Ishlagach — eski route/menyu olib tashlanadi

---

## 5. Tozalash (yakunда)

Barcha modullar ko'chgach:
- Eski sahifalar o'chiriladi: `pages/category`, `pages/articles`, `pages/comments`,
  `pages/images`, `pages/chapter`, `pages/video-category`, `pages/videos`,
  `pages/question-folder/*`, `pages/quizzes*`, `pages/study-plan*`.
- Ishlatilmaydigan komponentlar: `components/Table`, `context/TableFilterContext`,
  `pages/content/CategoryDrawer` (inline formaга o'tildi).
- `App.tsx` va `navData.tsx` — eski route/menyu qatorlari.

---

## 6. Qaysidan boshlaymiz — tavsiya

**Tartib:** Videolar → Testlar → O'quv rejalari → News/Labs → Sozlamalar.

**Sabab:** Videolar Kontentга eng yaqin — qolipни tez sinaymiz va ishonch hosil
qilamiz. Keyin murakkabroqlari (Testlar, Rejalar), oxirида mayda tozalashlar.

**Birinchi qadam:** Videolar modulини `pages/content/` qolipида yig'ish
(V1/V2 + video formasi). Tayyor bo'lgach — brauzerда sinab, keyingisiga o'tamiz.
