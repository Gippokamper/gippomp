import * as React from 'react'
import { SVGProps } from 'react'
const Play = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' height='24px' fill='none' {...props}>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M21 12v0a9 9 0 0 1-9 9v0a9 9 0 0 1-9-9v0a9 9 0 0 1 9-9v0a9 9 0 0 1 9 9Z'
      clipRule='evenodd'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='m10.941 9.058 3.882 2.296a.75.75 0 0 1 0 1.29l-3.882 2.297a.75.75 0 0 1-1.132-.646V9.704a.75.75 0 0 1 1.132-.646v0Z'
      clipRule='evenodd'
    />
  </svg>
)
export default Play
