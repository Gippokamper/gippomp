import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IFAQS } from './data'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const clamp = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical' as const,
  WebkitLineClamp: 3
}

function Columns() {
  const { i18n } = useTranslation()

  const columns = useMemo<MRT_ColumnDef<IFAQS>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70
      },
      {
        // Ilgari 6 ta ustun bor edi va ularning sarlavhalari bir xil
        // ("O`zbekcha" savol uchun ham, javob uchun ham) — qaysi ustun nima
        // ekanini ajratib bo'lmasdi.
        id: 'question',
        header: 'Savol',
        size: 320,
        Cell: ({ row }) => (
          <Typography variant='body2' sx={clamp}>
            {(row.original?.question as any)?.[i18n.language] || '—'}
          </Typography>
        )
      },
      {
        id: 'answer',
        header: 'Javob',
        size: 420,
        Cell: ({ row }) => (
          <Typography variant='body2' sx={clamp}>
            {(row.original?.answer as any)?.[i18n.language] || '—'}
          </Typography>
        )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
