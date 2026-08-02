import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Error from '../components/notifications/Error'

/**
 * API xatolariga umumiy javob: telefon tasdiqlanmagan / sessiya tugagan /
 * tarif yo'q holatlarida kerakli sahifaga yo'naltiradi.
 *
 * Ilgari bu mantiq faqat GetContainer ichida edi. useQueries kabi boshqa
 * joylarda ham kerak bo'lgani uchun alohida hook'ga chiqarildi — mantiq
 * bir nusxada turishi uchun GetContainer ham shu hook'ni ishlatadi.
 */
export function useApiErrorHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  return useCallback(
    (err: any) => {
      const message = err?.response?.data?.message

      if (message === 'Phone verification') {
        if (location.pathname !== '/send-code') {
          navigate('/send-code')
        }
        return
      }

      if (message === 'Device limit reached' || message === 'Unauthorized') {
        if (location.pathname !== '/sign-in') {
          navigate('/sign-in')
        }
        return
      }

      if (message === 'Trial period is over and no active tariff found') {
        toast.custom(tr => <Error text={t(message)} onClose={() => toast.dismiss(tr.id)} />)
        navigate('/account?type=tariffs')
      }
    },
    [navigate, location.pathname, t]
  )
}
