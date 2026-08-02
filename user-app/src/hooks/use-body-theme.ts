import { useEffect } from 'react'

/**
 * Tungi rejim sinfini haqiqiy <body> elementiga qo'yadi.
 *
 * Ilgari layoutlar React daraxti ichida <body> elementini render qilardi, ya'ni
 * hujjatda `<body><div id="root"><body class="dark">…` kabi ichma-ich body
 * hosil bo'lardi. Bu noto'g'ri HTML va haqiqiy <body> foni o'zgarmay qolardi —
 * tungi rejimda sahifa chetlarida oq chiziqlar ko'rinishi mumkin edi.
 */
export function useBodyTheme(isDark: boolean) {
  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])
}
