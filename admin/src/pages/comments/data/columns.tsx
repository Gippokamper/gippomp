import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IComment } from './data'
import { Box, Button, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IComment>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70
      },
      {
        id: 'title',
        header: 'Sarlavha',
        size: 360,
        Cell: ({ row }) => (
          <Box>
            <Typography variant='body2' fontWeight={600}>
              {(row.original?.title as any)?.[i18n.language] || '—'}
            </Typography>
            <Box
              sx={{
                '& img': { display: 'none' },
                fontSize: '0.8rem',
                color: 'text.secondary',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3
              }}
              dangerouslySetInnerHTML={{ __html: (row.original?.description as any)?.[i18n.language] || '' }}
            />
          </Box>
        )
      },
      {
        // Ilgari bu ustun ham accessorKey='id' edi — jadvalda ikkita bir xil
        // id'li ustun bo'lardi.
        id: 'copy',
        header: 'Kod',
        size: 140,
        Cell: ({ row }) => (
          <Button
            size='small'
            variant='outlined'
            onClick={e => {
              e.stopPropagation()
              navigator.clipboard
                ?.writeText('/dashboard/user/article_note_text/' + String(row.original?.id))
                .then(() => toast.success('Nusxa olindi'))
                .catch(() => toast.error('Nusxa olib bo‘lmadi'))
            }}
          >
            Nusxa olish
          </Button>
        )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
