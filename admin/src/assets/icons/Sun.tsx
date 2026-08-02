import * as React from 'react'
const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} fill='none' {...props}>
    <g stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}>
      <path d='M9 13.688v1.874M9 2.438v1.874' />
      <path d='M9 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z' clipRule='evenodd' />
      <path d='m5.685 12.315-1.328 1.327M13.642 4.357l-1.327 1.328M4.313 9H2.438M15.563 9h-1.876M5.685 5.685 4.357 4.357M13.642 13.642l-1.327-1.327' />
    </g>
  </svg>
)
export default Sun
