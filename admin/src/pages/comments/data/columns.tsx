import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { IComment } from './data'
import { Box, Button } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IComment>[]>(
    () => [
      {
        header: 'Title',
        Cell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* @ts-ignore */}
            <b>{row?.original?.title?.[i18n.language]}</b>
            <Box
              sx={{
                '& img': {
                  display: 'none'
                }
              }}
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: row?.original?.description?.[i18n.language] }}
            ></Box>
          </Box>
        ),
        size: 300
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 15,
        enableResizing: false
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
              navigator.clipboard.writeText('/dashboard/user/article_note_text/' + String(cell.getValue()))
            }}
          >
            Copy code
          </Button>
        ),
        size: 80,
        enableResizing: false
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
