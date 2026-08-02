import { navData } from '../../../data/navData'
// import styles from './index.module.css'
import React, { useState } from 'react'
import { Box, Button, ButtonGroup, IconButton, List, ListItem, Toolbar, Typography } from '@mui/material'
import styles from './index.module.scss'
import MenuButton from '../../../components/menu-item'
import Sun from '../../../assets/icons/Sun'
import Moon from '../../../assets/icons/Moon'
import { ChevronLeft, ChevronRight, ForkLeft } from '@mui/icons-material'
import CategoryButton from '../../../components/category-button'

export interface ISideNavProps {
  collapsed: boolean
  toggled: boolean
  broken: boolean
  setBroken: React.Dispatch<React.SetStateAction<boolean>>
  setToggled: React.Dispatch<React.SetStateAction<boolean>>
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

// hex to rgba converter

function SideNav(props: ISideNavProps) {
  const [theme, setTheme] = useState('Light')

  const handleCollapse = () => {
    if (window.innerWidth > 600) {
      props.setCollapsed(!props.collapsed)
    } else {
      props.setToggled(false)
    }
  }
  return (
    <Box className={`${styles.sidenav} ${props.collapsed ? styles.sidenav_collapsed : ''}`}>
      <IconButton className={styles.collapse_controller} onClick={handleCollapse}>
        {!props.collapsed ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
      {/* disableGutters — MUI Toolbar'ning standart 24px chap/o'ng padding'i
          yig'ilgan panelni keraksiz kengaytirib turardi. */}
      <Toolbar disableGutters sx={{ justifyContent: 'center', flexShrink: 0 }}>
        <img
          src={require('../../../assets/images/logo.webp')}
          alt='logo'
          style={{
            width: props.collapsed ? '5rem' : '11.4375rem',
            marginTop: '0.7rem',
            marginBottom: '2.5rem',
            flexShrink: 0,
            transition: 'width 0.2s ease'
          }}
        />
      </Toolbar>
      <Box
        className={styles.hideScroll}
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          mb: '5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {navData.map(nav =>
          nav.children ? (
            nav.children.map((child, i) =>
              i !== 0 ? (
                <MenuButton collapsed={props.collapsed} {...{ ...child, link: nav.link + child.link }} key={i} />
              ) : (
                // Ro'yxat elementi sifatida qaytarilgan fragment'da key bo'lishi shart,
                // aks holda React "unique key" ogohlantirishini beradi.
                <React.Fragment key={nav.link + child.link}>
                  <MenuButton collapsed={props.collapsed} {...nav} />
                  <MenuButton collapsed={props.collapsed} {...{ ...child, link: nav.link + child.link }} />
                </React.Fragment>
              )
            )
          ) : (
            <MenuButton collapsed={props.collapsed} {...nav} key={nav.link} />
          )
        )}
      </Box>

      {props.collapsed ? (
        <IconButton
          className={styles.theme_controller_collapsed}
          onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
        >
          {theme === 'Light' ? <Sun /> : <Moon />}
        </IconButton>
      ) : (
        <Box className={styles.theme_controller}>
          <Button
            className={theme === 'Dark' ? styles.theme_controller_btn : styles.theme_controller_btn_active}
            startIcon={<Sun />}
            onClick={() => setTheme('Light')}
          >
            Light
          </Button>
          <Button
            className={theme === 'Light' ? styles.theme_controller_btn : styles.theme_controller_btn_active}
            startIcon={<Moon />}
            onClick={() => setTheme('Dark')}
          >
            Dark
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default SideNav
