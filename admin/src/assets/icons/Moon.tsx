import * as React from 'react'
import { SVGProps } from 'react'
const Moon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} fill='none' {...props}>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M14.775 11.25c-1.875.6-4.05.225-5.55-1.275C7.35 8.1 7.2 5.1 8.7 3c-3.075.3-5.475 2.85-5.475 6 0 3.3 2.7 6 6 6 2.475 0 4.65-1.575 5.55-3.75v0Z'
      clipRule='evenodd'
    />
  </svg>
)
export default Moon
