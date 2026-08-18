import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { IUser } from '../../../users/data/data'
import { useQuery } from 'react-query'
import MessageComponent from './MessageComponent'
import { request } from '../../../../utils/request'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useTranslation } from 'react-i18next'

export interface Message {
  id: number
  author: 'admin' | 'user'
  message: string
}
export interface IMessagesFrom {
  id: number
  user_id: IUser
  article_id: null
  block_id: null
  question_id: null
  type: 'chapter' | 'question' | ''
  messages: Message[]
}

export const GET_FEEDBACKS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/feedback',
    params: params,
    method: 'GET'
  })

  return response?.data
}

function MessagesFrom() {
  const { i18n } = useTranslation()
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const { data, isError, refetch, isLoading, isFetching } = useQuery(
    // Ilgari kalit 'table-data' edi va sayt fikr-mulohazalari jadvali bilan
    // to'qnashardi (ikkala tab bir xil cache'ni ko'rsatardi).
    ['feedback-messages', globalFilter, pagination.pageIndex, pagination.pageSize, i18n.language],
    () =>
      GET_FEEDBACKS({
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1,
        lang: i18n.language,
        search: globalFilter
      }),
    { keepPreviousData: true }
  )

  const columns = useMemo<MRT_ColumnDef<IMessagesFrom>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70
      },
      {
        accessorKey: 'user_id',
        header: 'Foydalanuvchi',
        size: 180,
        Cell: ({ cell }) => {
          const user = cell.getValue<IUser>()
          const name = [user?.firstname, user?.lastname].filter(Boolean).join(' ')
          return (
            <Box>
              <Typography variant='body2' fontWeight={600} noWrap>
                {name || '—'}
              </Typography>
              <Typography variant='caption' color='text.secondary' noWrap component='div'>
                {user?.email || (user?.phone ? `+${user.phone}` : '')}
              </Typography>
            </Box>
          )
        }
      },
      {
        accessorKey: 'messages',
        header: 'Yozishmalar',
        size: 380,
        Cell: ({ cell }) => {
          const items = cell.getValue<Message[]>() || []
          if (!items.length) return <Typography variant='body2'>—</Typography>
          return (
            <Stack spacing={0.75} sx={{ py: 1 }}>
              {/* Har bir elementda key bo'lishi shart edi — React ogohlantirish berardi. */}
              {items.map(item => (
                <Box key={item.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Chip
                    size='small'
                    label={item.author === 'admin' ? 'Admin' : 'User'}
                    color={item.author === 'admin' ? 'primary' : 'default'}
                    sx={{ flexShrink: 0 }}
                  />
                  <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                    {item.message}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )
        }
      },
      {
        // Ilgari bu ustun ham accessorKey='id' edi: ikki ustun bir xil id bilan
        // ro'yxatdan o'tib, jadval ustunlarni chalkashtirardi.
        id: 'reply',
        header: 'Javob yuborish',
        size: 260,
        Cell: ({ row }) => <MessageComponent refresh={refetch} id={Number(row.original?.id)} />
      }
    ],
    [refetch]
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

export default MessagesFrom
