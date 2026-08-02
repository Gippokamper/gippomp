import React from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  onClose: () => void
  text: string
}

function Yellow(props: IProps) {
  return (
    <div className='message message-yellow'>
      <div className='message__ico'>
        <svg width={35} height={36} viewBox='0 0 35 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle
            cx='17.5001'
            cy='18.0001'
            r='13.1305'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M16.041 23.1064H19.4102'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17.732 23.1063V16.9058H16.0542'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17.646 12.5249C17.646 12.7263 17.4827 12.8896 17.2812 12.8896C17.0798 12.8896 16.9165 12.7263 16.9165 12.5249C16.9165 12.3234 17.0798 12.1601 17.2812 12.1601'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17.281 12.1604C17.4824 12.1604 17.6457 12.3237 17.6457 12.5251'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      <div className='message__text'>{props.text}</div>
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

export default Yellow
