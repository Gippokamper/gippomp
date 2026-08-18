import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { ILadingPhoto } from './data'
import { MEDIA_URL } from '../../../utils/request'
import { Typography } from '@mui/material'

function Columns() {
  const columns = useMemo<MRT_ColumnDef<ILadingPhoto>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70
      },
      {
        accessorKey: 'name',
        header: 'Nomi',
        size: 220,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<string>() || '—'}</Typography>
      },
      {
        // Rasm ustuni umuman yo'q edi — qaysi rasm ekanini ko'rib bo'lmasdi.
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
      }
    ],
    []
  )
  return columns
}

export default Columns
