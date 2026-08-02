import { Box, IconButton, TextField, Tooltip } from '@mui/material'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import React, { useMemo, useState } from 'react'
import { IUser } from '../../../users/data/data'
import { ITariff } from '../../../tariffs/data/data'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { useQuery } from 'react-query'
import RefreshIcon from '@mui/icons-material/Refresh'
import { request } from '../../../../utils/request'

interface IMessagesFrom {
  id: number
  date: string
  name: string
  contact: string
  message: string
}

const messages: IMessagesFrom[] = [
  {
    id: 1,
    date: '2023-05-28 04:09:02',
    name: '',
    contact: '',
    message: 'Hello'
  }
]

export const GET_FEEDBACKS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/feedback_site',
    params: params,
    method: 'GET'
  })

  return response?.data
}

function Feedback() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const columns = useMemo<MRT_ColumnDef<IMessagesFrom>[]>(
    () => [
      //   {
      //     accessorKey: 'date',
      //     header: 'Kiritildi'
      //   },
      {
        accessorKey: 'name',
        header: 'Foydalanuvchi'
      },

      {
        accessorKey: 'contact',
        header: 'Contact'
      },
      {
        accessorKey: 'message',
        header: 'Xabar'
      }
    ],
    []
  )
  const { data, isError, refetch, isLoading, isFetching } = useQuery(
    [
      'table-data',
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize //refetch when pagination.pageSize changes
    ],
    () =>
      GET_FEEDBACKS({
        perPage: pagination.pageSize,
        page: pagination?.pageIndex + 1,
        search: globalFilter
      })
  )
  return (
    <Box>
      <MaterialReactTable
        columns={columns}
        data={data?.data || []}
        muiTableProps={{
          sx: {
            border: '1px solid rgba(81, 81, 81, 1)'
          }
        }}
        muiTableHeadCellProps={{
          sx: {
            border: '1px solid rgba(81, 81, 81, 1)'
          }
        }}
        muiTableBodyCellProps={{
          sx: {
            border: '1px solid rgba(81, 81, 81, 1)'
          }
        }}
        initialState={{ showColumnFilters: true }}
        manualFiltering
        manualPagination
        manualSorting
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data'
              }
            : undefined
        }
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        renderTopToolbarCustomActions={() => (
          <Tooltip arrow title='Refresh Data'>
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
        //@ts-ignore
        rowCount={data?.meta?.total ?? 0}
        state={{
          globalFilter,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isFetching
        }}
      />
    </Box>
  )
}

export default Feedback
