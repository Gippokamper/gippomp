import React, { SVGProps } from 'react'

/**
 * ESLATMA: bu fayl tiklash jarayonida qayta yozilgan.
 * Asl loyihada mavjud edi, lekin serverdagi bundle'ga tushmagan.
 * Shakli `fullscreen.svg` dagi yo'llardan aynan ko'chirildi.
 */
function FullScreenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={30} height={30} viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M23.75 26.25H6.25C4.86875 26.25 3.75 25.1313 3.75 23.75V6.25C3.75 4.86875 4.86875 3.75 6.25 3.75H23.75C25.1313 3.75 26.25 4.86875 26.25 6.25V23.75C26.25 25.1313 25.1313 26.25 23.75 26.25Z'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.5 7.5H22.5V12.5'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.5 22.5H7.5V17.5'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default FullScreenIcon
