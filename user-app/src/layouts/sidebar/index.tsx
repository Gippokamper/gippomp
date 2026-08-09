import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import { nav_data } from '../../data/nav_data'
import { RootState } from '../../store'
import './sidebar.scss'

interface IProps {
  /*
   * Modullar yonidagi qo'shimcha ustun: test yechishda savollar ro'yxati,
   * statistikada oxirgi seanslar. Panel bo'lmasa menyu tor "rail" bo'lib
   * qoladi.
   */
  panel?: React.ReactNode
}

/*
 * Chap menyu — ILOVANING YAGONA nusxasi.
 *
 * Ilgari bu markup to'rt joyda takrorlangan edi (main, library, stats-layout,
 * study_test) va ular vaqt o'tib bir-biridan uzoqlashgan: ikkitasida tor
 * `side-rail`, ikkitasida eski keng ustun; ikkitasida tungi rejim tugmasi
 * qolib ketgan (u profil menyusiga ko'chirilgan bo'lsa ham). Endi ko'rinish
 * shu yerda bir marta belgilanadi.
 *
 * Yig'ilgan holat Redux'da (`site.sidebarCollapsed`) va localStorage'da:
 * ilgari har layout o'z `useState` ida saqlagani uchun sahifa almashganda
 * menyu qaytadan ochilib ketardi.
 */
function AppSidebar({ panel }: IProps) {
  const { t } = useTranslation()
  const collapsed = useSelector((state: RootState) => state.site.sidebarCollapsed)

  return (
    <aside
      className={[
        'side side-rail',
        panel ? 'side-rail--with-panel' : '',
        collapsed ? 'side-mini' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Ilgari `/library` ga ketardi — bosh sahifa esa `/home`. */}
      <Link to='/home' className='side-logo'>
        <LogoImage />
        <div className='side-logo__text'>
          <LogoText />
        </div>
      </Link>
      <div className='side-content'>
        <nav className='side-wrap' aria-label={t('Main menu')}>
          <ul className='side-menu'>
            {nav_data.map(nav => (
              <li key={nav.id}>
                {/* `isPending` faqat data-router'da bo'ladi, bu ilovada oddiy
                    `<Routes>` — shuning uchun faqat `isActive` tekshiriladi. */}
                <NavLink to={nav.to} className={({ isActive }) => (isActive ? 'current' : '')}>
                  {nav.icon}
                  <span>{t(nav.text)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {panel}
      </div>
    </aside>
  )
}

export default AppSidebar
