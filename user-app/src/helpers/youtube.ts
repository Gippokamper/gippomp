/*
 * YouTube havolalari bilan ishlash.
 *
 * Bazadagi havolalar bir xil ko'rinishda emas: `youtube.com/watch?v=...`,
 * `youtu.be/...`, `embed/...` — hammasi uchraydi. Ilgari faqat `youtu.be/`
 * kesib olinardi va qolgan ko'rinishlarda video ochilmasdi (`embed/undefined`).
 */

const PATTERNS = [
  /[?&]v=([\w-]{11})/, // youtube.com/watch?v=ID
  /youtu\.be\/([\w-]{11})/, // youtu.be/ID
  /\/embed\/([\w-]{11})/, // youtube.com/embed/ID
  /\/shorts\/([\w-]{11})/, // youtube.com/shorts/ID
  /\/live\/([\w-]{11})/ // youtube.com/live/ID
]

/** Havoladan 11 belgili YouTube ID. Tanib bo'lmasa — bo'sh satr. */
export const youtubeId = (url?: string | null): string => {
  if (!url) return ''

  for (const pattern of PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return ''
}

/**
 * Muqova rasmi. YouTube uni bepul beradi, shuning uchun bazaga alohida
 * rasm maydoni qo'shish shart emas.
 */
export const youtubeThumb = (url?: string | null): string => {
  const id = youtubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

/** Modal ichidagi pleyer uchun manzil. */
export const youtubeEmbed = (url?: string | null): string => {
  const id = youtubeId(url)
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : ''
}
