import React from 'react'
interface IProps {
  onClose: () => void
  text: string
}
function Error(props: IProps) {
  return (
    <div className='message message-error'>
      <div className='message__ico'>
        <svg width={37} height={36} viewBox='0 0 37 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle
            cx='18.5006'
            cy='17.5074'
            r='13.1305'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path d='M15 22L23 14' stroke='white' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
          <path d='M15 14L23 22' stroke='white' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
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

export default Error
