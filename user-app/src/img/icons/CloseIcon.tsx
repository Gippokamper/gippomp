import React, { SVGProps } from 'react'

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M10.5 3.625L6.125 8L10.5 12.375'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default CloseIcon
