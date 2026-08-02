import { useState } from 'react'
import Navbar from '../../layouts/navbar'
import Sidebar from '../../layouts/sidebar'
import Footer from '../footer'
import { MobileMenu } from '../mobile-menu'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useBodyTheme } from '../../hooks/use-body-theme'

export const MainLayout = (props: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isDark } = useSelector((state: RootState) => state.site)
  const [openMenu, setOpenMenu] = useState(false)

  useBodyTheme(isDark)

  return (
    <>
      {/* MOBILE-MENU*/}
      <MobileMenu isVisible={openMenu} hide={() => setOpenMenu(false)} />
      <div className='app'>
        {/* SIDE */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        {/* MAIN */}
        <main className='main'>
          {/* HEADER */}
          <Navbar openMobileMenu={() => setOpenMenu(true)} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
