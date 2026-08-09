import React, { useMemo, useState } from 'react'
import Navbar from '../navbar'
import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import CloseIcon from '../../img/icons/CloseIcon'
import LibrarySideMenu from '../library_side_menu'
import LibraryFooter from '../library_footer'
import LibraryPlan from '../library_plan'
import LibraryMobileHeader from '../library_mobile_header'
import LibraryMobilePlan from '../library_mobile_plan'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useTranslation } from 'react-i18next'
import { useBodyTheme } from '../../hooks/use-body-theme'
export const GET_THEME = () => {
  const theme = window.localStorage.getItem('theme')
  return theme
}

function LibraryLayout(props: any) {
  const {t} = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMobilePlan, setOpenMobilePlan] = useState(false)
  const { theme } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()

  useBodyTheme(theme)

  return (
    <>
      <div className='app'>
        {/* SIDE */}
        <aside className={`side ${isCollapsed ? 'side-mini' : ''}`}>
          <a href='/' className='side-logo'>
            <LogoImage />
            <div className='side-logo__text'>
              <LogoText />
            </div>
          </a>
          <div className='side-content'>
            <div className='side-wrap side-wrap__hidden'>
              {/*
                Tungi rejim tugmasi bu yerdan olib tashlandi — u yuqoridagi
                profil menyusida, ikki joyda turishi shart emas edi.
              */}
              <LibrarySideMenu />
            </div>
          </div>
          <button
            className={`side__close btn  ${isCollapsed ? 'closed' : ''}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <CloseIcon />
          </button>
        </aside>
        {/* MAIN */}
        <main className='main'>
          {/* HEADER */}
          <Navbar openMobileMenu={() => {}} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          {/* MOBILE LIBRARY*/}
          <LibraryMobileHeader openPlan={() => setOpenMobilePlan(true)} />
          {/* CONTENT*/}
          <div
            className='content content--article'
            style={{
              width: '100%',
              height: '90dvh',
              // 'scroll' kontent kalta bo'lsa ham bo'sh scrollbar chizadi.
              overflowY: 'auto'
            }}
            id='nestedRelativeContainerElement'
          >
            {/* LIBRARY*/}
            {/* Mundarija — chapdagi ustun o'rniga kontent tepasida, gorizontal. */}
            <LibraryPlan />
            {props.children}
          </div>
        </main>
      </div>
      {/* LIBRARY MOBILE PLAN */}
      <LibraryMobilePlan isVisible={openMobilePlan} hide={() => setOpenMobilePlan(false)} />
      {/* LIBRARY GALLERY */}

      {/* FOOTER, footer-library for this page */}
      <LibraryFooter />
    </>
  )
}

export default LibraryLayout
