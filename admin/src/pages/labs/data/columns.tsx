import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { ILabs } from './data'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ILabs>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        header: 'Name',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.name?.[i18n.language]}</Typography>
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
