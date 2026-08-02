import axios from 'axios'
import { toast } from 'react-hot-toast'
// import { toast } from 'react-hot-toast'
// import i18n from './i18n'

// Env bo'lsa o'shani, bo'lmasa localhost (dev). Vercel'да REACT_APP_API_URL beriladi.
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000'
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'http://localhost:3000/'
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8000/api/v1/'

const client = axios.create({ baseURL: API_URL })
export const request = ({ ...options }) => {
  const auth = window.localStorage.getItem('accessToken') ? `Bearer ${window.localStorage.getItem('accessToken')}` : ''
  client.defaults.headers.common.Authorization = auth
  // Accept: application/json — Laravel xatolarni HTML redirect emas, JSON qaytarsin.
  client.defaults.headers.common.Accept = 'application/json'

  const onSuccess = (response: any) => response

  const onError = (error: any) => {
    // 401 (token yaroqsiz): sign-in'da bo'lmasa o'sha yerga yo'naltiramiz.
    // Sign-in'dagi 401 (noto'g'ri parol) sahifani qayta yuklamaydi — xato xabari ko'rinsin.
    if (error?.response?.status === 401 && window.location.pathname !== '/sign-in') {
      const redirect = window.location.pathname
      window.localStorage.removeItem('accessToken')
      window.localStorage.removeItem('refreshToken')
      window.location.href = `/sign-in?redirect=${redirect}`
    }
    return Promise.reject(error)
  }

  return client(options).then(onSuccess).catch(onError)
}

// Tizimdan chiqish: serverdagi tokenni bekor qiladi va ikkala tokenni tozalaydi.
// (Avval faqat accessToken o'chirilardi — refreshToken qolib, foydalanuvchi qayta kirib qolardi.)
export const logout = async () => {
  try {
    await request({ url: 'auth/logout', method: 'POST' })
  } catch (e) {
    // token allaqachon bekor bo'lgan bo'lishi mumkin — e'tibor bermaymiz
  }
  window.localStorage.removeItem('accessToken')
  window.localStorage.removeItem('refreshToken')
}
