import * as React from 'react'
import { SVGProps } from 'react'
const Bell = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path
      fill='currentColor'
      d='m18.793 11.008-1.46-5.245a7.87 7.87 0 0 0-15.262.404L.943 11.24a4.584 4.584 0 0 0 4.473 5.577h.334a4.404 4.404 0 0 0 8.461 0h.161a4.583 4.583 0 0 0 4.417-5.81h.004Zm-2.757 2.487a2.066 2.066 0 0 1-1.66.823h-8.96a2.082 2.082 0 0 1-2.033-2.535L4.511 6.7a5.37 5.37 0 0 1 10.417-.272l1.457 5.245a2.064 2.064 0 0 1-.35 1.822Z'
    />
  </svg>
)
export default Bell
