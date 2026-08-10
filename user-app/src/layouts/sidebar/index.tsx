import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import { nav_data, nav_groups } from '../../data/nav_data'
import type { NavItem } from '../../data/nav_data'
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
 * `side-rail`, ikkitasida eski keng ustun. Endi ko'rinish shu yerda bir marta
 * belgilanadi.
 *
 * Ikki holat:
 *   keng (16.5rem) — piktogramma chapda, nomi yonida, guruhlangan;
 *   tor  (4.5rem)  — faqat piktogramma, nomi `title` da.
 * Ilgari yig'ilganda panel butunlay yo'qolardi va navigatsiya qo'ldan
 * ketardi — tor holat shuning o'rniga.
 *
 * Holat Redux'da (`site.sidebarCollapsed`) va localStorage'da: ilgari har
 * layout o'z `useState` ida saqlagani uchun sahifa almashganda menyu
 * qaytadan ochilib ketardi.
 */
function AppSidebar({ panel }: IProps) {
  const { t } = useTranslation()
  const collapsed = useSelector((state: RootState) => state.site.sidebarCollapsed)

  /*
   * Tor holatda nom ko'rinmaydi. `.side` da `overflow: hidden` bor (yopilish
   * silliq bo'lishi uchun), shuning uchun CSS bilan chizilgan izoh qirqilib
   * qolardi — brauzerning o'z `title` i ishonchliroq.
   */
  const renderItem = (nav: NavItem) => (
    <li key={nav.id}>
      {/* `isPending` faqat data-router'da bo'ladi, bu ilovada oddiy
          `<Routes>` — shuning uchun faqat `isActive` tekshiriladi. */}
      <NavLink
        to={nav.to}
        title={collapsed ? t(nav.text) : undefined}
        className={({ isActive }) => (isActive ? 'current' : '')}
      >
        {nav.icon}
        <span>{t(nav.text)}</span>
      </NavLink>
    </li>
  )

  const ungrouped = nav_data.filter(nav => !nav.group)

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
        <nav className='side-wrap ui-scroll' aria-label={t('Main menu', 'Asosiy menyu')}>
          {!!ungrouped.length && <ul className='side-menu'>{ungrouped.map(renderItem)}</ul>}

          {nav_groups.map(group => {
            const items = nav_data.filter(nav => nav.group === group.id)
            if (!items.length) return null

            return (
              <div className='side-group' key={group.id}>
                {/* Tor holatda sarlavha o'rniga ingichka ajratgich — CSS da. */}
                <div className='side-group__title'>{t(group.label, group.fallback)}</div>
                <ul className='side-menu'>{items.map(renderItem)}</ul>
              </div>
            )
          })}
        </nav>
        {panel}
      </div>
    </aside>
  )
}

export default AppSidebar
