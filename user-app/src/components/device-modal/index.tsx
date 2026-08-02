import React from 'react'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import close from '../../img/icons/close.svg'
import DeviceCard, { DELETE_DEVICE } from '../device-card'
interface IProps {
  visible: boolean
  hide: () => void
  data: any
  onSuccess: () => void
}

function DeviceModal(props: IProps) {
  const {t} = useTranslation();

  return (
    <div
      className='account-popup'
      style={{
        display: props.visible ? 'block' : 'none'
      }}
    >
      <div className='account-popup__close' onClick={props.hide}>
        <img src={close} alt='ico' />
      </div>
      <div
        className='account-popup__content'
        style={{
          width: '90%'
        }}
      >
        <div className='rate-card'>
          <div className='rate__subtitle'>{t('Devices')}</div>
          <div className='rate-devices'>
            {props?.data?.map((item: any) => (
              <DeviceCard
                key={item?.id}
                item={item}
                refetch={() => {
                  props.onSuccess()
                  props.hide()
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceModal
