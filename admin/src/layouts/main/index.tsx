import * as React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import SideNav from './side-nav'
import MobileSideNav from './mobile-side-nav'
import AppBarDesktop from './app-bar'
import AppBarMobile from './app-bar-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { ChevronLeft } from '@mui/icons-material'

interface Props {
  children: React.ReactNode
}

// "Orqaga" tugmasi faqat ichki (ota-sahifasi bor) manzillarda kerak.
// Ilgari u har bir sahifada turardi va bosh sahifadan bosilganda admin'ni
// brauzer tarixi bo'yicha butunlay tashqariga chiqarib yuborardi.
const getParentPath = (pathname: string): string | null => {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 2) return null
  return '/' + parts.slice(0, -1).join('/')
}

export default function MainLayout(props: Props) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [toggled, setToggled] = React.useState(false)
  const [broken, setBroken] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // Ilgari to'g'ridan-to'g'ri window.innerWidth o'qilardi — u faqat render
  // paytida bir marta hisoblanadi, shuning uchun oynani kattalashtirsangiz
  // mobil ko'rinish qotib qolardi. useMediaQuery resize'ga qayta render beradi.
  const isDesktop = useMediaQuery('(min-width:900px)')
  const parentPath = getParentPath(location.pathname)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100%', bgcolor: '#fff' }}>
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
          collapsed={false}
          broken={broken}
          toggled={toggled}
          setBroken={setBroken}
          setToggled={setToggled}
          setCollapsed={setCollapsed}
        />
      )}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          bgcolor: '#eef2f5'
        }}
      >
        {isDesktop ? <AppBarDesktop /> : <AppBarMobile toggled={toggled} setToggled={setToggled} />}
        {/* Scroll'ni faqat shu konteyner boshqaradi — ilgari ikki qavatda
            overflow bo'lgani uchun keraksiz bo'sh scrollbar'lar chizilardi. */}
        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          {parentPath && (
            <Button sx={{ mb: 1 }} size='small' onClick={() => navigate(parentPath)} startIcon={<ChevronLeft />}>
              Orqaga
            </Button>
          )}
          {props.children}
        </Box>
      </Box>
    </Box>
  )
}
