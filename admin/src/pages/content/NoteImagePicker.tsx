import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { GET_COMMENTS } from '../comments/queries'
import { GET_IMAGES } from '../images/queries'
import { MEDIA_URL } from '../../utils/request'

export type PickKind = 'note' | 'image'

interface IProps {
  open: boolean
  kind: PickKind
  onClose: () => void
  // Tanlangan element uchun matnga qo'yiladigan "kod" (backend token'i) qaytadi.
  onPick: (token: string) => void
}

// Eslatma/rasm tanlagich. Ilgari eslatma/rasm kodini qo'lда nusxalab, matnga
// yopishtirish kerak edi — endi tanlaysiz, kod avtomatik matnga qo'yiladi.
function NoteImagePicker(props: IProps) {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const [search, setSearch] = useState('')

  const isNote = props.kind === 'note'
  const title = isNote ? 'Eslatma qo`shish' : 'Rasm qo`shish'

  const { data, isLoading } = useQuery(
    [isNote ? 'picker-notes' : 'picker-images', search],
    () => (isNote ? GET_COMMENTS({ perPage: 50, search }) : GET_IMAGES({ perPage: 50, search })),
    { enabled: props.open, keepPreviousData: true }
  )
  const items: any[] = Array.isArray(data?.data) ? data.data : []

  const tokenFor = (id: number) =>
    isNote ? `/dashboard/user/article_note_text/${id}` : `/dashboard/user/article_note_photos/${id}`

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth='sm' scroll='paper'>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton size='small' onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
          Tanlang — matn ichiga (kursor joyiga) avtomatik qo`yiladi.
        </Typography>
        <TextField
          size='small'
          fullWidth
          placeholder='Qidirish...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            )
          }}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={26} />
          </Box>
        ) : !items.length ? (
          <Typography variant='body2' color='text.secondary' sx={{ py: 3, textAlign: 'center' }}>
            Hech narsa topilmadi
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {items.map(item => {
              const label = item?.title?.[lng] || item?.title?.uz || `#${item?.id}`
              return (
                <Box
                  key={item.id}
                  onClick={() => {
                    props.onPick(tokenFor(item.id))
                    props.onClose()
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(18,27,45,.08)',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(77,175,0,.04)' }
                  }}
                >
                  {isNote ? (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(77,175,0,.10)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: '0 0 40px'
                      }}
                    >
                      📌
                    </Box>
                  ) : (
                    <Box
                      component='img'
                      src={item?.photo ? `${MEDIA_URL}${item.photo}` : undefined}
                      alt=''
                      sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover', flex: '0 0 40px', bgcolor: '#eee' }}
                    />
                  )}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant='body2' fontWeight={700} noWrap>
                      {label}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      ID: {item.id}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}

        {/* Yangi eslatma/rasm — hozircha eski sahifada yaratiladi (yangi oynada) */}
        <Button
          fullWidth
          variant='outlined'
          startIcon={<OpenInNewIcon />}
          sx={{ mt: 2 }}
          onClick={() => window.open(isNote ? '/comments' : '/images', '_blank', 'noopener,noreferrer')}
        >
          Yangi {isNote ? 'eslatma' : 'rasm'} yaratish
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default NoteImagePicker
