import * as React from 'react'
import { SVGProps } from 'react'

const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox=' 0 0 24 24' width={24} height={24} {...props}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z'
      clipRule='evenodd'
    />
  </svg>
)

export default ArrowLeft
