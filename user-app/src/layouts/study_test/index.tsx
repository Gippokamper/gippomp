import React, { useState } from 'react'
import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import LibrarySideMenu from '../library_side_menu'
import SunIcon from '../../img/icons/SunIcon'
import MoonIcon from '../../img/icons/MoonIcon'
import StudyTestPlan from '../study_test_plan'
import Navbar from '../navbar'
import StudyTestMobilePlan from '../study_test_mobile_plan'
import { useStopwatch } from 'react-timer-hook'
import LibraryMobileHeader from '../library_mobile_header'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../../store/siteSlice/siteSlice'
import { RootState } from '../../store'
import { useTranslation } from 'react-i18next'
import MinusIcon from '../../img/icons/MinusIcon'
import PlusIcon from '../../img/icons/PlusIcon'
import { decrement, increment } from '../../store/slices/htmlSlice'
import { useBodyTheme } from '../../hooks/use-body-theme'

function StudyTestLayout(props: any) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [sideCollapsed, setSideCollapsed] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const stopWatch = useStopwatch({
    autoStart: true
  })
  const { isDark, theme } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useBodyTheme(theme)

  return (
    <>
      <div className='app'>
        {/* SIDE */}
        <aside
          className={`side ${sideCollapsed ? 'side-mini' : ''}`}
          style={{
            paddingRight: 0
          }}
        >
          <a href='/' className='side-logo'>
            <LogoImage />
            <div className='side-logo__text'>
              <LogoText />
            </div>
          </a>
          <div className='side-content'>
            <div className={isCollapsed ? 'side-wrap side-wrap__hidden' : 'side-wrap'}>
              <div
                className={`side-plan__close ${sideCollapsed ? 'closed' : ''}`}
                onClick={() => setSideCollapsed(!sideCollapsed)}
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
              </div>
              <LibrarySideMenu />
              <div className='side-mode'>
                <button
                  className={!isDark ? 'current light' : 'dark'}
                  onClick={() => {
                    isCollapsed ? dispatch(setTheme(!isDark)) : dispatch(setTheme(false))
                  }}
                >
                  <SunIcon />
                  <span>{t('Light')}</span>
                </button>
                <button
                  className={isDark ? 'current dark' : 'light'}
                  onClick={() => {
                    isCollapsed ? dispatch(setTheme(!isDark)) : dispatch(setTheme(true))
                  }}
                >
                  <MoonIcon />
                  <span>{t('Dark')}</span>
                </button>
              </div>
            </div>
            {isCollapsed && <StudyTestPlan stopWatch={stopWatch} sideCollapsed={sideCollapsed} />}
          </div>
          <button className={`side__close btn  ${isCollapsed ? 'closed' : ''}`} style={{ display: 'none' }}>
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
        {/* MAIN */}
        <main className='main test__layout'>
          {/* HEADER */}
          <Navbar openMobileMenu={() => {}} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          {/* MOBILE LIBRARY*/}
          <LibraryMobileHeader openPlan={() => setOpenMobileMenu(true)} />
          {/* CONTENT*/}
          <div
            className='content test__content'
            style={{
              maxHeight: '100dvh',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', justifyContent: 'end' }}>
              <div className='library-head__btn'>
                <MinusIcon onClick={() => dispatch(decrement())} />
                <span>{t('Tt')}</span>
                <PlusIcon onClick={() => dispatch(increment())} />
              </div>
            </div>
            {/* STUDY STUDY-FULL*/}
            {props.children({ stopWatch })}
          </div>
        </main>
      </div>
      {/* LIBRARY MOBILE PLAN */}
      <StudyTestMobilePlan open={openMobileMenu} stopWatch={stopWatch} close={() => setOpenMobileMenu(false)} />
      {/* FOOTER */}
      {/* <Footer /> */}
    </>
  )
}

export default StudyTestLayout
