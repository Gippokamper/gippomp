import * as React from 'react'
import { SVGProps } from 'react'
const Desktop = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={35} height={35} fill='none' {...props}>
    <path stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M23.334 30.625H11.667' />
    <rect
      width={29.167}
      height={20.417}
      x={2.917}
      y={4.375}
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      rx={2}
    />
    <path
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M32.084 20.417H2.917M20.417 24.792v1.458c0 2.416.98 4.375 2.188 4.375M14.583 24.792v1.458c0 2.416-.98 4.375-2.188 4.375'
    />
  </svg>
)
export default Desktop
