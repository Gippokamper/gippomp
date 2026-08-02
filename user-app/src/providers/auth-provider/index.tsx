import React, { createContext, useState } from 'react'
import { request } from '../../helpers/request'
import { useMutation, useQuery } from 'react-query'
import { LOGIN } from '../../pages/sign_in/mutations'
import DeviceModal from '../../components/device-modal'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Yellow from '../../components/notifications/Yellow'
import Error from '../../components/notifications/Error'

export const REFRESH_TOKEN = async () => {
  const response = await request({
    url: 'dashboard/user/refresh_token',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('refreshToken')
    }
  })

  return response.data
}

export const GET_PERMESTIONS = async () => {
  const response = await request({
    url: 'dashboard/permissions',
    method: 'GET'
  })

  return response.data
}

export const GET_DEVICES = async () => {
  const response = await request({
    url: 'dashboard/user/devices',
    method: 'GET'
  })

  return response.data
}
export const AuthContext = createContext({} as any)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark } = useSelector((state: RootState) => state.site)
  const { t: tr } = useTranslation()

  const [user, setUser] = useState<any>(null)
  const [userPermissions, setUserPermissions] = useState<any>(null)
  const [enabled, setEnabled] = useState(!!window.localStorage.getItem('refreshToken'))
  const [devices, setDevices] = useState<any>(null)

  const { data: devicesData, refetch } = useQuery(['devicesData'], GET_DEVICES, {
    enabled: false,
    onSuccess: data => {
      setDevices(data?.data)
    }
  })

  const { data, refetch: refetchToken } = useQuery(['REFRESH_TOKEN'], REFRESH_TOKEN, {
    // false: har oyna fokusида qayta ishlab, ogohlantirish toast'ini takrorlamasin
    refetchOnWindowFocus: false,
    enabled:
      enabled &&
      location &&
      location.pathname !== '/sign-in' &&
      location.pathname !== '/sign-up' &&
      location.pathname !== '/send-code' &&
      location.pathname !== '/forgot-password',
    onError(err: any) {
      setEnabled(false)
      if (err?.response?.data?.message === 'Phone verification') {
        navigate('/send-code')
      } else if (err?.response?.data?.message === 'Device limit reached') {
        refetch()
      } else if (err?.response?.status === 401) {
        navigate('/sign-in')
      }
    },
    onSuccess: data => {
      window.localStorage.setItem('accessToken', data?.data?.access_token)
      if (data?.data?.tariff_end_days) {
        toast.custom(
          t => (
            <Yellow
              text={`${tr('End day1')} ${data?.data?.tariff_end_days} ${tr('End day2')}`}
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          {
            duration: 10000000,

            style: {
              background: 'transparent',
              opacity: 0.001
            }
          }
        )
      }
      setUser(data?.data?.user)
      refetchPermessions()
    }
  })
  const { data: permessions, refetch: refetchPermessions } = useQuery(['permissions'], GET_PERMESTIONS, {
    enabled: false,
    onSuccess: data => {
      setUserPermissions(data?.data?.user_permissions)
    }
  })

  const { mutate: login } = useMutation(LOGIN, {
    onSuccess: data => {
      localStorage.setItem('accessToken', data?.data?.access_token)
      localStorage.setItem('refreshToken', data?.data?.refresh_token)
      setUser(data?.data?.user)
      setUserPermissions(data?.data?.user_permissions)
      setEnabled(true) // refresh/permissions so'rovlari shu sessiyada yonsin (avval faqat reload'dan keyin ishlardi)
      if (data?.data?.devices?.length > 2) {
        setDevices(data?.data?.devices)
      } else {
        searchParams.get('redirect') ? navigate(String(searchParams.get('redirect'))) : navigate('/library')
      }
    },
    onError: (err: any) => {
      // Backend'ning haqiqiy xabarini ko'rsatamiz (qurilma limiti / juda ko'p urinish), aks holda umumiy xato.
      const msg = err?.response?.data?.message
      toast.custom(t => <Error text={msg ? tr(msg) : tr('Wrong login or password')} onClose={() => toast.dismiss(t.id)} />)
    }
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        userPermissions,
        refetchToken
      }}
    >
      <SkeletonTheme baseColor={isDark ? '#202020' : '#ebebeb'} highlightColor={isDark ? '#444' : '#f5f5f5'}>
        {children}
        <DeviceModal
          visible={!!devices}
          hide={() => setDevices(null)}
          data={devices}
          onSuccess={() => {
            searchParams.get('redirect') ? navigate(String(searchParams.get('redirect'))) : navigate('/library')
            // localStorage.setItem('accessToken', data?.data?.access_token)
          }}
        />
      </SkeletonTheme>
    </AuthContext.Provider>
  )
}

export default AuthProvider
