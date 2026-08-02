import { QueryClient } from 'react-query'

// Yagona QueryClient (avval index.tsx va App.tsx da ikki marta yaratilardi -> cache dublikat).
// Xato toast'lari request.ts (axios) darajasida chiqadi, shuning uchun bu yerda qayta toast qo'ymaymiz.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 3 marta emas — xato bo'lsa tez to'xtaydi (sekinlik kamayadi)
      refetchOnWindowFocus: false, // oyna fokusida keraksiz qayta so'rov yubormaydi
      staleTime: 30_000 // 30s — bir sahifadan ikkinchisiga o'tib qaytganda darrov qayta yuklamaydi
    }
  }
})
