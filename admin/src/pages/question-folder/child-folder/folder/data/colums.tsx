import { MRT_ColumnDef } from 'material-react-table'
import { Button, Typography } from '@mui/material'
import { useMemo } from 'react'
import { IQuestionMin } from './data'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
export function removeTags(html: string) {
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '')

  // Remove inline styles
  const withoutStyles = withoutTags.replace(/style="[^"]*"/g, '')

  return withoutStyles
}

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IQuestionMin>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 30
      },
      {
        header: 'Name',
        Cell: ({ row }) => (
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2
            }}
          >
            {/* @ts-ignore */}
            {removeTags(row.original.name?.[i18n.language])}
          </Typography>
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
