import React, { useState } from 'react'
import LogoImage from '../../img/icons/LogoImage'
import LogoText from '../../img/icons/LogoText'
import LibrarySideMenu from '../library_side_menu'
import SunIcon from '../../img/icons/SunIcon'
import MoonIcon from '../../img/icons/MoonIcon'
import StudyTestPlan from '../study_test_plan'
import Navbar from '../navbar'
import StudyTestMobilePlan from '../study_test_mobile_plan'
import Footer from '../footer'
import { StatsPlan } from '../stats-plan'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setTheme } from '../../store/siteSlice/siteSlice'
import { MobileMenu } from '../mobile-menu'
import { useTranslation } from 'react-i18next'
import { useBodyTheme } from '../../hooks/use-body-theme'


function StatsLayout(props: any) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [sideCollapsed, setSideCollapsed] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const { isDark } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const {t} = useTranslation();

  useBodyTheme(isDark)

  return (
    <>
      <MobileMenu isVisible={openMobileMenu} hide={() => setOpenMobileMenu(false)} />
      <div className='app'>
        {/* SIDE */}
        <aside className={`side ${sideCollapsed ? 'side-mini' : ''}`}>
          <a href='/' className='side-logo'>
            <LogoImage />
            <div className='side-logo__text'>
              <LogoText />
            </div>
          </a>
          <div className='side-content'>
            <div className={isCollapsed ? 'side-wrap side-wrap__hidden' : 'side-wrap'}>
              <div
                className={`side-plan__close  ${isCollapsed ? 'closed' : ''}`}
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
            {isCollapsed && <StatsPlan sideCollapsed={sideCollapsed} />}
          </div>
          <button className='side__close btn' style={{ display: 'none' }}>
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
        <main
          className='main'
          style={{
            // overflow: 'scroll',
            height: '100dvh'
          }}
        >
          {/* HEADER */}
          <Navbar
            openMobileMenu={() => setOpenMobileMenu(true)}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          {/* CONTENT*/}
          <div
            className='content'
            style={{
              overflowY: 'scroll',
              height: '100%',
              paddingBottom: '10rem'
            }}
          >
            {/* STUDY STUDY-FULL*/}
            {props.children}
          </div>
        </main>
      </div>
      {/* LIBRARY MOBILE PLAN */}
      {/* <StudyTestMobilePlan /> */}
      {/* FOOTER */}
      <Footer />
    </>
  )
}

export default StatsLayout
