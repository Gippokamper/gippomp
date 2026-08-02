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

      <ul className='mobile-menu__list'>
        <li>
          <Link to='/news'>
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M8.99884 21.0037H5.99759C4.34004 21.0037 2.99634 19.66 2.99634 18.0025V5.99747C2.99634 4.33992 4.34004 2.99622 5.99759 2.99622H18.0026C19.6601 2.99622 21.0038 4.33992 21.0038 5.99747V8.99872'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M14.7231 20.7107C14.5356 20.8983 14.2811 21.0038 14.0158 21.0038H12V18.988C12 18.7227 12.1055 18.4682 12.2931 18.2807L18.2196 12.3492C18.5425 12.0263 18.9804 11.8448 19.4371 11.8448C19.8938 11.8448 20.3317 12.0263 20.6546 12.3492V12.3492C20.9778 12.672 21.1594 13.11 21.1594 13.5667C21.1594 14.0234 20.9778 14.4615 20.6546 14.7842L14.7231 20.7107Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.0127 14.5631L18.4437 16.9941'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M20.1686 15.2694L21.0689 16.1698V16.1698C21.5429 16.6447 21.5429 17.4136 21.0689 17.8885L19.9795 18.979'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.24902 10.9996H14.001'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.24902 7.12301H16.0018'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.12277 11.1247C6.19183 11.1247 6.24782 11.0687 6.24782 10.9996C6.24782 10.9305 6.19183 10.8745 6.12277 10.8745C6.0537 10.8745 5.99771 10.9305 5.99771 10.9996C5.99771 11.0687 6.0537 11.1247 6.12277 11.1247'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.12277 7.24806C6.19183 7.24806 6.24782 7.19208 6.24782 7.12301C6.24782 7.05395 6.19183 6.99796 6.12277 6.99796C6.0537 6.99796 5.99771 7.05395 5.99771 7.12301C5.99771 7.19208 6.0537 7.24806 6.12277 7.24806'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.24902 14.8762H10.9998'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.12277 15.0012C6.19183 15.0012 6.24782 14.9452 6.24782 14.8762C6.24782 14.8071 6.19183 14.7511 6.12277 14.7511C6.0537 14.7511 5.99771 14.8071 5.99771 14.8762C5.99771 14.9452 6.0537 15.0012 6.12277 15.0012'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('News')}</span>
          </Link>
        </li>
        <li>
          <Link to='/account'>
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
          <Link to='/help'>
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

      <a href='https://www.novastudio.uz/' className='novas'>
        <svg width='82' height='22' viewBox='0 0 82 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clip-path='url(#clip0_1880_21191)'>
            <path
              d='M36.0063 14.9891C36.4592 14.9891 36.8263 14.6372 36.8263 14.2034V6.85578C36.8263 6.42185 36.4592 6.07007 36.0063 6.07007H35.4677C35.0149 6.07007 34.6477 6.42185 34.6477 6.85578V9.37954C34.6477 10.1183 33.6801 10.4487 33.1925 9.87634L30.1964 6.35897C30.0407 6.17614 29.8075 6.07007 29.5611 6.07007H28.905C28.4521 6.07007 28.085 6.42185 28.085 6.85578V14.2034C28.085 14.6372 28.4521 14.9891 28.905 14.9891H29.4298C29.8827 14.9891 30.2498 14.6372 30.2498 14.2034V11.6747C30.2498 10.9364 31.2164 10.6056 31.7044 11.177L34.7149 14.701C34.8706 14.8833 35.1035 14.9891 35.3494 14.9891H36.0063Z'
              fill='#111111'
            />
            <path
              d='M54.2011 14.511C54.3298 14.8009 54.6268 14.9891 54.9556 14.9891H55.8184C56.1471 14.9891 56.444 14.8009 56.5729 14.511L59.837 7.16352C60.0672 6.64527 59.6702 6.07007 59.0825 6.07007H58.4886C58.1565 6.07007 57.8573 6.26192 57.7306 6.55599L56.1361 10.2571C55.8573 10.9044 54.9009 10.9052 54.6208 10.2585L53.0166 6.55463C52.8896 6.26128 52.5907 6.07007 52.2593 6.07007H51.6915C51.1036 6.07007 50.7067 6.64527 50.937 7.16352L54.2011 14.511Z'
              fill='#111111'
            />
            <path
              d='M61.5225 14.5175C61.3922 14.8039 61.097 14.9891 60.7709 14.9891H60.3097C59.7162 14.9891 59.3193 14.4036 59.5604 13.884L62.9703 6.53653C63.102 6.25286 63.3956 6.07007 63.7196 6.07007H64.6148C64.9387 6.07007 65.2324 6.25286 65.364 6.53653L68.7739 13.884C69.015 14.4036 68.6182 14.9891 68.0247 14.9891H67.5633C67.2373 14.9891 66.9422 14.804 66.8118 14.5176L65.379 11.3712L64.9152 10.3471C64.6303 9.71802 63.6997 9.71614 63.4121 10.3442L62.9417 11.3712L62.1657 13.1048L61.5225 14.5175Z'
              fill='#111111'
            />
            <path
              d='M74.3018 15.1399C76.317 15.1399 77.7602 14.0093 77.7602 12.3889C77.7738 11.0447 76.8616 10.1905 75.4592 9.72568L74.7784 9.49955C73.7436 9.16043 73.2807 8.95945 73.2807 8.46948C73.2807 8.00473 73.8661 7.79116 74.4516 7.79116C74.7856 7.79116 75.1197 7.86212 75.4272 8.00803C75.8579 8.21247 76.4158 8.24987 76.7525 7.92121L76.9827 7.69664C77.2942 7.39273 77.3014 6.89743 76.9418 6.64717C76.186 6.12131 75.3557 5.91943 74.4243 5.91943C72.5045 5.91943 71.0885 6.93695 71.0885 8.67046C71.0885 9.88903 71.9463 10.7557 73.5257 11.2457L74.2065 11.4593C75.1868 11.7608 75.5544 12.0748 75.5544 12.527C75.5544 12.9667 75.1052 13.2681 74.3835 13.2681C73.929 13.2681 73.4297 13.1129 73.0043 12.8322C72.6145 12.5751 72.0713 12.4926 71.704 12.7786L71.3237 13.0749C70.9856 13.3383 70.9163 13.817 71.2394 14.0972C72.0065 14.7623 73.0715 15.1399 74.3018 15.1399Z'
              fill='#111111'
            />
            <path
              d='M41.4964 10.5965C41.4964 12.0412 42.7355 13.2722 44.315 13.2722C44.4389 13.2722 44.5607 13.2645 44.6801 13.2496C44.9777 13.2124 45.2894 13.2733 45.5055 13.4727L45.9405 13.8741C46.3405 14.243 46.2454 14.8786 45.711 15.0229C45.2676 15.1425 44.7991 15.2068 44.315 15.2068C41.5509 15.2068 39.3179 13.1341 39.3179 10.5965C39.3179 8.05907 41.5509 5.98633 44.315 5.98633C47.0653 5.98633 49.3119 8.05907 49.3119 10.5965C49.3119 11.2448 49.1653 11.8627 48.9011 12.4235C48.6956 12.8599 48.1056 12.9106 47.7457 12.5786L47.2721 12.1417C47.0166 11.906 46.9608 11.5416 47.0437 11.2112C47.0934 11.013 47.1198 10.807 47.1198 10.5965C47.1198 9.15192 45.8807 7.92087 44.315 7.92087C42.7355 7.92087 41.4964 9.15192 41.4964 10.5965Z'
              fill='#111111'
            />
            <path
              d='M80.7902 15.2064C81.4593 15.2064 82.0018 14.6866 82.0018 14.0455C82.0018 13.4043 81.4593 12.8845 80.7902 12.8845C80.1211 12.8845 79.5786 13.4043 79.5786 14.0455C79.5786 14.6866 80.1211 15.2064 80.7902 15.2064Z'
              fill='#00EEEE'
            />
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M4.1 0C1.83564 0 0 1.75888 0 3.92858V17.597C0 19.7667 1.83564 21.5256 4.10001 21.5256H18.3649C20.6292 21.5256 22.4649 19.7667 22.4649 17.597V3.92857C22.4649 1.75888 20.6292 0 18.3649 0H4.1ZM8.98613 6.9962C9.35013 6.98817 9.71675 7.12101 9.99457 7.39475C11.8406 9.21384 14.8896 9.21384 16.7357 7.39476C17.2754 6.86288 18.1505 6.86288 18.6903 7.39476C19.2301 7.9266 19.2301 8.789 18.6903 9.32085L14.487 13.4627C14.3813 13.5669 14.2656 13.6629 14.1424 13.7476C13.6035 14.1183 12.8561 14.0667 12.3751 13.5928L12.2433 13.4627C10.4593 11.7049 7.51298 11.7049 5.7291 13.4627C5.18935 13.9947 4.31425 13.9947 3.7745 13.4627C3.23475 12.9309 3.23475 12.0686 3.7745 11.5367L7.97776 7.39476C8.25551 7.12103 8.62214 6.98817 8.98613 6.9962Z'
              fill='#111111'
            />
          </g>
          <defs>
            <clipPath id='clip0_1880_21191'>
              <rect width='82' height='22' fill='white' />
            </clipPath>
          </defs>
        </svg>
      </a>
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
