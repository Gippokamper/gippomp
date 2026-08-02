import React, { SVGProps } from 'react'

function KeyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M13.4619 10.793C13.5999 10.793 13.7109 10.681 13.7109 10.543C13.7109 10.405 13.5979 10.293 13.4609 10.293C13.3229 10.293 13.2109 10.405 13.2109 10.543C13.2109 10.681 13.3229 10.793 13.4619 10.793'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.83144 11.6963C9.41444 10.3753 9.70944 8.87625 10.7524 7.82725C12.2474 6.32925 14.6704 6.32825 16.1664 7.82525C17.6624 9.32125 17.6654 11.7513 16.1734 13.2513C15.1244 14.3023 13.6234 14.6003 12.3014 14.1773L12.2934 14.1843L9.70044 16.7823C9.01644 17.4673 7.90644 17.4673 7.22244 16.7823C6.54044 16.0993 6.54044 14.9933 7.22244 14.3093L9.81544 11.7113'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19 21H5C3.895 21 3 20.105 3 19V5C3 3.895 3.895 3 5 3H19C20.105 3 21 3.895 21 5V19C21 20.105 20.105 21 19 21Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default KeyIcon
