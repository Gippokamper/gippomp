import React from 'react'
import { useMutation } from 'react-query'
import { request } from '../../helpers/request'
import { useTranslation } from 'react-i18next'
import desktop from '../../img/icons/desktop.svg'
import mobile from '../../img/icons/iPhone.svg'
import moment from 'moment'

export const DELETE_DEVICE = async (id: string | number) => {
  const response = await request({
    url: 'dashboard/user/devices/' + id,
    method: 'DELETE'
  })
  return response.data
}

interface IProps {
  item: any
  refetch: () => void
}

function DeviceCard(props: IProps) {
  const {t} = useTranslation();
  
  const { mutate } = useMutation(DELETE_DEVICE, {
    onSuccess: () => props.refetch()
  })

  return (
    <div className='rate-devices__item'>
      <div className='rate-devices__wrap'>
        <img src={props?.item?.type === 'desktop' ? desktop : mobile} alt='ico' />
        <span>
          {props?.item?.view_name} <br />
          {moment(props?.item?.created_at).format('MM-DD-YYYY HH:mm')}
        </span>
      </div>
      <button
        className='rate-devices__btn'
        onClick={() =>
          mutate(props?.item?.id, {
            onSuccess: () => props?.refetch()
          })
        }
      >
        {t('Turn off')}
      </button>
    </div>
  )
}

export default DeviceCard
