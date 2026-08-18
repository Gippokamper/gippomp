import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { INews } from './data'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<INews>[]>(
    () => [
      {
        header: 'Title',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.title?.[i18n.language]}</Typography>
      },
      {
        accessorKey: 'date',
        header: 'Date'
      },

      {
        accessorKey: 'actual',
        header: 'Actual',
        Cell: ({ cell }) => <Typography>{cell.getValue() ? 'Actual' : 'Not Actual'}</Typography>
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
