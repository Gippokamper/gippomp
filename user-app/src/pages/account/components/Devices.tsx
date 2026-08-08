import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import moment from 'moment'

import { request } from '../../../helpers/request'
import { useApiErrorHandler } from '../../../hooks/use-api-error-handler'

interface IDevice {
  id: number
  name?: string
  view_name?: string
  type?: string
  created_at?: string
}

const DesktopIcon = () => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='3' y='4' width='18' height='12' rx='2' stroke='currentColor' strokeWidth='1.5' />
    <path d='M8 20h8M12 16v4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
)

const MobileIcon = () => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='6.5' y='2.5' width='11' height='19' rx='2.5' stroke='currentColor' strokeWidth='1.5' />
    <path d='M10.5 18.5h3' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
)

/**
 * "Qurilmalar" bo'limi — hisobga kirgan qurilmalar va sessiyani tugatish.
 *
 * Ilgari bu ro'yxat faqat qurilma chegarasi to'lganda chiqadigan modalda
 * ko'rinardi; endi kabinetning alohida bo'limi.
 */
function Devices() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const handleApiError = useApiErrorHandler()

  const { data, isLoading, isError, refetch } = useQuery(
    ['devices'],
    async () => {
      const response: any = await request({ url: 'dashboard/user/devices', method: 'GET' })
      return (response?.data?.data ?? []) as IDevice[]
    },
    { onError: handleApiError }
  )

  const { mutate: removeDevice, isLoading: isRemoving } = useMutation(
    async (id: number) => request({ url: 'dashboard/user/devices/' + id, method: 'DELETE' }),
    {
      onSuccess: () => queryClient.invalidateQueries(['devices']),
      onError: handleApiError
    }
  )

  const devices = data ?? []

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className='acc-devices'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} height={78} borderRadius={12} />
          ))}
        </div>
      )
    }

    if (isError) {
      return (
        <div className='ui-empty' role='alert'>
          <span className='ui-empty__title'>{t('Failed to load')}</span>
          <button type='button' className='ui-btn ui-btn--primary' onClick={() => refetch()}>
            {t('Try again')}
          </button>
        </div>
      )
    }

    if (!devices.length) {
      return (
        <div className='ui-empty'>
          <span className='ui-empty__title'>{t('This section is empty')}</span>
        </div>
      )
    }

    return (
      <ul className='acc-devices'>
        {devices.map(device => (
          <li className='acc-device' key={device.id}>
            <span className='acc-device__icon'>
              {device.type === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
            </span>

            <span className='acc-device__body'>
              <b>{device.view_name || device.name || '—'}</b>
              {!!device.name && device.view_name !== device.name && <span>{device.name}</span>}
              {!!device.created_at && (
                <span className='acc-device__date'>{moment(device.created_at).format('DD.MM.YYYY HH:mm')}</span>
              )}
            </span>

            <button
              type='button'
              className='acc-device__end'
              disabled={isRemoving}
              onClick={() => removeDevice(device.id)}
            >
              {t('Turn off')}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className='acc-panel'>
      <div className='acc-panel__head'>
        <h2 className='acc-panel__title'>{t('Devices')}</h2>
        {!isLoading && <span className='ui-count'>{devices.length}</span>}
      </div>
      {renderBody()}
    </div>
  )
}

export default Devices
