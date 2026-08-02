import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { ICategory } from './data'
import { Avatar, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ICategory>[]>(
    () => [
      {
        header: 'Name',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.name?.[i18n.language]}</Typography>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <Typography>{cell.getValue() ? 'Active' : 'Not Active'}</Typography>
      },
      {
        accessorKey: 'paid',
        header: 'Premium',
        Cell: ({ cell }) => <Typography>{cell.getValue() ? 'Premium' : 'Not Premium'}</Typography>
      },
      {
        accessorKey: 'sort',
        header: 'Sort',
        Cell: ({ cell }) => <Typography>{cell.getValue()?.toString()}</Typography>
      },
      {
        accessorKey: 'categories',
        header: 'Categories',
        //@ts-ignore
        Cell: ({ cell }) => <Typography>{cell?.getValue()?.map((el: ICategory) => el?.translations?.en)}</Typography>
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
