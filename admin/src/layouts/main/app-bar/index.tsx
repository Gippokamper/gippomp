import {
  Avatar,
  Box,
  Badge,
  ListItemIcon,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Tooltip
} from '@mui/material'
import React from 'react'
import LanguageSelect from '../../../components/language-select'
import Bell from '../../../assets/icons/Bell'
import { useMutation, useQuery } from 'react-query'
import { GET_NOTIFICATIONS } from './queries'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import { logout, request } from '../../../utils/request'
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
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const profileOpen = Boolean(profileAnchor)
  const handleClose = () => setAnchorEl(null)

  const { mutate } = useMutation(READ_NOTIFICATION, {
    onSuccess: () => {
      navigate('/messages?type=messages_from')
      handleClose()
      refetch()
    }
  })

  const notifications: any[] = Array.isArray(data?.data) ? data.data : []

  return (
    <Box
      component='header'
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        height: '4rem',
        px: 3,
        bgcolor: '#fff',
        borderBottom: '1px solid rgba(18, 27, 45, 0.08)'
      }}
    >
      <LanguageSelect />

      <Tooltip title={t('Notifications')}>
        <IconButton onClick={event => setAnchorEl(event.currentTarget)} size='small'>
          <Badge badgeContent={notifications.length} color='error'>
            <Box
              sx={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                backgroundImage: 'linear-gradient(174deg, #399A48 0%, #AACC3A 100%)'
              }}
            >
              <Bell />
            </Box>
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu id='notifications-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length ? (
          notifications.map((item: any) => {
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

      {/* Ilgari bu yerda internetdagi tasodifiy odamning surati turardi va
          hech qanday amal bajarmasdi — chiqish tugmasi esa umuman yo'q edi. */}
      <IconButton onClick={event => setProfileAnchor(event.currentTarget)} size='small'>
        <Avatar sx={{ width: '2.25rem', height: '2.25rem', bgcolor: '#121b2d', fontSize: '0.9rem' }}>A</Avatar>
      </IconButton>
      <Menu anchorEl={profileAnchor} open={profileOpen} onClose={() => setProfileAnchor(null)}>
        <MenuItem disabled>
          <Typography variant='body2'>{t('Administrator')}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setProfileAnchor(null)
            logout()
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>{t('Logout')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AppBarDesktop
