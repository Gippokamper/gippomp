import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { IUser } from './data'
import { Avatar, Box } from '@mui/material'

function Columns() {
  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorFn: row => `${row.firstname} ${row.lastname}`, //accessorFn used to join multiple data into a single cell
        id: 'name', //id is still required when using accessorFn instead of accessorKey
        header: 'Name',
        size: 250,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <Avatar alt={`${row.original.firstname} ${row.original.lastname}`} src={row.original.image} />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        )
      },

      {
        accessorKey: 'phone',
        header: 'Phone'
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },

      {
        accessorKey: 'profession',
        header: 'Profession'
      },
      {
        accessorKey: 'gender',
        header: 'Gender'
      },
      {
        accessorKey: 'graduation_year',
        header: 'Graduation year'
      },
      {
        accessorKey: 'address',
        header: 'Address'
      }
    ],
    []
  )
  return columns
}

export default Columns
