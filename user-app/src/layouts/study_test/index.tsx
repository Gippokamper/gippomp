import React, { useState } from 'react'
import AppSidebar from '../sidebar'
import StudyTestPlan from '../study_test_plan'
import Navbar from '../navbar'
import StudyTestMobilePlan from '../study_test_mobile_plan'
import { useStopwatch } from 'react-timer-hook'
import LibraryMobileHeader from '../library_mobile_header'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useTranslation } from 'react-i18next'
import MinusIcon from '../../img/icons/MinusIcon'
import PlusIcon from '../../img/icons/PlusIcon'
import { decrement, increment } from '../../store/slices/htmlSlice'
import { useBodyTheme } from '../../hooks/use-body-theme'

function StudyTestLayout(props: any) {
  /*
   * Savollar ro'yxati ustuni yig'ilganmi — o'z tutqichi bilan boshqariladi.
   * Sarlavhadagi tugma esa chap menyuni yig'adi; ilgari ikkalasi bitta
   * holatga bog'langan edi va test yechayotganda ro'yxat kutilmaganda
   * yo'qolib qolardi.
   */
  const [planCollapsed, setPlanCollapsed] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const stopWatch = useStopwatch({
    autoStart: true
  })
  const { theme } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useBodyTheme(theme)

  return (
    <>
      <div className='app'>
        {/* SIDE */}
        <AppSidebar
          panel={
            <>
              <button
                type='button'
                className={`side-plan__close ${planCollapsed ? 'closed' : ''}`}
                aria-expanded={!planCollapsed}
                aria-label={t('Questions')}
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
              <StudyTestPlan stopWatch={stopWatch} sideCollapsed={planCollapsed} />
            </>
          }
        />
        {/* MAIN */}
        <main className='main test__layout'>
          {/* HEADER */}
          <Navbar openMobileMenu={() => {}} />
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
