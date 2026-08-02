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
        header: 'Sort',
        Cell: ({ row }) => <Typography>{row.original.sort || row.original.category_sort}</Typography>
      },
      {
        accessorKey: 'category_ids',
        header: 'Categories',
        //@ts-ignore
        Cell: ({ cell }) => (
          <Typography>
            {cell
              ?.getValue()
              //@ts-ignore
              ?.map((el: ICategory) => el?.name?.[i18n.language])
              ?.join(', ')}
          </Typography>
        )
      }
    ],
    [i18n.language]
  )
  return columns
}

export default Columns
