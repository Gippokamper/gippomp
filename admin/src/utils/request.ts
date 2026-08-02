import axios from 'axios'
import { toast } from 'react-hot-toast'
// import { toast } from 'react-hot-toast'
// import i18n from './i18n'

// Env bo'lsa o'shani, bo'lmasa localhost (dev). Deploy'da REACT_APP_API_URL beriladi.
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000'
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'http://localhost:3001/'
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8000/api/v1/'

const client = axios.create({ baseURL: API_URL })
export const request = ({ ...options }) => {
  const token = localStorage.getItem('accessToken')
  client.defaults.headers.common.Authorization = token ? `Bearer ${token}` : ''
  // Laravel xatolarni JSON qaytarishi uchun application/json (avval multipart/form-data edi).
  client.defaults.headers.common.Accept = 'application/json'

  const onSuccess = (response: any) => response

  const onError = (error: any) => {
    const status = error?.response?.status
    // 401 (token yaroqsiz) yoki 403 (rol yetmaydi) → login sahifasiga (status bo'yicha, matn emas).
    if (status === 401 || status === 403) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    } else {
      const msg = error?.response?.data?.message || error?.message
      if (msg) toast.error(msg)
    }
    return Promise.reject(error)
  }

  return client(options).then(onSuccess).catch(onError)
}
