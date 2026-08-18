import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IArticle } from './data'
import { Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ICategory } from '../../category/data/data'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IArticle>[]>(
    () => [
      {
        id: 'name',
        header: 'Nomi',
        size: 300,
        //@ts-ignore
        Cell: ({ row }) => <Typography variant='body2'>{row.original.name?.[i18n.language] || '—'}</Typography>
      },
      {
        accessorKey: 'paid',
        header: 'Premium',
        size: 110,
        Cell: ({ cell }) =>
          cell.getValue() ? <Chip size='small' color='warning' label='Premium' /> : <Chip size='small' label='Free' />
      },
      {
        accessorKey: 'sort',
        header: 'Tartib',
        size: 100,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<any>()?.toString() || '—'}</Typography>
      },
      {
        accessorKey: 'category_ids',
        header: 'Kategoriyalar',
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {(cell.getValue<ICategory[]>() || [])
              //@ts-ignore
              .map((el: ICategory) => el?.name?.[i18n.language])
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
