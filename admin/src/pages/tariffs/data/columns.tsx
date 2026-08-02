import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { ITariff } from './data'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ITariff>[]>(
    () => [
      {
        header: 'Name',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.name?.[i18n.language]}</Typography>
      },
      {
        accessorKey: 'advantages',
        header: 'Advantages',

        Cell: ({ cell }) => (
          //@ts-ignore
          <Typography>{cell.getValue()?.map((el: any) => el.status && el.name?.[i18n.language])}</Typography>
        )
      },

      {
        accessorKey: 'price',
        header: 'Price'
      },
      {
        header: 'Interval',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.term_id?.name?.[i18n.language]}</Typography>
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
