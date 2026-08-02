import React from 'react'
import './App.scss'
import './css/main.scss'
import './configs/i18n'

import { Navigate, Route, Routes } from 'react-router-dom'
import { router_data } from './data/router_data'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { store } from './store'

import ImageModal from './components/image-modal'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import AuthProvider from './providers/auth-provider'

// Standart sozlamalarda staleTime = 0 va refetchOnWindowFocus = true edi:
// boshqa oynaga o'tib qaytilgan har safar ekrandagi hamma so'rov qaytadan
// yuborilardi. Kategoriya/maqola ro'yxatlari deyarli o'zgarmaydi, shuning
// uchun 5 daqiqa "yangi" deb hisoblanadi.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Navigate to='/library' replace />} />
            {router_data.map(route => (
              <Route {...route} key={route.path} />
            ))}
          </Routes>
          <ImageModal />
          <Toaster
            toastOptions={{
              success: {
                style: {
                  display: 'inline-flex',
                  padding: '1.875rem 3.375rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  borderRadius: '1.25rem',
                  background: 'linear-gradient(180deg, #84BC3F 0%, #4FA446 100%)',
                  color: '#ffff',
                  fontFamily: 'Gilroy',
                  fontSize: '1.2rem',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '116%',
                  maxWidth: '27rem'
                }
              },
              error: {
                style: {
                  display: 'inline-flex',
                  padding: '1.875rem 3.375rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  borderRadius: '1.25rem',
                  background: 'linear-gradient(180deg, #FF624A 0%, #D11C00 100%)',
                  color: '#ffff',
                  fontFamily: 'Gilroy',
                  fontSize: '1.2rem',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '116%',
                  maxWidth: '27rem'
                },
                duration: 500, // Установка бесконечной продолжительности для уведомлений успеха
                icon: (
                  <svg width='35' height='35' viewBox='0 0 35 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <circle
                      cx='17.5006'
                      cy='17.5074'
                      r='13.1305'
                      stroke='white'
                      stroke-width='2.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M14 22L22 14'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M14 14L22 22'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                )
              }
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
