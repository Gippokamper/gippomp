import React, { SVGProps } from 'react'

function MarkerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={25} viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M9.78008 16.4203L9.16382 17.0365C8.83694 17.3638 8.39336 17.5477 7.93081 17.5477C7.46825 17.5477 7.02467 17.3638 6.69779 17.0365L5.46428 15.801C5.13701 15.4742 4.95312 15.0306 4.95312 14.568C4.95312 14.1055 5.13701 13.6619 5.46428 13.335L6.08053 12.7188'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.4876 6.63266L15.8615 4.00757C15.2125 3.35776 14.1707 3.32276 13.4795 3.92753L6.24448 10.2592C5.88099 10.5769 5.66553 11.0312 5.64941 11.5137C5.63329 11.9963 5.81797 12.4639 6.15944 12.8052L9.69391 16.3347C10.0351 16.676 10.5024 16.8606 10.9847 16.8447C11.467 16.8288 11.9211 16.6137 12.239 16.2507L18.5706 9.01465C19.1736 8.32234 19.1373 7.2813 18.4876 6.63266Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2.99219 21.5041H20.9997'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.47806 17.4847L6.42062 18.5031H4.2267L2.99219 17.0375L5.01303 15.0156'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default MarkerIcon
