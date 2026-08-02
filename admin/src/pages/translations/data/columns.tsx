import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { ITranslation } from './data'
import { Typography } from '@mui/material'

function Columns() {
  const columns = useMemo<MRT_ColumnDef<ITranslation>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorKey: 'key',
        header: 'Key'
      },

      {
        accessorKey: 'translation.uz',
        header: 'O`zbekcha',
        Cell: ({ cell }) => (
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            {String(cell?.getValue())}
          </Typography>
        )
      },
      {
        accessorKey: 'translation.ru',
        header: 'Ruscha',
        Cell: ({ cell }) => (
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            {String(cell?.getValue())}
          </Typography>
        )
      },
      {
        accessorKey: 'translation.en',
        header: 'Inglizcha',
        Cell: ({ cell }) => (
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            {String(cell?.getValue())}
          </Typography>
        )
      }
    ],
    []
  )
  return columns
}

export default Columns
