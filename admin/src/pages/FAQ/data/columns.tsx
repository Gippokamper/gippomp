import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { IFAQS } from './data'

function Columns() {
  const columns = useMemo<MRT_ColumnDef<IFAQS>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorKey: 'question.uz',
        header: 'O`zbekcha'
      },
      {
        accessorKey: 'question.ru',
        header: 'Ruscha'
      },
      {
        accessorKey: 'question.en',
        header: 'Inglizcha'
      },
      {
        accessorKey: 'answer.uz',
        header: 'O`zbekcha'
      },
      {
        accessorKey: 'answer.ru',
        header: 'Ruscha'
      },
      {
        accessorKey: 'answer.en',
        header: 'Inglizcha'
      }
    ],
    []
  )
  return columns
}

export default Columns
