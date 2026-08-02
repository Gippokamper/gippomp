import React, { SVGProps } from 'react'

function MarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.7002 3H16.3002C17.4052 3 18.3002 3.895 18.3002 5V21L12.0082 17.727L5.7002 21V5C5.7002 3.895 6.5952 3 7.7002 3Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default MarkIcon
