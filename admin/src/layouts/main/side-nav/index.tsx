import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { navSections } from '../../../data/navData'
import MenuButton from '../../../components/menu-item'

export interface ISideNavProps {
  collapsed: boolean
  toggled: boolean
  broken: boolean
  setBroken: React.Dispatch<React.SetStateAction<boolean>>
  setToggled: React.Dispatch<React.SetStateAction<boolean>>
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  /** mobil rejimda menyudan o'tilganda panelni yopish uchun */
  onNavigate?: () => void
}

function SideNav(props: ISideNavProps) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        borderRight: '1px solid rgba(18, 27, 45, 0.08)',
        width: props.collapsed ? '4.75rem' : '16rem',
        transition: 'width .2s ease',
        zIndex: 100
      }}
    >
      <IconButton
        onClick={() => props.setCollapsed(!props.collapsed)}
        size='small'
        aria-label={props.collapsed ? t('Expand') : t('Collapse')}
        sx={{
          position: 'absolute',
          top: '1.75rem',
          right: '-0.75rem',
          width: '1.5rem',
          height: '1.5rem',
          color: '#fff',
          backgroundImage: 'linear-gradient(90deg, #3f8f00 0%, #aacc3a 100%)',
          boxShadow: '0 2px 6px rgba(0,0,0,.15)',
          zIndex: 101,
          '&:hover': { backgroundImage: 'linear-gradient(90deg, #3f8f00 0%, #aacc3a 100%)', filter: 'brightness(.95)' },
          '& svg': { fontSize: '1rem' }
        }}
      >
        {props.collapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '4.5rem', flexShrink: 0 }}>
        <img
          src={require('../../../assets/images/logo.webp')}
          alt='Gippokamp'
          style={{ width: props.collapsed ? '2.25rem' : '9rem', objectFit: 'contain', transition: 'width .2s ease' }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: props.collapsed ? 1 : 1.5,
          pb: 2,
          '&::-webkit-scrollbar': { width: '0.35rem' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(18,27,45,.15)', borderRadius: '1rem' }
        }}
      >
        {navSections.map((section, index) => (
          <Box key={section.title ?? `section-${index}`} sx={{ mb: 1.5 }}>
            {section.title && !props.collapsed && (
              <Typography
                sx={{
                  px: 1.5,
                  mt: 1.5,
                  mb: 0.75,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'text.secondary'
                }}
              >
                {t(section.title)}
              </Typography>
            )}
            {section.title && props.collapsed && (
              <Box sx={{ my: 1, borderTop: '1px solid rgba(18,27,45,.08)' }} />
            )}
            {section.items.map(item => (
              <MenuButton key={item.link} collapsed={props.collapsed} onNavigate={props.onNavigate} {...item} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default SideNav
