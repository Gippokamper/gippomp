import { Search } from '@mui/icons-material'
import { InputAdornment, OutlinedInput, IconButton } from '@mui/material'
import React from 'react'
import AppBar from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'

interface IAppBarMobile {
  toggled: boolean
  setToggled: React.Dispatch<React.SetStateAction<boolean>>
}

function AppBarMobile(props: IAppBarMobile) {
  return (
    <AppBar
      position='fixed'
      style={{
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: 'none',
        height: '5.875rem',
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 2,
        top: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        zIndex: 10
      }}
    >
      <img
        src={require('../../../assets/images/logo.webp')}
        alt='logo'
        style={{ width: '7.375rem', height: '2.5625rem' }}
      />

      <OutlinedInput
        id='input-with-icon-adornment'
        size='small'
        type='outlined'
        startAdornment={
          <InputAdornment position='start'>
            <Search />
          </InputAdornment>
        }
      />
      <IconButton
        size='large'
        edge='start'
        color='inherit'
        aria-label='menu'
        sx={{ mr: 1, ml: 1, display: { md: 'none' } }}
        onClick={() => props.setToggled(!props.toggled)}
      >
        <MenuIcon />
      </IconButton>
    </AppBar>
  )
}

export default AppBarMobile
