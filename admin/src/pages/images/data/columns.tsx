import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IImage } from './data'
import { Box, Button, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { MEDIA_URL } from '../../../utils/request'
import { useTranslation } from 'react-i18next'

// Clipboard barcha muhitlarda ishlamaydi (http, eski brauzer) — muvaffaqiyat
// haqidagi toast ilgari nusxa olishdan OLDIN chiqarilardi.
const copy = (text: string) => {
  navigator.clipboard
    ?.writeText(text)
    .then(() => toast.success('Nusxa olindi'))
    .catch(() => toast.error('Nusxa olib bo‘lmadi'))
}

const Thumb = ({ path }: { path?: string }) =>
  path ? (
    <img src={`${MEDIA_URL}${path}`} width={44} height={44} alt='' style={{ objectFit: 'cover', borderRadius: 6 }} />
  ) : (
    <Typography variant='body2'>—</Typography>
  )

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IImage>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        accessorKey: 'photo',
        header: 'Rasm',
        size: 80,
        Cell: ({ cell }) => <Thumb path={cell.getValue<string>()} />
      },
      {
        accessorKey: 'marker_photo',
        header: 'Marker',
        size: 80,
        Cell: ({ cell }) => <Thumb path={cell.getValue<string>()} />
      },
      {
        id: 'title',
        header: 'Sarlavha',
        size: 200,
        Cell: ({ row }) => (
          <Typography variant='body2'>{(row.original?.title as any)?.[i18n.language] || '—'}</Typography>
        )
      },
      {
        // Ilgari bu ikki ustun ham 'photo'/'id' accessorKey'ini takrorlardi —
        // jadvalda bir xil id'li ustunlar paydo bo'lardi.
        id: 'actions',
        header: 'Nusxa olish',
        size: 240,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size='small'
              variant='outlined'
              disabled={!row.original?.photo}
              onClick={e => {
                e.stopPropagation()
                copy(`${MEDIA_URL}${row.original?.photo}`)
              }}
            >
              Havola
            </Button>
            <Button
              size='small'
              variant='outlined'
              onClick={e => {
                e.stopPropagation()
                copy('/dashboard/user/article_note_photos/' + String(row.original?.id))
              }}
            >
              Kod
            </Button>
          </Box>
        )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
