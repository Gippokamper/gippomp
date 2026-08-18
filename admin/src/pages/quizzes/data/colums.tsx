import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: 'name',
        header: 'Nomi',
        size: 260,
        Cell: ({ row }) => <Typography variant='body2'>{row.original.name?.[i18n.language] || '—'}</Typography>
      },
      {
        id: 'info',
        header: 'Ma`lumot',
        size: 280,
        Cell: ({ row }) => <Typography variant='body2'>{row.original.info?.[i18n.language] || '—'}</Typography>
      },
      {
        id: 'sort',
        header: 'Tartib',
        size: 100,
        Cell: ({ row }) => <Typography variant='body2'>{row.original?.sort ?? row.original?.quiz_sort ?? '—'}</Typography>
      },
      {
        // Ilgari `categories` + `translations.en` o'qilardi — QuizResource'da
        // bunday maydonlar yo'q, shuning uchun ustun doim bo'sh edi.
        accessorKey: 'quiz_ids',
        header: 'Ota bo`limlar',
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {(cell.getValue<any[]>() || [])
              .map((el: any) => el?.name?.[i18n.language])
              .filter(Boolean)
              .join(', ') || '—'}
          </Typography>
        )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
