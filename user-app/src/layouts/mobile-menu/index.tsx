import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../helpers/request'
import { setTheme } from '../../store/siteSlice/siteSlice'
import { RootState } from '../../store'
import uz from '../../img/icons/uz.svg'
import ru from '../../img/icons/ru.svg'
import en from '../../img/icons/en.svg'
import GetContainer from '../../components/get-container'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../../components/modal'
import lightIcon from '../../img/icons/exit-light.svg'
import darkIcon from '../../img/icons/exit-dark.svg'
import { nav_data } from '../../data/nav_data'

interface IProps {
  isVisible: boolean
  hide: () => void
}

export const MobileMenu = (props: IProps) => {
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)

  const [notsShow, setNotsShow] = useState(false)
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const { isDark } = useSelector((state: RootState) => state.site)
  const langButtons = [
    {
      value: 'uz',
      button: (
        <button key='uz' onClick={() => i18n.changeLanguage('uz')} className='header-lang__item'>
          <img src={uz} alt='lang' />
          <span>UZ</span>
        </button>
      )
    },
    {
      value: 'ru',
      button: (
        <button key='ru' onClick={() => i18n.changeLanguage('ru')} className='header-lang__item'>
          <img src={ru} alt='lang' />
          <span>RU</span>
        </button>
      )
    },
    {
      value: 'en',
      button: (
        <button key='en' onClick={() => i18n.changeLanguage('en')} className='header-lang__item'>
          <img src={en} alt='lang' />
          <span>EN</span>
        </button>
      )
    }
  ]
  return (
    <div className={`mobile-menu ${props?.isVisible ? 'open' : ''}`} style={{ zIndex: 100 }}>
      <div className='mobile-menu__head'>
        <div className='mobile-menu__btn' onClick={() => setModalOpen(true)}>
          <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M11 19.392V7.50298C11 6.81298 10.645 6.17198 10.06 5.80698L6.06 3.30698C4.728 2.47498 3 3.43198 3 5.00298V16.891C3 17.581 3.355 18.222 3.94 18.587L7.94 21.087C9.272 21.92 11 20.962 11 19.392Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path d='M15 11H21' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            <path
              d='M19 13L21 11L19 9'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M11 19H15C16.105 19 17 18.105 17 17V16'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M17 6V5C17 3.895 16.105 3 15 3H5'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <div className='mobile-menu__wrap'>
          <div className='mobile-menu__lang'>
            <div className='header-lang'>
              {langButtons?.find(el => el.value === i18n.language)?.button}
              {langButtons?.filter(el => el.value !== i18n.language)?.map(item => item.button)}
            </div>
          </div>
          <GetContainer url='/dashboard/user/notification/feedback'>
            {({ data }) => (
              <>
                <div className='mobile-menu__btn' onClick={() => setNotsShow(!notsShow)}>
                  <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M5.99398 13V9C5.99398 5.686 8.68298 3 12 3C15.317 3 18.006 5.686 18.006 9V13C18.006 13.986 18.454 14.919 19.223 15.537L19.532 15.785C20.449 16.521 19.928 18 18.752 18H5.24798C4.07198 18 3.55098 16.521 4.46798 15.785L4.77698 15.537C5.54698 14.919 5.99398 13.986 5.99398 13Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M10.5 21H13.5'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {data?.data?.length ? (
                    <div className='count'>
                      <span>{data?.data?.length}</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <ul className={`header-nots ${notsShow ? 'show' : 'hide'}`}>
                  {data?.data?.map((item: any) => (
                    <li key={item?.id}>
                      <button className='header-nots__btn' onClick={() => navigate('/account?type=messages')}>
                        <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M12.0626 3.7709C13.2016 4.90993 13.2016 6.75666 12.0626 7.89569C10.9235 9.03473 9.0768 9.03473 7.93777 7.89569C6.79874 6.75666 6.79874 4.90993 7.93777 3.7709C9.0768 2.63187 10.9235 2.63187 12.0626 3.7709'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M3.3335 15.4166V16.2499C3.3335 16.7099 3.70683 17.0833 4.16683 17.0833H15.8335C16.2935 17.0833 16.6668 16.7099 16.6668 16.2499V15.4166C16.6668 12.8949 13.3735 11.2566 10.0002 11.2566C6.62683 11.2566 3.3335 12.8949 3.3335 15.4166Z'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div>
                          <p>{item?.author}</p>
                          <span>{item?.message}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </GetContainer>
          <div className='mobile-menu__btn' onClick={props.hide}>
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M4 4L20 20'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M20 4L4 20'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
      </div>

      {/*
        O'quv modullari chap menyudagi bilan bitta manbadan — `nav_data`.
        Ilgari bu yerda faqat uchta havola qo'lda yozilgan edi (Yangiliklar,
        Kabinet, Yordam) va telefonda Kutubxona, Test, Videolar, O'quv
        dasturiga menyudan umuman kirib bo'lmasdi: 1080px dan past ekranda
        chap ustun yashiriladi va o'rnini shu ro'yxat bosadi.
      */}
      <ul className='mobile-menu__list'>
        {nav_data.map(nav => (
          <li key={nav.id}>
            {/* Havola bosilganda panel yopilsin — aks holda u yangi sahifa
                ustida ochiq turib qolardi. */}
            <Link to={nav.to} onClick={props.hide}>
              {nav.icon}
              <span>{t(nav.text)}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link to='/account' onClick={props.hide}>
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M18 20V19.25C18 16.9028 16.0972 15 13.75 15H6.25C3.90279 15 2 16.9028 2 19.25V20'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <circle
                cx={10}
                cy={7}
                r={4}
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path d='M19 9V13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <path
                d='M21 11H17'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Personal cabinet')}</span>
          </Link>
        </li>
        <li>
          <Link to='/help' onClick={props.hide}>
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M19 21H5C3.895 21 3 20.105 3 19V5C3 3.895 3.895 3 5 3H19C20.105 3 21 3.895 21 5V19C21 20.105 20.105 21 19 21Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 13.25V13C12 12.183 12.505 11.74 13.011 11.4C13.505 11.067 14 10.633 14 9.83301C14 8.72801 13.105 7.83301 12 7.83301C10.895 7.83301 10 8.72801 10 9.83301'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M11.999 16C11.861 16 11.749 16.112 11.75 16.25C11.75 16.388 11.862 16.5 12 16.5C12.138 16.5 12.25 16.388 12.25 16.25C12.25 16.112 12.138 16 11.999 16'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Help center')}</span>
          </Link>
        </li>
      </ul>
      <div className='side-mode'>
        <button className={`light ${isDark ? '' : 'current'}`} onClick={() => dispatch(setTheme(false))}>
          <svg width={18} height={18} viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M9 13.6875V15.5625'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9 2.4375V4.3125'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M5.68687 12.3164L4.35938 13.6439'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M13.64 4.35938L12.3125 5.68687'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4.3125 9H2.4375'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M15.5625 9H13.6875'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M5.68687 5.68687L4.35938 4.35938'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M13.64 13.6439L12.3125 12.3164'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>{t('Light')}</span>
        </button>
        <button className={`dark ${isDark ? 'current' : ''}`} onClick={() => dispatch(setTheme(true))}>
          <svg width={18} height={18} viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M14.7766 11.25C12.9016 11.85 10.7266 11.475 9.22656 9.975C7.35156 8.1 7.20156 5.1 8.70156 3C5.62656 3.3 3.22656 5.85 3.22656 9C3.22656 12.3 5.92656 15 9.22656 15C11.7016 15 13.8766 13.425 14.7766 11.25V11.25Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>{t('Dark')}</span>
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        lightIcon={lightIcon}
        darkIcon={darkIcon}
        close={() => setModalOpen(false)}
        onAccept={async () => {
          await logout()
          setModalOpen(false)
          navigate('/sign-in')
        }}
        acceptTitle={t('Yes')}
        cancelTitle={t('No')}
        onCancel={() => setModalOpen(false)}
        title={t('Do you want to log out?')}
        description={t("After you sign out, you'll need to enter your credentials again to sign in")}
      />
    </div>
  )
}
