import * as React from 'react'
import { SVGProps } from 'react'
const MoneyWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={25} height={24} fill='none' {...props}>
    <path
      stroke='#121B2D'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M20.5 11.5V9a2 2 0 0 0-2-2H5a1.5 1.5 0 0 1-1.5-1.5v0A1.5 1.5 0 0 1 5 4h12.5'
    />
    <path
      stroke='#121B2D'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M19 11.5h1.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H19a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5v0Z'
      clipRule='evenodd'
    />
    <path
      stroke='#121B2D'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M20.5 16.5V19a2 2 0 0 1-2 2H6a2.5 2.5 0 0 1-2.5-2.5v-13M7.5 10v8'
    />
  </svg>
)
export default MoneyWallet
