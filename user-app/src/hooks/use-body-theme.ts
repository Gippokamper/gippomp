import { useEffect } from 'react'
import type { Theme } from '../store/siteSlice/siteSlice'

/**
 * Ko'rinish rejimi sinfini haqiqiy <body> elementiga qo'yadi.
 *
 * Ilgari layoutlar React daraxti ichida <body> elementini render qilardi, ya'ni
 * hujjatda `<body><div id="root"><body class="dark">…` kabi ichma-ich body
 * hosil bo'lardi. Bu noto'g'ri HTML va haqiqiy <body> foni o'zgarmay qolardi —
 * tungi rejimda sahifa chetlarida oq chiziqlar ko'rinishi mumkin edi.
 *
 * `boolean` ham qabul qilinadi — eski chaqiruvlar buzilmasin.
 */
export function useBodyTheme(theme: Theme | boolean) {
  useEffect(() => {
    const value: Theme = typeof theme === 'boolean' ? (theme ? 'dark' : 'light') : theme

    document.body.classList.toggle('dark', value === 'dark')
    document.body.classList.toggle('sepia', value === 'sepia')
  }, [theme])
}
