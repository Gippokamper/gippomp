import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { IFolders } from './data'
import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

function Columns() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { parent } = useParams()
  const columns = useMemo<MRT_ColumnDef<IFolders>[]>(
    () => [
      {
        header: 'Name',
        //@ts-ignore
        Cell: ({ row }) => <Typography>{row.original.name?.[i18n.language]}</Typography>,
        size: 30
      },

      {
        accessorKey: 'sort',
        header: 'Sort',
        Cell: ({ cell }) => <Typography>{cell.getValue()?.toString()}</Typography>,
        size: 30
      },
      {
        accessorKey: 'slug',
        header: 'Actions',
        Cell: ({ cell }) => (
          <Button
            variant='contained'
            color='success'
            onClick={e => {
              e.stopPropagation()
              navigate({
                pathname: `/question-folder/${parent}/${String(cell.getValue())}`
              })
            }}
          >
            O`tish
          </Button>
        ),
        size: 30
      }
    ],
    [i18n.language, parent, navigate]
  )
  return columns
}

export default Columns
