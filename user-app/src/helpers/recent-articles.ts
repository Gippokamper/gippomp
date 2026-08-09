/*
 * Oxirgi ochilgan maqolalar — bosh sahifadagi "Davom ettirish" bloki uchun.
 *
 * Serverda o'qish tarixi yo'q, shuning uchun ro'yxat brauzer xotirasida
 * saqlanadi: maqola sahifasi ochilganda `rememberArticle` chaqiriladi.
 * Xotira taqiqlangan bo'lsa (private rejim, cookie bloklangan) — jim o'tamiz,
 * blok shunchaki ko'rinmaydi.
 */

const KEY = 'gippokamp:recent-articles'
const LIMIT = 8

export interface IRecentArticle {
  slug: string
  /** Ko'p tilli nom — qaysi til tanlanganiga qarab ko'rsatiladi. */
  name: Record<string, string>
  /** Oxirgi ochilgan vaqt (ms). */
  at: number
}

export const readRecentArticles = (): IRecentArticle[] => {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list.filter(item => item?.slug).slice(0, LIMIT) : []
  } catch {
    return []
  }
}

export const rememberArticle = (article: { slug?: string; name?: Record<string, string> }) => {
  if (!article?.slug) return

  const entry: IRecentArticle = {
    slug: article.slug,
    name: article.name ?? {},
    at: Date.now()
  }

  try {
    const next = [entry, ...readRecentArticles().filter(item => item.slug !== entry.slug)].slice(0, LIMIT)
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // xotira mavjud emas — tarix saqlanmaydi, boshqa oqibati yo'q
  }
}
