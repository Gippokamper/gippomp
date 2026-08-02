import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IImage } from './data'
import { Button, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { MEDIA_URL } from '../../../utils/request'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IImage>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        accessorKey: 'photo',
        header: 'Photo',
        Cell: ({ cell }) => <img src={MEDIA_URL + cell.getValue()} width={50} height={50} alt='sdsafefwddfsdf' />,
        size: 60
      },
      {
        accessorKey: 'marker_photo',
        header: 'Marker Photo',
        Cell: ({ cell }) => <img src={MEDIA_URL + cell.getValue()} width={50} height={50} alt='sdsaddfsdf' />,
        size: 60
      },
      {
        header: 'Title',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.title?.[i18n.language]}</Typography>,
        size: 60
      },
      {
        accessorKey: 'photo',
        header: 'Copy',
        Cell: ({ cell }) => (
          <Button
            variant='contained'
            color='success'
            onClick={e => {
              e.stopPropagation()
              toast.success('Copied to clipboard!')
              navigator.clipboard.writeText(MEDIA_URL + String(cell.getValue()))
            }}
          >
            Copy image
          </Button>
        ),
        size: 60
      },
      {
        accessorKey: 'id',
        header: 'Copy',
        Cell: ({ cell }) => (
          <Button
            variant='contained'
            color='success'
            onClick={e => {
              e.stopPropagation()
              toast.success('Copied to clipboard!')
              navigator.clipboard.writeText('/dashboard/user/article_note_photos/' + String(cell.getValue()))
            }}
          >
            Copy code
          </Button>
        ),
        size: 60
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
