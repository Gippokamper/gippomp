import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { ITariff } from './data'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { MEDIA_URL } from '../../../utils/request'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ITariff>[]>(
    () => [
      {
        id: 'photo',
        header: 'Rasm',
        size: 90,
        Cell: ({ row }) =>
          (row.original as any)?.photo ? (
            <img
              alt=''
              src={`${MEDIA_URL}${(row.original as any).photo}`}
              style={{ width: '3rem', height: '3rem', objectFit: 'cover', borderRadius: 8 }}
            />
          ) : (
            <Typography variant='body2'>—</Typography>
          )
      },
      {
        id: 'name',
        header: 'Nomi',
        size: 200,
        //@ts-ignore
        Cell: ({ row }) => <Typography variant='body2'>{row.original.name?.[i18n.language] || '—'}</Typography>
      },
      {
        accessorKey: 'advantages',
        header: 'Imkoniyatlar',
        // Ilgari `status && name` qaytarilardi: o'chirilganlar o'rniga `false`
        // chiqar, yoqilganlari esa hech qanday ajratkichsiz yopishib ketardi.
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {(cell.getValue<any[]>() || [])
              .filter((el: any) => el?.status)
              .map((el: any) => el?.name?.[i18n.language])
              .filter(Boolean)
              .join(', ') || '—'}
          </Typography>
        )
      },
      {
        accessorKey: 'price',
        header: 'Narxi',
        size: 130,
        Cell: ({ cell }) => (
          <Typography variant='body2'>{Number(cell.getValue<number>() || 0).toLocaleString('ru-RU')}</Typography>
        )
      },
      {
        id: 'term',
        header: 'Muddat',
        size: 140,
        //@ts-ignore
        Cell: ({ row }) => <Typography variant='body2'>{row.original.term_id?.name?.[i18n.language] || '—'}</Typography>
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
