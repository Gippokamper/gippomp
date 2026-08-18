import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import RefreshIcon from '@mui/icons-material/Refresh'
import { request } from '../../../../utils/request'

interface IFeedbackSite {
  id: number
  name: string
  contact: string
  message: string
}

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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo<MRT_ColumnDef<IFeedbackSite>[]>(
    () => [
      { accessorKey: 'name', header: 'Foydalanuvchi', size: 180 },
      { accessorKey: 'contact', header: 'Aloqa', size: 180 },
      {
        accessorKey: 'message',
        header: 'Xabar',
        Cell: ({ cell }) => (
          <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
            {cell.getValue<string>()}
          </Typography>
        )
      }
    ],
    []
  )

  const { data, isError, refetch, isLoading, isFetching } = useQuery(
    // Ilgari kalit 'table-data' edi — u boshqa jadval (foydalanuvchilardan
    // kelgan xabarlar) bilan bir xil bo'lib, tab almashtirilganda bir jadval
    // ikkinchisining ma'lumotini ko'rsatardi.
    ['feedback-site', globalFilter, pagination.pageIndex, pagination.pageSize],
    () =>
      GET_FEEDBACKS({
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: globalFilter
      }),
    { keepPreviousData: true }
  )

  return (
    <Box>
      <MaterialReactTable
        columns={columns}
        data={data?.data || []}
        enableColumnActions={false}
        enableSorting={false}
        enableColumnFilters={false}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        muiTablePaperProps={{
          elevation: 0,
          sx: { borderRadius: 3, border: '1px solid rgba(18, 27, 45, 0.08)', overflow: 'hidden' }
        }}
        muiTableHeadCellProps={{ sx: { backgroundColor: '#f6f8fa', fontWeight: 700 } }}
        manualFiltering
        manualPagination
        manualSorting
        muiToolbarAlertBannerProps={isError ? { color: 'error', children: 'Error loading data' } : undefined}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        renderTopToolbarCustomActions={() => (
          <Tooltip arrow title='Yangilash'>
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
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
