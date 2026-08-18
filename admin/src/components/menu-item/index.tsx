import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface IMenuButton {
  icon?: ReactNode
  text: string
  link: string
  collapsed: boolean
  /** faqat aniq mos kelganda faol (masalan "/") */
  end?: boolean
  onNavigate?: () => void
}

function MenuButton(props: IMenuButton) {
  const { t } = useTranslation()
  const label = t(props.text)

  const content = (
    <NavLink
      to={props.link}
      end={props.end}
      onClick={props.onNavigate}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      {({ isActive }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: props.collapsed ? 0 : 1.5,
            py: 1.1,
            mb: 0.25,
            borderRadius: 2,
            justifyContent: props.collapsed ? 'center' : 'flex-start',
            color: isActive ? '#fff' : 'text.primary',
            backgroundImage: isActive ? 'linear-gradient(90deg, #3f8f00 0%, #aacc3a 100%)' : 'none',
            transition: 'background-color .15s ease, color .15s ease',
            '&:hover': {
              backgroundColor: isActive ? undefined : 'rgba(77, 175, 0, 0.10)'
            },
            '& svg': { fontSize: '1.35rem', flexShrink: 0 }
          }}
        >
          {props.icon}
          {!props.collapsed && (
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      )}
    </NavLink>
  )

  // Yig'ilgan holatda faqat ikonka qoladi — nomini tooltip ko'rsatadi.
  return props.collapsed ? (
    <Tooltip title={label} placement='right'>
      <Box>{content}</Box>
    </Tooltip>
  ) : (
    content
  )
}

export default MenuButton
