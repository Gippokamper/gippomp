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

function markAddInfoOnlyBlocks(html: string): string {
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

  return doc.body.innerHTML
}

interface IPrepareOptions {
  /** WithHtml'dagi eski xulq: yakka <span> larni <p> ga o'giradi. */
  spansToParagraphs?: boolean
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

  return markAddInfoOnlyBlocks(clean)
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
