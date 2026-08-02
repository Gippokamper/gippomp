import React, { SVGProps } from 'react'

function VideoCard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21 12V12C21 16.971 16.971 21 12 21V21C7.029 21 3 16.971 3 12V12C3 7.029 7.029 3 12 3V3C16.971 3 21 7.029 21 12Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.9411 9.05795L14.8231 11.3539C15.3141 11.6439 15.3141 12.3549 14.8231 12.6449L10.9411 14.9409C10.4411 15.2369 9.80908 14.8759 9.80908 14.2949V9.70395C9.80908 9.12295 10.4411 8.76195 10.9411 9.05795V9.05795Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default VideoCard
