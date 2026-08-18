import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { ILandingCategory } from './data'
import { useTranslation } from 'react-i18next'
import { MEDIA_URL } from '../../../utils/request'
import { Typography } from '@mui/material'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ILandingCategory>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70
      },
      {
        id: 'name',
        header: 'Nomi',
        size: 240,
        //@ts-ignore
        Cell: ({ row }) => <Typography variant='body2'>{row.original?.name?.[i18n.language] || '—'}</Typography>
      },
      {
        accessorKey: 'photo',
        header: 'Rasm',
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue<string>() ? (
            <img
              alt=''
              src={`${MEDIA_URL}${cell.getValue<string>()}`}
              style={{ width: '4rem', height: '2.5rem', objectFit: 'cover', borderRadius: 6 }}
            />
          ) : (
            <Typography variant='body2'>—</Typography>
          )
      },
      {
        accessorKey: 'category_id',
        header: 'Ota kategoriya',
        //@ts-ignore
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue()?.name?.[i18n.language] || '—'}</Typography>
      }
    ],
    // i18n.language bog'lanmagani uchun til almashtirilganda ustunlar
    // eski tilda qolib ketardi.
    [i18n.language]
  )
  return columns
}

export default Columns
