import React, { useState } from 'react'
import Navbar from '../navbar'
import AppSidebar from '../sidebar'
import LibraryFooter from '../library_footer'
import LibraryPlan from '../library_plan'
import LibraryMobileHeader from '../library_mobile_header'
import LibraryMobilePlan from '../library_mobile_plan'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useBodyTheme } from '../../hooks/use-body-theme'
export const GET_THEME = () => {
  const theme = window.localStorage.getItem('theme')
  return theme
}

function LibraryLayout(props: any) {
  const [openMobilePlan, setOpenMobilePlan] = useState(false)
  const { theme } = useSelector((state: RootState) => state.site)

  useBodyTheme(theme)

  return (
    <>
      <div className='app'>
        {/* SIDE */}
        <AppSidebar />
        {/* MAIN */}
        <main className='main'>
          {/* HEADER */}
          <Navbar openMobileMenu={() => {}} />
          {/* MOBILE LIBRARY*/}
          <LibraryMobileHeader openPlan={() => setOpenMobilePlan(true)} />
          {/* CONTENT*/}
          <div
            className='content content--article'
            style={{
              width: '100%',
              // Balandlik `.content` da: `100dvh - sarlavha`. Ilgari bu yerda
              // `90dvh` turardi — idish ekrandan uzunroq bo'lib, tashqarida
              // yana bir aylantirish paydo bo'lardi.
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
