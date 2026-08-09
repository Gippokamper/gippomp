import React, { useState } from 'react'
import AppSidebar from '../sidebar'
import Navbar from '../navbar'
import Footer from '../footer'
import { StatsPlan } from '../stats-plan'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { MobileMenu } from '../mobile-menu'
import { useTranslation } from 'react-i18next'
import { useBodyTheme } from '../../hooks/use-body-theme'

function StatsLayout(props: any) {
  /*
   * Oxirgi seanslar ustuni yig'ilganmi. Ilgari bu bitta `isCollapsed` bilan
   * chalkash edi: sarlavhadagi tugma ayni paytda ham modullar ro'yxatini
   * torroq qilardi, ham shu ustunni yo'q qilardi. Endi sarlavhadagi tugma
   * faqat chap menyuni yig'adi, bu ustunning o'z tutqichi bor.
   */
  const [planCollapsed, setPlanCollapsed] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const { theme } = useSelector((state: RootState) => state.site)
  const { t } = useTranslation()

  useBodyTheme(theme)

  return (
    <>
      <MobileMenu isVisible={openMobileMenu} hide={() => setOpenMobileMenu(false)} />
      <div className='app'>
        {/* SIDE */}
        <AppSidebar
          panel={
            <>
              <button
                type='button'
                className={`side-plan__close ${planCollapsed ? 'closed' : ''}`}
                aria-expanded={!planCollapsed}
                aria-label={t('Last sessions')}
                onClick={() => setPlanCollapsed(!planCollapsed)}
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
              <StatsPlan sideCollapsed={planCollapsed} />
            </>
          }
        />
        {/* MAIN */}
        <main
          className='main'
          style={{
            // overflow: 'scroll',
            height: '100dvh'
          }}
        >
          {/* HEADER */}
          <Navbar openMobileMenu={() => setOpenMobileMenu(true)} />
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
      {/* FOOTER */}
      <Footer />
    </>
  )
}

export default StatsLayout
