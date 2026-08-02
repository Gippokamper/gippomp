import * as React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import SideNav from './side-nav'
import MobileSideNav from './mobile-side-nav'
import AppBarDesktop from './app-bar'
import AppBarMobile from './app-bar-mobile'
import Home from '../../pages/home'
import { Route, Routes, useNavigate, useRoutes } from 'react-router-dom'
import Users from '../../pages/users'
import Category from '../../pages/category'
import CategoryList from '../../pages/category-list'
import { Button } from '@mui/material'
import { ChevronLeft } from '@mui/icons-material'

// const drawerWidth = '21.5625rem'

interface Props {
  children: React.ReactNode
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
}

export default function MainLayout(props: Props) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [toggled, setToggled] = React.useState(false)
  const navigate = useNavigate()
  const [broken, setBroken] = React.useState(false)
  // Ilgari to'g'ridan-to'g'ri window.innerWidth o'qilardi — u faqat render
  // paytida bir marta hisoblanadi, shuning uchun oynani kattalashtirsangiz
  // mobil ko'rinish qotib qolardi. useMediaQuery resize'ga qayta render beradi.
  const isDesktop = useMediaQuery('(min-width:601px)')

  return (
    <Box
      style={{
        flexGrow: 1,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        maxHeight: '100vh',
        maxWidth: '100vw'
      }}
    >
      <CssBaseline />
      {isDesktop ? (
        <SideNav
          collapsed={collapsed}
          broken={broken}
          toggled={toggled}
          setBroken={setBroken}
          setToggled={setToggled}
          setCollapsed={setCollapsed}
        />
      ) : (
        <MobileSideNav
          collapsed={collapsed}
          broken={broken}
          toggled={toggled}
          setBroken={setBroken}
          setToggled={setToggled}
          setCollapsed={setCollapsed}
        />
      )}

      <Box
        style={{
          flex: 1,
          backgroundColor: '#EEF2F5',
          margin: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '100%',
          maxHeight: '100vh',
          position: 'relative',
          padding: '2rem',
          // 'scroll' scrollbar'ni kontent sig'sa ham doim chizadi — 'auto' faqat
          // kerak bo'lganda ko'rsatadi.
          overflow: 'auto'
        }}
      >
        {isDesktop ? <AppBarDesktop /> : <AppBarMobile toggled={toggled} setToggled={setToggled} />}
        {/* Ichki Box'da overflow bo'lmasligi kerak: balandligi cheklanmagani uchun
            u hech qachon scroll qilinmaydi, lekin 'scroll' kontent ostida bo'sh
            gorizontal scrollbar chizib qo'yardi. Scroll'ni tashqi Box boshqaradi. */}
        <Box style={{ paddingTop: '7rem' }}>
          <Button
            sx={{
              mb: '0.5rem'
            }}
            onClick={() => navigate(-1)}
            startIcon={<ChevronLeft />}
          >
            Orqaga
          </Button>
          {props.children}
        </Box>
      </Box>
    </Box>
  )
}
