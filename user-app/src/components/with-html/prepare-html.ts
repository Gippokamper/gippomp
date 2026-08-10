import DOMPurify from 'dompurify'

/**
 * Maqola/izoh HTML'ini ekranga chiqarishga tayyorlash.
 *
 * Bu mantiq ilgari WithHtml va WithTooltip'da ikki nusxada yotardi (o'zaro
 * biroz farqlar bilan), shuning uchun bir joyga yig'ildi.
 */

/**
 * Faqat `style="..."` atributi ichidagi pt/px o'lchovlarini em'ga o'giradi.
 *
 * Ilgari almashtirish butun HTML matni bo'ylab ishlardi — `src="icon-24px.webp"`
 * kabi fayl nomlari, sinf nomlari va data-atributlari ham buzilardi.
 */
function convertInlineUnits(html: string): string {
  return html.replace(/style="([^"]*)"/gi, (_whole, styleValue: string) => {
    const converted = styleValue
      .replace(/(\d+(?:\.\d+)?)pt/g, (_m, value: string) => `${(parseFloat(value) * 1.33333) / 16}em`)
      .replace(/(\d+(?:\.\d+)?)px/g, (_m, value: string) => `${parseFloat(value) / 16}em`)
    return `style="${converted}"`
  })
}

/**
 * Ichida faqat qo'shimcha ma'lumot (<u>) bo'lgan bloklarga `addinfo-only`
 * sinfini qo'yadi.
 *
 * Nima uchun kerak: qo'shimcha ma'lumot `<li><u><span>…</span></u></li>`
 * ko'rinishida yoziladi. `<u>` yashirilganda `<li>` o'zi qolaveradi va
 * matnsiz nuqta bo'lib ko'rinadi; xuddi shunday bo'sh `<p>` esa keraksiz
 * vertikal oraliq qoldiradi.
 *
 * Buni sof CSS bilan hal qilib bo'lmaydi: selektorlar matn tugunlarini
 * ko'rmaydi, shuning uchun "ichida <u> dan boshqa hech narsa yo'q" shartini
 * tekshirib bo'lmaydi. Shu sababli belgilash HTML tayyorlash bosqichida.
 */
const BLOCK_SELECTOR = 'p, li, ul, ol, div, blockquote, h1, h2, h3, h4, h5, h6'

function markAddInfoOnlyBlocks(html: string, lockLabels?: ILockLabels): string {
  // `<ul` ham shu shartga tushadi — bu faqat tezlik uchun qo'pol filtr,
  // noto'g'ri o'tgan holatda quyidagi tekshiruv baribir hech narsa topmaydi.
  if (!html.includes('<u')) {
    return html
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')

  // Teskari hujjat tartibida: ichki bloklar avval belgilansin, shunda tashqi
  // blok "ichimda belgilanganlardan boshqa hech narsa yo'q" deb topa oladi.
  const blocks = Array.from(doc.querySelectorAll(BLOCK_SELECTOR)).reverse()

  blocks.forEach(block => {
    if (!block.querySelector('u')) {
      return
    }

    const clone = block.cloneNode(true) as HTMLElement
    clone.querySelectorAll('u, .addinfo-only').forEach(el => el.remove())

    const hasText = (clone.textContent ?? '').trim().length > 0
    const hasMedia = clone.querySelector('img, svg, table, iframe, video') !== null

    if (!hasText && !hasMedia) {
      block.classList.add('addinfo-only')
    }
  })

  // Belgilash tugagach — qulflangan foydalanuvchi uchun taklifga almashtirish.
  // Bir hujjatda ikkalasi ham bajariladi: qayta tahlil qilish shart emas.
  if (lockLabels) {
    replaceAddInfoWithTeasers(doc, lockLabels)
  }

  return doc.body.innerHTML
}

/**
 * Qulflangan qo'shimcha ma'lumot o'rniga qo'yiladigan taklif ("teaser").
 *
 * Nega kerak: `info` ruxsati yo'q foydalanuvchida `<u>` bloklari shunchaki
 * yo'qoladi — o'quvchi na yashiringan narsa borligini, na uni qanday ochishni
 * biladi. Kontentning o'zi ko'rsatilmaydi, faqat nechta band borligi.
 *
 * Yorliqlar tashqaridan beriladi: bu fayl sof, i18n'ga bog'liq emas.
 */
export interface ILockLabels {
  /** Kartochka sarlavhasi, mas. "Qo'shimcha ma'lumot". */
  title: string
  /** Ochish sharti, mas. "Premiumda ochiladi". */
  note: string
  /** Tugma yozuvi, mas. "Premiumga o'tish". */
  cta: string
  /**
   * Band soni bilan, mas. "Yana %n% ta band". `%n%` shu yerda almashtiriladi.
   * `{{count}}` emas: i18next `{{...}}` ni o'zi ushlab, qiymat berilmagani
   * uchun yo'qotib qo'yardi.
   */
  more: string
}

const LOCK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="3" y="11" width="18" height="11" rx="2"></rect>' +
  '<path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const withCount = (template: string, count: number): string =>
  escapeHtml(template.replace(/%n%/g, String(count)))

/**
 * Belgilangan `addinfo-only` bloklarni taklif elementlariga almashtiradi.
 *
 * Ketma-ket kelgan bloklar bitta taklifga birlashtiriladi: real kontentda
 * bir joyda 9 tagacha yashirin band uchraydi va har biri uchun alohida
 * kartochka chiqarish maqolani taklif devoriga aylantirardi.
 *
 * Ikki ko'rinish — blok turiga qarab:
 *   `li`  → ro'yxat ichidagi ixcham lenta (band o'rnini bosadi)
 *   qolgan → alohida kartochka (paragraf/blok o'rnini bosadi)
 */
function replaceAddInfoWithTeasers(doc: Document, labels: ILockLabels): void {
  const blocks = Array.from(doc.querySelectorAll('.addinfo-only'))
    // Ichma-ich belgilanganlarning faqat eng tashqisi kerak.
    .filter(el => !el.parentElement?.closest('.addinfo-only'))

  const handled = new Set<Element>()

  blocks.forEach(block => {
    if (handled.has(block)) {
      return
    }

    // Yonma-yon turgan qulflangan bloklarni bitta guruhga yig'amiz.
    const run: Element[] = [block]
    handled.add(block)

    let next = block.nextElementSibling
    while (next && next.classList.contains('addinfo-only')) {
      run.push(next)
      handled.add(next)
      next = next.nextElementSibling
    }

    // `ul`/`ol` bo'lsa ichidagi bandlar sanaladi — foydalanuvchi uchun
    // "1 ta ro'yxat" emas, "5 ta band" ma'noliroq.
    const count = run.reduce((total, el) => {
      const items = el.tagName === 'UL' || el.tagName === 'OL' ? el.querySelectorAll(':scope > li').length : 0
      return total + (items || 1)
    }, 0)

    const isListItem = run[0].tagName === 'LI'
    const teaser = doc.createElement(isListItem ? 'li' : 'div')
    teaser.className = isListItem ? 'addinfo-lock addinfo-lock--inline' : 'addinfo-lock addinfo-lock--card'

    if (isListItem) {
      teaser.innerHTML =
        `<button type="button" class="lock-pill" data-addinfo-lock>${LOCK_ICON}` +
        `<b>${withCount(labels.more, count)}</b>` +
        `<i>${escapeHtml(labels.note)} &rarr;</i></button>`
    } else {
      teaser.innerHTML =
        `<span class="lock-card__ico">${LOCK_ICON}</span>` +
        '<span class="lock-card__text">' +
        `<span class="lock-card__title">${escapeHtml(labels.title)}</span>` +
        `<span class="lock-card__hint">${withCount(labels.more, count)} &middot; ${escapeHtml(labels.note)}</span>` +
        '</span>' +
        `<button type="button" class="lock-card__cta" data-addinfo-lock>${escapeHtml(labels.cta)}</button>`
    }

    run[0].parentNode?.insertBefore(teaser, run[0])
    run.forEach(el => el.remove())
  })
}

interface IPrepareOptions {
  /** WithHtml'dagi eski xulq: yakka <span> larni <p> ga o'giradi. */
  spansToParagraphs?: boolean
  /**
   * `info` ruxsati yo'q foydalanuvchi uchun: qo'shimcha ma'lumot bloklari
   * taklif elementlariga almashtiriladi. Berilmasa — eski xulq (yashirish).
   */
  lockLabels?: ILockLabels
}

export function prepareArticleHtml(html: string | undefined, options: IPrepareOptions = {}): string {
  if (!html) {
    return ''
  }

  let result = options.spansToParagraphs ? html.replace(/<span>(.*?)<\/span>/g, '<p>$1</p>') : html

  result = convertInlineUnits(result)
    .replaceAll('color: black;', '')
    .replaceAll('color: windowtext;', '')
    .replaceAll('color: rgb(0, 0, 0);', '')
    .replaceAll('background: white;', '')
    // Keng jadvallar gorizontal scroll uchun o'raladi. Ilgari bu yerda id
    // berilardi — bir maqolada bir nechta jadval bo'lsa ID takrorlanardi.
    .replace(/<table/g, '<div class="table-wrapper"><table')
    .replace(/<\/table>/g, '</table></div>')

  // Kontent admin panelidan keladi, lekin server javobini baribir
  // to'g'ridan-to'g'ri DOM'ga qo'ymaymiz.
  const clean = DOMPurify.sanitize(result, { ADD_ATTR: ['target'] })

  return markAddInfoOnlyBlocks(clean, options.lockLabels)
}

interface IModeOptions {
  isQuiz?: boolean
  openMarker?: boolean
  showMarker?: boolean
  showAddInfo?: boolean
}

/**
 * "Qo'shimcha ma'lumot" va "Marker" rejimlari uchun konteyner sinflari.
 *
 * Ilgari bu inline style bilan qilinardi: har render'da butun hujjatdagi
 * <u> elementlari aylanib chiqilardi. Endi holat sinf orqali beriladi,
 * ko'rinishni content.scss hal qiladi.
 */
export function articleModeClasses(options: IModeOptions): string {
  const showMarker = options.isQuiz ? options.openMarker : options.showMarker

  return [options.isQuiz ? 'is-quiz' : '', showMarker ? 'show-marker' : '', options.showAddInfo ? 'show-addinfo' : '']
    .filter(Boolean)
    .join(' ')
}

/**
 * Maqola ichidagi <a> larni izoh (tooltip) yoki rasm havolasiga aylantiradi.
 * Faqat berilgan konteyner ichida ishlaydi.
 */
export function wireArticleAnchors(root: HTMLElement | null): void {
  if (!root) {
    return
  }

  Array.from(root.getElementsByTagName('a')).forEach(anchor => {
    const href = anchor.getAttribute('href')
    if (!href) {
      return
    }

    const parts = href.split('/')
    const dashboardPath = '/dashboard' + href.split('dashboard')[1]

    if (parts.some(part => part === 'article_note_text')) {
      anchor.setAttribute('data-some-relevant-attr', dashboardPath)
      anchor.setAttribute('data-tooltip-id', 'my-tooltip')
      anchor.removeAttribute('href')
    } else if (parts.some(part => part === 'article_note_photos')) {
      anchor.setAttribute('photo-url', dashboardPath)
      anchor.classList.add('photo-link')
      anchor.removeAttribute('href')
    }
  })
}
