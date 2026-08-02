import { Box, IconButton, List, ListItem, ListItemText, Tooltip } from '@mui/material'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import React, { useMemo, useState } from 'react'
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
const messages: IMessagesFrom[] = [
  {
    id: 13,
    user_id: {
      id: 103324,
      uuid: '29a1dead-7747-4bcf-85bd-dc482f5586f4',
      firstname: 'Javoxir',
      lastname: 'fewferfrrerf',
      phone: 998997821026,
      email: 'quvonchbekyunusov222998@gmail.com',
      gender: 'male',
      profession: 'student',
      graduation_year: 2021,
      interests: 'refefer',
      birthday: '2021-11-11',
      //   province: 'dsvfsdffsdf',
      image: '/image/profile/Q1ZhQOcTAa.webp',
      role: 'user',
      status: 1
    },
    article_id: null,
    block_id: null,
    question_id: null,
    type: 'chapter',
    messages: [
      {
        id: 8,
        author: 'admin',
        message: 'asdasdasd'
      },
      {
        id: 9,
        author: 'user',
        message: 'asdasdasd'
      },
      {
        id: 10,
        author: 'user',
        message: 'asdasdasd'
      },
      {
        id: 11,
        author: 'user',
        message: 'werwer'
      },
      {
        id: 12,
        author: 'user',
        message: 'werwer'
      },
      {
        id: 55,
        author: 'user',
        message: 'dngdfbgdfbgdf'
      }
    ]
  }
]

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const columns = useMemo<MRT_ColumnDef<IMessagesFrom>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Kiritildi',
        size: 10
      },
      {
        accessorKey: 'user_id',
        header: 'Foydalanuvchi',
        size: 60,
        //@ts-ignore
        Cell: ({ cell }) => cell.getValue()?.firstname + ' ' + cell?.getValue()?.lastname
      },

      {
        accessorKey: 'user_id.email',
        header: 'Email'
      },
      {
        accessorKey: 'messages',
        header: 'Xabar',
        Cell: ({ cell }) => (
          <Box>
            <List>
              {/* @ts-ignore */}
              {cell.getValue()?.map((el: Message) => (
                <ListItem>
                  <ListItemText>{el.author}:</ListItemText>
                  <ListItemText>{el.message}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        )
      },
      {
        accessorKey: 'id',
        header: 'Javob yuborish',
        Cell: ({ cell }) => <MessageComponent refresh={refetch} id={Number(cell.getValue())} />
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
        lang: i18n.language,
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

export default MessagesFrom
