import React from 'react'
import { useTranslation } from 'react-i18next'
function MessageEnds() {
  const {t} = useTranslation();

  return (
    <div className='message message-ends'>
      <div className='message__ico'>
        <svg width={35} height={36} viewBox='0 0 35 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M29.1667 17.271V13.6252C29.1667 12.0143 27.8608 10.7085 26.25 10.7085H6.5625C5.35438 10.7085 4.375 9.72912 4.375 8.521V8.521C4.375 7.31287 5.35438 6.3335 6.5625 6.3335H24.7917'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M26.9793 17.271H29.1668C29.9722 17.271 30.6252 17.9239 30.6252 18.7293V23.1043C30.6252 23.9097 29.9722 24.5627 29.1668 24.5627H26.9793C24.9658 24.5627 23.3335 22.9304 23.3335 20.9168V20.9168C23.3335 18.9033 24.9658 17.271 26.9793 17.271V17.271Z'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M29.1667 24.5627V28.2085C29.1667 29.8193 27.8608 31.1252 26.25 31.1252H8.02083C6.0073 31.1252 4.375 29.4929 4.375 27.4793V8.521'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M10.2082 15.0835V26.7502'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      <div className='message__text'>{t('The tariff plan has ended, please make a payment')}</div>
      <div className='message__close'>
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

export default MessageEnds
