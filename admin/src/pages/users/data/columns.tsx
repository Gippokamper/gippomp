import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IUser } from './data'
import { Avatar, Box, Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { MEDIA_URL } from '../../../utils/request'

function Columns() {
  const { t } = useTranslation()

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorFn: row => `${row.firstname ?? ''} ${row.lastname ?? ''}`.trim(),
        id: 'name',
        header: t('Name'),
        size: 260,
        Cell: ({ renderedCellValue, row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Rasm nisbiy yo'l bilan keladi — MEDIA_URL qo'shilmasa hech qachon yuklanmasdi. */}
            <Avatar
              sx={{ width: 32, height: 32, fontSize: '0.8rem' }}
              alt={String(renderedCellValue || '')}
              src={row.original.image ? `${MEDIA_URL}${row.original.image}` : undefined}
            >
              {String(row.original.firstname || '?')
                .charAt(0)
                .toUpperCase()}
            </Avatar>
            <Typography variant='body2' noWrap>
              {String(renderedCellValue || '').trim() || '—'}
            </Typography>
          </Box>
        )
      },
      {
        accessorKey: 'phone',
        header: t('Phone'),
        size: 150,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<number>() ? `+${cell.getValue<number>()}` : '—'}</Typography>
      },
      {
        accessorKey: 'email',
        header: t('Email'),
        size: 200,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<string>() || '—'}</Typography>
      },
      {
        accessorKey: 'profession',
        header: t('Profession'),
        size: 120,
        Cell: ({ cell }) => (cell.getValue<string>() ? <Chip size='small' label={t(cell.getValue<string>())} /> : '—')
      },
      {
        accessorKey: 'gender',
        header: t('Gender'),
        size: 100,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<string>() ? t(cell.getValue<string>()) : '—'}</Typography>
      },
      {
        accessorKey: 'graduation_year',
        header: t('Graduation year'),
        size: 110,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<number>() || '—'}</Typography>
      },
      {
        // "address" backend javobida umuman yo'q edi — ustun har doim bo'sh turardi.
        accessorKey: 'province',
        header: t('Province'),
        size: 140,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<string>() || '—'}</Typography>
      }
    ],
    [t]
  )
  return columns
}

export default Columns
