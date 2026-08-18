import { Delete } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Confirm from '../confirm'

interface IProps {
  /** ixtiyoriy havola. Ilgari bu yerda doim '/categories' turardi — bunday
   *  route umuman yo'q va bosilganda bo'sh sahifa ochilardi. */
  to?: string
  title: string
  onClick: () => void
  /** backend'da bog'lanishni uzish endpoint'i bo'lmasa — o'chirish yashiriladi */
  canDelete?: boolean
}

function RelationItem(props: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const canDelete = props.canDelete !== false

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 1.5,
        py: 0.75,
        mb: 1,
        borderRadius: 2,
        border: '1px solid rgba(18,27,45,.08)'
      }}
    >
      {props.to ? (
        <Link to={props.to} style={{ color: 'inherit' }}>
          {props.title}
        </Link>
      ) : (
        <Typography variant='body2'>{props.title || '—'}</Typography>
      )}
      {canDelete && (
        <IconButton size='small' onClick={() => setIsOpen(true)}>
          <Delete fontSize='small' />
        </IconButton>
      )}
      <Confirm
        title='O`chirilsinmi?'
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          setIsOpen(false)
          props.onClick()
        }}
        isOpen={isOpen}
      />
    </Box>
  )
}

export default RelationItem
