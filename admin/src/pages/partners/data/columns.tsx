import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { ILadingPhoto } from './data'
import { MEDIA_URL } from '../../../utils/request'

function Columns() {
  const columns = useMemo<MRT_ColumnDef<ILadingPhoto>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorKey: 'photo',
        header: 'Photo',
        Cell: ({ cell }) => <img alt='img' src={MEDIA_URL + cell.getValue()} width={30} />
      }
    ],
    []
  )
  return columns
}

export default Columns
