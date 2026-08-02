import { MRT_ColumnDef } from 'material-react-table'
import { Avatar, Box, Button, Typography } from '@mui/material'
import { useMemo } from 'react'
import { IQuestionMin } from './data'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IQuestionMin>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        header: 'Name',
        Cell: ({ row }) => (
          //@ts-ignore
          <Typography dangerouslySetInnerHTML={{ __html: row.original.name?.[i18n.language] }}></Typography>
        )
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
              navigator.clipboard.writeText(String(cell.getValue()))
            }}
          >
            Copy code
          </Button>
        )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
