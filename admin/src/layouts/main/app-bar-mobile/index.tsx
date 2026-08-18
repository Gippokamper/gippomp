import { Box, IconButton } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import LanguageSelect from '../../../components/language-select'
import { logout } from '../../../utils/request'

interface IAppBarMobile {
  toggled: boolean
  setToggled: React.Dispatch<React.SetStateAction<boolean>>
}

function AppBarMobile(props: IAppBarMobile) {
  return (
    <Box
      component='header'
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        height: '3.5rem',
        px: 1.5,
        bgcolor: '#fff',
        borderBottom: '1px solid rgba(18, 27, 45, 0.08)'
      }}
    >
      <IconButton edge='start' aria-label='menu' onClick={() => props.setToggled(!props.toggled)}>
        <MenuIcon />
      </IconButton>

      <img
        src={require('../../../assets/images/logo.webp')}
        alt='Gippokamp'
        style={{ height: '1.75rem', objectFit: 'contain' }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LanguageSelect />
        <IconButton onClick={logout} aria-label='logout'>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default AppBarMobile
