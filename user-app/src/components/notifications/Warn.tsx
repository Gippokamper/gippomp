import React from 'react'

interface IProps {
  onClose: () => void
  text: string
}

function Warn(props: IProps) {
  return (
    <div className='message message-warn'>
      <div className='message__ico'>
        <svg width={35} height={35} viewBox='0 0 35 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M29.1667 16.771V13.1252C29.1667 11.5143 27.8608 10.2085 26.25 10.2085H6.5625C5.35438 10.2085 4.375 9.22912 4.375 8.021V8.021C4.375 6.81287 5.35438 5.8335 6.5625 5.8335H24.7917'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M26.9793 16.771H29.1668C29.9722 16.771 30.6252 17.4239 30.6252 18.2293V22.6043C30.6252 23.4097 29.9722 24.0627 29.1668 24.0627H26.9793C24.9658 24.0627 23.3335 22.4304 23.3335 20.4168V20.4168C23.3335 18.4033 24.9658 16.771 26.9793 16.771V16.771Z'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M29.1667 24.0627V27.7085C29.1667 29.3193 27.8608 30.6252 26.25 30.6252H8.02083C6.0073 30.6252 4.375 28.9929 4.375 26.9793V8.021'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M10.2082 14.5835V26.2502'
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

export default Warn
