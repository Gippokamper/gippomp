import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { ICategory } from './data'
import { Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ICategory>[]>(
    () => [
      {
        id: 'name',
        header: 'Nomi',
        size: 280,
        //@ts-ignore
        Cell: ({ row }) => <Typography variant='body2'>{row.original.name?.[i18n.language] || '—'}</Typography>
      },
      {
        // "Status" va "Premium" ustunlari olib tashlandi — VideoResource bunday
        // maydonlarni qaytarmaydi, ular doim bir xil qiymat ko'rsatardi.
        accessorKey: 'sort',
        header: 'Tartib',
        size: 100,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<any>()?.toString() || '—'}</Typography>
      },
      {
        // Backend `category_ids` qaytaradi (`categories` emas) va nom
        // `name[til]` da bo'ladi — ilgari `translations.en` o'qilgani uchun
        // ustun har doim bo'sh edi.
        accessorKey: 'category_ids',
        header: 'Kategoriyalar',
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {(cell.getValue<any[]>() || [])
              .map((el: any) => el?.name?.[i18n.language])
              .filter(Boolean)
              .join(', ') || '—'}
          </Typography>
        )
      },
      {
        accessorKey: 'link',
        header: 'Havola',
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue<string>() ? (
            <Link
              href={cell.getValue<string>()}
              target='_blank'
              rel='noreferrer'
              variant='body2'
              onClick={e => e.stopPropagation()}
            >
              Ochish
            </Link>
          ) : (
            <Typography variant='body2'>—</Typography>
          )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
