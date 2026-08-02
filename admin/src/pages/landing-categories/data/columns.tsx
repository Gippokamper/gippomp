import { MRT_ColumnDef } from 'material-react-table'
import React, { useMemo } from 'react'
import { ILandingCategory } from './data'
import { useTranslation } from 'react-i18next'
import { MEDIA_URL } from '../../../utils/request'

function Columns() {
  const { i18n } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<ILandingCategory>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        //@ts-ignore
        accessorKey: 'name.' + i18n.language,
        header: 'Name'
      },

      {
        accessorKey: 'photo',
        header: 'Photo',
        Cell: ({ cell }) => <img alt='img' src={MEDIA_URL + cell.getValue()} width={30} />
      },
      {
        accessorKey: 'category_id',
        header: 'Category',
        //@ts-ignore
        Cell: ({ cell }) => cell.getValue()?.name?.[i18n.language]
      }
    ],
    []
  )
  return columns
}

export default Columns
