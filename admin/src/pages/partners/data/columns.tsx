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
        accessorKey: 'photo',
        header: 'Logotip',
        // Qiymat bo'sh bo'lsa MEDIA_URL + undefined manzili so'ralardi.
        Cell: ({ cell }) =>
          cell.getValue<string>() ? (
            <img
              alt=''
              src={`${MEDIA_URL}${cell.getValue<string>()}`}
              style={{ width: '4rem', height: '2.5rem', objectFit: 'contain' }}
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
