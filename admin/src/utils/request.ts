import axios from 'axios'
import { toast } from 'react-hot-toast'

// Env bo'lsa o'shani, bo'lmasa localhost (dev). Deploy'da REACT_APP_API_URL beriladi.
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000'
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'http://localhost:3001/'
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8000/api/v1/'

const client = axios.create({ baseURL: API_URL })

export const logout = () => {
  localStorage.removeItem('accessToken')
  if (window.location.pathname !== '/login') window.location.href = '/login'
}

// Laravel xato matnini bitta joyda yig'amiz: validatsiya xatolari `params` ichida
// maydonlar bo'yicha massiv bo'lib keladi, umumiy xato esa `message` da.
export const getErrorMessage = (error: any): string => {
  const data = error?.response?.data
  const fieldErrors = data?.params
  if (fieldErrors && typeof fieldErrors === 'object') {
    const first: any = Object.values(fieldErrors)[0]
    const text = Array.isArray(first) ? first[0] : first
    if (text) return String(text)
  }
  return data?.message || error?.message || 'Xatolik yuz berdi'
}

export const request = ({ ...options }) => {
  const token = localStorage.getItem('accessToken')
  client.defaults.headers.common.Authorization = token ? `Bearer ${token}` : ''
  // Laravel xatolarni JSON qaytarishi uchun application/json (avval multipart/form-data edi).
  client.defaults.headers.common.Accept = 'application/json'

  const onSuccess = (response: any) => response

  const onError = (error: any) => {
    const status = error?.response?.status
    // Faqat 401 (token yaroqsiz/eskirgan) sessiyani tugatadi. Ilgari 403 ham
    // login'ga uloqtirardi: bitta ruxsat etilmagan so'rov butun sessiyani
    // o'chirib yuborardi va admin sababini ham ko'ra olmasdi.
    if (status === 401) {
      logout()
      return Promise.reject(error)
    }
    toast.error(getErrorMessage(error))
    return Promise.reject(error)
  }

  return client(options).then(onSuccess).catch(onError)
}
