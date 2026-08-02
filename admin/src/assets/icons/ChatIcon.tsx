import * as React from 'react'
import { SVGProps } from 'react'
const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={25} height={24} fill='none' {...props}>
    <path
      stroke='#323232'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M21.504 4.997V15a2 2 0 0 1-2.001 2H7.498l-4.002 4.003V4.997a2 2 0 0 1 2-2h14.007a2 2 0 0 1 2 2Z'
      clipRule='evenodd'
    />
    <path
      stroke='#323232'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M16.501 7.998H8.498M8.498 12H12.5'
    />
  </svg>
)
export default ChatIcon
