import React from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  text: string
  onClose: () => void
}

function Success(props: IProps) {
  const { t } = useTranslation()
  return (
    <div className='message message-success'>
      <div className='message__ico'>
        <svg width={35} height={35} viewBox='0 0 35 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle
            cx='17.4977'
            cy='17.5055'
            r='13.1305'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12.3125 18.0034L15.474 21.1649L15.4536 21.1445L22.5864 14.0117'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      <div className='message__text'>{t(props.text)}</div>
      <div className='message__close' onClick={props.onClose}>
        <svg width={13} height={13} viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M2.39844 10.6289L10.627 2.40033'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M2.39844 2.40033L10.627 10.6289'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    </div>
  )
}

export default Success
