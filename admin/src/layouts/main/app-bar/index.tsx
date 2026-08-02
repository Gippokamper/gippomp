import { Search } from '@mui/icons-material'
import {
  Avatar,
  Box,
  InputAdornment,
  Toolbar,
  OutlinedInput,
  Badge,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  Collapse,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import LanguageSelect from '../../../components/language-select'
import Bell from '../../../assets/icons/Bell'
import AppBar from '@mui/material/AppBar'
import { useMutation, useQuery } from 'react-query'
import { GET_NOTIFICATIONS } from './queries'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { request } from '../../../utils/request'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const READ_NOTIFICATION = async (id: number) => {
  const response = await request({
    url: '/dashboard/admin/notification/feedback/is_read/' + id,
    method: 'POST'
  })
  return response.data
}

function AppBarDesktop() {
  const { data, refetch } = useQuery(['nots'], GET_NOTIFICATIONS)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { mutate } = useMutation(READ_NOTIFICATION, {
    onSuccess: () => {
      navigate('/messages?type=messages_from')
      handleClose()
      refetch()
    }
  })

  return (
    <AppBar
      position='fixed'
      style={{
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: 'none',
        flexDirection: 'row',
        height: '6.875rem',
        top: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        zIndex: 10
      }}
    >
      <Toolbar sx={{ width: { sm: '50%' } }}>
        {/* <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2, ml: 2, display: { md: 'none' } }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuIcon />
        </IconButton> */}
        <OutlinedInput
          id='input-with-icon-adornment'
          size='small'
          fullWidth
          type='outlined'
          startAdornment={
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          }
        />
      </Toolbar>
      <Toolbar sx={{ width: { sm: '50%' }, justifyContent: 'flex-end', gap: 2 }}>
        <LanguageSelect />
        <Badge sx={{ '& .MuiBadge-badge': { fontSize: '1rem' } }} badgeContent={data?.data?.length} color='primary'>
          <Avatar sx={{ background: 'var(--main-color, linear-gradient(174deg, #399A48 0%, #AACC3A 100%))' }}>
            <Button
              id='basic-button'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              style={{
                color: '#fff'
              }}
            >
              <Bell />
            </Button>
          </Avatar>
        </Badge>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          {data?.data?.length ? (
            data.data.map((item: any) => {
              const author = item?.feedback_id?.user_id
              const senderName = [author?.firstname, author?.lastname].filter(Boolean).join(' ')
              const feedbackId = item?.feedback_id?.id

              return (
                // key yo'q edi — React har render'da "unique key" ogohlantirishini berardi.
                <MenuItem
                  key={item?.id}
                  // feedback_id bo'lmasa .../is_read/undefined ga so'rov ketardi.
                  disabled={!feedbackId}
                  onClick={() => feedbackId && mutate(feedbackId)}
                  sx={{ maxWidth: '22rem' }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize='small' />
                  </ListItemIcon>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant='body2' fontWeight={600} noWrap>
                      {senderName || t('Unknown user')}
                    </Typography>
                    {/* Xabar bo'sh bo'lsa qator butunlay bo'sh ko'rinardi. */}
                    <Typography variant='caption' color='text.secondary' noWrap component='div'>
                      {item?.message?.trim() || t('Empty message')}
                    </Typography>
                  </Box>
                </MenuItem>
              )
            })
          ) : (
            <MenuItem disabled>
              <Typography variant='body2'>{t('No new notifications')}</Typography>
            </MenuItem>
          )}
        </Menu>
        <Avatar src='https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=1380&t=st=1689162320~exp=1689162920~hmac=1b3bc3a782b2b9d4054b0a19c82d2acdcff21483ed4b185ccab2945a7eef7303' />
      </Toolbar>
    </AppBar>
  )
}

export default AppBarDesktop
