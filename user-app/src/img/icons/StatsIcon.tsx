import React, { SVGProps } from 'react'

function StatsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 6V14C7 15.6569 8.34315 17 10 17H18C19.6569 17 21 15.6569 21 14V6C21 4.34315 19.6569 3 18 3H10C8.34315 3 7 4.34315 7 6Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.8031 8.61155C15.7443 7.66671 14.934 6.94644 13.9888 6.99877C13.1442 6.96372 12.3942 7.53465 12.2031 8.35808'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.8 8.61328V8.61328C15.8 9.18141 15.492 9.70488 14.9954 9.98078L14 10.5338'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M14.075 12.9259C14.0749 12.9673 14.0414 13.0008 14 13.0008C13.9586 13.0008 13.925 12.9672 13.925 12.9258C13.925 12.8844 13.9585 12.8508 13.9999 12.8508C14.0198 12.8508 14.0389 12.8587 14.053 12.8727C14.0671 12.8868 14.075 12.9059 14.075 12.9259'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17 17V18C17 19.6569 15.6569 21 14 21H6C4.34315 21 3 19.6569 3 18V10C3 8.34315 4.34315 7 6 7H7'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default StatsIcon
