import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { IArticle } from './data'
import { Avatar, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ICategory } from '../../category/data/data'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<IArticle>[]>(
    () => [
      {
        header: 'Name',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.name?.[i18n.language]}</Typography>
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
        accessorKey: 'category_ids',
        header: 'Categories',
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
