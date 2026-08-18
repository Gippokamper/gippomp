import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { MEDIA_URL } from '../../../utils/request'
import { Link, Typography } from '@mui/material'

interface ILandingVideo {
  id: number
  name: string
  video: string
}

function Columns() {
  const columns = useMemo<MRT_ColumnDef<ILandingVideo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70
      },
      {
        accessorKey: 'name',
        header: 'Nomi',
        size: 240,
        Cell: ({ cell }) => <Typography variant='body2'>{cell.getValue<string>() || '—'}</Typography>
      },
      {
        // Backend `video` maydonini qaytaradi — ustun esa `photo` ni o'qir edi,
        // shuning uchun bu yerda doim buzilgan rasm ikonkasi turardi.
        accessorKey: 'video',
        header: 'Video',
        Cell: ({ cell }) =>
          cell.getValue<string>() ? (
            <Link
              href={`${MEDIA_URL}${cell.getValue<string>()}`}
              target='_blank'
              rel='noreferrer'
              onClick={e => e.stopPropagation()}
              variant='body2'
            >
              Ochish
            </Link>
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
