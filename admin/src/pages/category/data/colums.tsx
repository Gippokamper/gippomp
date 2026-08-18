import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { ICategory } from './data'
import { Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ICategory>[]>(
    () => [
      {
        id: 'name',
        header: 'Nomi',
        size: 260,
        //@ts-ignore
        Cell: ({ row }) => <Typography variant='body2'>{row.original.name?.[i18n.language] || '—'}</Typography>
      },
      {
        // "Status" ustuni olib tashlandi: backend (CategoryResource) bunday
        // maydonni umuman qaytarmaydi va ustun har doim "Not Active" ko'rsatardi.
        accessorKey: 'paid',
        header: 'Premium',
        size: 110,
        Cell: ({ cell }) =>
          cell.getValue() ? <Chip size='small' color='warning' label='Premium' /> : <Chip size='small' label='Free' />
      },
      {
        id: 'sort',
        header: 'Tartib',
        size: 100,
        Cell: ({ row }) => (
          <Typography variant='body2'>
            {(row.original?.category_ids?.length ? row.original?.category_sort : row.original?.sort) ?? '—'}
          </Typography>
        )
      },
      {
        accessorKey: 'category_ids',
        header: 'Ota kategoriyalar',
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
