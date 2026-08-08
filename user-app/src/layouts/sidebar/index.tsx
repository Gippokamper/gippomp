import React from 'react'
import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import { Link, NavLink } from 'react-router-dom'
import { nav_data } from '../../data/nav_data'
import { useTranslation } from 'react-i18next'
//side-mini

interface IProps {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}
function Sidebar(props: IProps) {
  const { t } = useTranslation()
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
