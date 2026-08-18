import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { IFolders } from './data'
import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function Columns() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const columns = useMemo<MRT_ColumnDef<IFolders>[]>(
    () => [
      {
        header: 'Name',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.name?.[i18n.language]}</Typography>
      },

      {
        accessorKey: 'sort',
        header: 'Sort',
        Cell: ({ row }) => <Typography>{row.original.sort}</Typography>
      },
      {
        accessorKey: 'slug',
        header: 'Copy',
        Cell: ({ cell }) => (
          <Button
            variant='contained'
            color='success'
            onClick={e => {
              e.stopPropagation()
              navigate({
                pathname: '/question-folder/' + String(cell.getValue())
              })
            }}
          >
            O`tish
          </Button>
        )
      }
    ],
    [i18n.language, navigate]
  )
  return columns
}

export default Columns
