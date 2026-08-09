import Navbar from '../../layouts/navbar'
import AppSidebar from '../../layouts/sidebar'
import Footer from '../footer'
import { MobileMenu } from '../mobile-menu'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useBodyTheme } from '../../hooks/use-body-theme'

export const MainLayout = (props: any) => {
  const { theme } = useSelector((state: RootState) => state.site)
  const [openMenu, setOpenMenu] = useState(false)

  useBodyTheme(theme)

  return (
    <>
      {/* MOBILE-MENU*/}
      <MobileMenu isVisible={openMenu} hide={() => setOpenMenu(false)} />
      <div className='app'>
        {/* SIDE */}
        <AppSidebar />
        {/* MAIN */}
        <main className='main'>
          {/* HEADER */}
          <Navbar openMobileMenu={() => setOpenMenu(true)} />
          {/* CONTENT*/}
          <div
            className='content'
            style={{
              overflowY: 'scroll',
              height: '100%',
             ...(props?.disablePadding?{}: {paddingBottom: '15rem'})
            }}
          >
            {/* LIBRARY*/}
            {props.children}
          </div>
        </main>
      </div>
      {/* FOOTER */}
      <Footer />
    </>
  )
}
