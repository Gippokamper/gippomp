import React from 'react'
import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import { Link, NavLink } from 'react-router-dom'
import { nav_data } from '../../data/nav_data'
import SunIcon from '../../img/icons/SunIcon'
import MoonIcon from '../../img/icons/MoonIcon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setTheme } from '../../store/siteSlice/siteSlice'
import { useTranslation } from 'react-i18next'
//side-mini

interface IProps {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}
function Sidebar(props: IProps) {
  const {t} = useTranslation();
  const { isDark } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  return (
    <aside className={props.isCollapsed ? 'side side-mini' : 'side'}>
      <Link to='/library' className='side-logo'>
        <LogoImage />
        <div className='side-logo__text'>
          <LogoText />
        </div>
      </Link>
      <div className='side-content'>
        <div className='side-wrap'>
          <ul className='side-menu'>
            {nav_data?.map(nav => (
              <li key={nav.to}>
                <NavLink
                  to={nav.to}
                  className={({ isActive, isPending }) => (isPending ? 'current' : isActive ? 'current' : '')}
                  //   className='current'
                >
                  {nav.icon}
                  <span>{t(nav.text)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className='side-mode'>
            <button
              className={isDark ? 'light' : 'current light'}
              onClick={() => {
                props.isCollapsed ? dispatch(setTheme(!isDark)) : dispatch(setTheme(false))
              }}
            >
              <SunIcon />
              <span>{t('Light')}</span>
            </button>
            <button
              className={!isDark ? 'dark' : 'current dark'}
              onClick={() => {
                props.isCollapsed ? dispatch(setTheme(!isDark)) : dispatch(setTheme(true))
              }}
            >
              <MoonIcon />
              <span>{t('Dark')}</span>
            </button>
          </div>
            <a href="https://www.novastudio.uz/" className='novas'>
                <svg width="82" height="22" viewBox="0 0 82 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1880_21191)">
                        <path d="M36.0063 14.9891C36.4592 14.9891 36.8263 14.6372 36.8263 14.2034V6.85578C36.8263 6.42185 36.4592 6.07007 36.0063 6.07007H35.4677C35.0149 6.07007 34.6477 6.42185 34.6477 6.85578V9.37954C34.6477 10.1183 33.6801 10.4487 33.1925 9.87634L30.1964 6.35897C30.0407 6.17614 29.8075 6.07007 29.5611 6.07007H28.905C28.4521 6.07007 28.085 6.42185 28.085 6.85578V14.2034C28.085 14.6372 28.4521 14.9891 28.905 14.9891H29.4298C29.8827 14.9891 30.2498 14.6372 30.2498 14.2034V11.6747C30.2498 10.9364 31.2164 10.6056 31.7044 11.177L34.7149 14.701C34.8706 14.8833 35.1035 14.9891 35.3494 14.9891H36.0063Z" fill="#111111"/>
                        <path d="M54.2011 14.511C54.3298 14.8009 54.6268 14.9891 54.9556 14.9891H55.8184C56.1471 14.9891 56.444 14.8009 56.5729 14.511L59.837 7.16352C60.0672 6.64527 59.6702 6.07007 59.0825 6.07007H58.4886C58.1565 6.07007 57.8573 6.26192 57.7306 6.55599L56.1361 10.2571C55.8573 10.9044 54.9009 10.9052 54.6208 10.2585L53.0166 6.55463C52.8896 6.26128 52.5907 6.07007 52.2593 6.07007H51.6915C51.1036 6.07007 50.7067 6.64527 50.937 7.16352L54.2011 14.511Z" fill="#111111"/>
                        <path d="M61.5225 14.5175C61.3922 14.8039 61.097 14.9891 60.7709 14.9891H60.3097C59.7162 14.9891 59.3193 14.4036 59.5604 13.884L62.9703 6.53653C63.102 6.25286 63.3956 6.07007 63.7196 6.07007H64.6148C64.9387 6.07007 65.2324 6.25286 65.364 6.53653L68.7739 13.884C69.015 14.4036 68.6182 14.9891 68.0247 14.9891H67.5633C67.2373 14.9891 66.9422 14.804 66.8118 14.5176L65.379 11.3712L64.9152 10.3471C64.6303 9.71802 63.6997 9.71614 63.4121 10.3442L62.9417 11.3712L62.1657 13.1048L61.5225 14.5175Z" fill="#111111"/>
                        <path d="M74.3018 15.1399C76.317 15.1399 77.7602 14.0093 77.7602 12.3889C77.7738 11.0447 76.8616 10.1905 75.4592 9.72568L74.7784 9.49955C73.7436 9.16043 73.2807 8.95945 73.2807 8.46948C73.2807 8.00473 73.8661 7.79116 74.4516 7.79116C74.7856 7.79116 75.1197 7.86212 75.4272 8.00803C75.8579 8.21247 76.4158 8.24987 76.7525 7.92121L76.9827 7.69664C77.2942 7.39273 77.3014 6.89743 76.9418 6.64717C76.186 6.12131 75.3557 5.91943 74.4243 5.91943C72.5045 5.91943 71.0885 6.93695 71.0885 8.67046C71.0885 9.88903 71.9463 10.7557 73.5257 11.2457L74.2065 11.4593C75.1868 11.7608 75.5544 12.0748 75.5544 12.527C75.5544 12.9667 75.1052 13.2681 74.3835 13.2681C73.929 13.2681 73.4297 13.1129 73.0043 12.8322C72.6145 12.5751 72.0713 12.4926 71.704 12.7786L71.3237 13.0749C70.9856 13.3383 70.9163 13.817 71.2394 14.0972C72.0065 14.7623 73.0715 15.1399 74.3018 15.1399Z" fill="#111111"/>
                        <path d="M41.4964 10.5965C41.4964 12.0412 42.7355 13.2722 44.315 13.2722C44.4389 13.2722 44.5607 13.2645 44.6801 13.2496C44.9777 13.2124 45.2894 13.2733 45.5055 13.4727L45.9405 13.8741C46.3405 14.243 46.2454 14.8786 45.711 15.0229C45.2676 15.1425 44.7991 15.2068 44.315 15.2068C41.5509 15.2068 39.3179 13.1341 39.3179 10.5965C39.3179 8.05907 41.5509 5.98633 44.315 5.98633C47.0653 5.98633 49.3119 8.05907 49.3119 10.5965C49.3119 11.2448 49.1653 11.8627 48.9011 12.4235C48.6956 12.8599 48.1056 12.9106 47.7457 12.5786L47.2721 12.1417C47.0166 11.906 46.9608 11.5416 47.0437 11.2112C47.0934 11.013 47.1198 10.807 47.1198 10.5965C47.1198 9.15192 45.8807 7.92087 44.315 7.92087C42.7355 7.92087 41.4964 9.15192 41.4964 10.5965Z" fill="#111111"/>
                        <path d="M80.7902 15.2064C81.4593 15.2064 82.0018 14.6866 82.0018 14.0455C82.0018 13.4043 81.4593 12.8845 80.7902 12.8845C80.1211 12.8845 79.5786 13.4043 79.5786 14.0455C79.5786 14.6866 80.1211 15.2064 80.7902 15.2064Z" fill="#00EEEE"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.1 0C1.83564 0 0 1.75888 0 3.92858V17.597C0 19.7667 1.83564 21.5256 4.10001 21.5256H18.3649C20.6292 21.5256 22.4649 19.7667 22.4649 17.597V3.92857C22.4649 1.75888 20.6292 0 18.3649 0H4.1ZM8.98613 6.9962C9.35013 6.98817 9.71675 7.12101 9.99457 7.39475C11.8406 9.21384 14.8896 9.21384 16.7357 7.39476C17.2754 6.86288 18.1505 6.86288 18.6903 7.39476C19.2301 7.9266 19.2301 8.789 18.6903 9.32085L14.487 13.4627C14.3813 13.5669 14.2656 13.6629 14.1424 13.7476C13.6035 14.1183 12.8561 14.0667 12.3751 13.5928L12.2433 13.4627C10.4593 11.7049 7.51298 11.7049 5.7291 13.4627C5.18935 13.9947 4.31425 13.9947 3.7745 13.4627C3.23475 12.9309 3.23475 12.0686 3.7745 11.5367L7.97776 7.39476C8.25551 7.12103 8.62214 6.98817 8.98613 6.9962Z" fill="#111111"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_1880_21191">
                            <rect width="82" height="22" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </a>
        </div>
      </div>
      <button
        className={`side__close btn ${props.isCollapsed ? 'closed' : ''}`}
        onClick={() => props.setIsCollapsed(!props.isCollapsed)}
      >
        <svg width={16} height={16} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M10.5 3.625L6.125 8L10.5 12.375'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </aside>
  )
}

export default Sidebar
