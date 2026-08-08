import React from 'react'
import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import { Link, NavLink } from 'react-router-dom'
import { nav_data } from '../../data/nav_data'
import { useTranslation } from 'react-i18next'
import './sidebar-rail.scss'
//side-mini

interface IProps {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}
function Sidebar(props: IProps) {
  const { t } = useTranslation()
  return (
    <aside className={`side side-rail ${props.isCollapsed ? 'side-mini' : ''}`}>
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
      {/*
        Chekkadagi yashil dumaloq tutqich olib tashlandi. Menyuni yig'ish
        yuqoridagi paneldagi tugma (`header__side`) orqali ishlaydi.
      */}
    </aside>
  )
}

export default Sidebar
