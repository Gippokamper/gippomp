import * as React from 'react'
import { SVGProps } from 'react'
const MarkSaved = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} fill='none' {...props}>
    <path
      fill='url(#a)'
      fillRule='evenodd'
      d='M7.7 3h8.6a2 2 0 0 1 2 2v16l-6.292-3.273L5.7 21V5a2 2 0 0 1 2-2Z'
      clipRule='evenodd'
    />
    <defs>
      <linearGradient id='a' x1={5.7} x2={18.784} y1={4.05} y2={4.432} gradientUnits='userSpaceOnUse'>
        <stop stopColor='#356B3E' />
        <stop offset={1} stopColor='#AACC3A' />
      </linearGradient>
    </defs>
  </svg>
)
export default MarkSaved
