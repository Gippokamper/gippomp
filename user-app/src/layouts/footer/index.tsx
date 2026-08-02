import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function Footer() {
  const {t} = useTranslation();
  return (
    <footer className='footer'>
      <ul className='footer-menu'>
        <li>
          <NavLink
            to='/library'
            className={({ isActive, isPending }) => (isPending ? 'current' : isActive ? 'current' : '')}
          >
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M19 6H20C21.1046 6 22 6.89543 22 8V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V8C2 6.89543 2.89543 6 4 6H5'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 20.0008V5.83984'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 5.83882V5.83882C13.2922 4.38506 15.0536 3.43078 16.9771 3.14225L17.8517 3.01107C18.1396 2.96789 18.432 3.0523 18.6526 3.24227C18.8732 3.43225 19 3.70891 19 4.00003V16.1386C19 16.6336 18.6379 17.0541 18.1483 17.1276L16.9771 17.3033C15.0536 17.5918 13.2922 18.5461 12 19.9998V19.9998'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 5.8388V5.8388C10.7078 4.38505 8.94644 3.43078 7.02291 3.14225L6.14834 3.01107C5.86045 2.96789 5.56803 3.0523 5.34744 3.24227C5.12685 3.43224 5 3.7089 5 4.00001V16.1386C5 16.6336 5.36214 17.0541 5.85166 17.1276L7.02291 17.3032C8.94645 17.5918 10.7078 18.546 12 19.9998V19.9998'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Library')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/study-plan'
            className={({ isActive, isPending }) => (isPending ? 'current' : isActive ? 'current' : '')}
          >
            <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M12.5234 14.168V16.0424C12.5234 16.4686 12.7642 16.8581 13.1453 17.0487L13.5611 17.2565C14.2063 17.5791 14.9656 17.5791 15.6108 17.2565L16.0265 17.0487C16.4077 16.8581 16.6484 16.4686 16.6484 16.0424V14.168'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11.174 13.4706L13.725 14.7893C14.265 15.0685 14.9069 15.0685 15.447 14.7893L17.998 13.4706C18.2056 13.3633 18.3361 13.1491 18.3361 12.9154C18.3361 12.6816 18.2056 12.4674 17.998 12.3601L15.447 11.0414C14.9069 10.7622 14.265 10.7622 13.725 11.0414L11.174 12.3601C10.9664 12.4674 10.8359 12.6816 10.8359 12.9154C10.8359 13.1491 10.9664 13.3633 11.174 13.4706Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M18.3307 12.9258V14.3733'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.6667 8.33333V5C16.6667 3.61929 15.5474 2.5 14.1667 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H9.16667'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M5.83594 6.66667H13.3359'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M5.83594 9.9987H9.16927'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M5.83594 13.3346H7.5026'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Educational program')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/videos'
            className={({ isActive, isPending }) => (isPending ? 'current' : isActive ? 'current' : '')}
          >
            <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M13.3359 8.57706L16.232 6.79194C16.489 6.63344 16.8118 6.62646 17.0755 6.77368C17.3392 6.92091 17.5026 7.1993 17.5026 7.50132V13.332C17.5026 13.634 17.3392 13.9124 17.0755 14.0596C16.8118 14.2068 16.4891 14.1999 16.232 14.0414L13.3359 12.2562'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <rect
                x='2.5'
                y={5}
                width='10.8333'
                height='10.8333'
                rx={3}
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Videos')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/quizzes'
            className={({ isActive, isPending }) => (isPending ? 'current' : isActive ? 'current' : '')}
            // style={{
            //   color: !data?.data?.blocks?.length ? 'grey' : ''
            // }}
          >
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M17 8.5V10.5'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.6689 9.66797V12.423C14.6689 12.751 14.5129 13.057 14.2429 13.244C13.7909 13.556 13.0059 13.968 12.0079 13.968C11.0099 13.968 10.2199 13.555 9.76494 13.244C9.49294 13.058 9.33594 12.751 9.33594 12.421V9.66797'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M18.429 17H5.571C4.151 17 3 15.849 3 14.429V5.571C3 4.151 4.151 3 5.571 3H18.428C19.849 3 21 4.151 21 5.571V14.428C21 15.849 19.849 17 18.429 17Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14 17L14.5 21'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M10 17L9.5 21'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M8.14062 21H15.8606'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7 8.5L12 11L17 8.5L12 6L7 8.5Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Qbank')}</span>
          </NavLink>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
