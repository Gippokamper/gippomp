import { Box, Divider, IconButton, List, ListItem, ListItemText, Modal, Tooltip, Typography } from '@mui/material'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { request } from '../../../../utils/request'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RefreshIcon from '@mui/icons-material/Refresh'

interface IMessagesFrom {
  id: number
  vacancy: {
    id: number
    name: string
  }
  full_name: string
  birthday: string
  address: string
  email: string
  phone: string
  now_do: string
  study_info: string
  english: boolean
  german: boolean
  language_level: string
  stimulus: string
  interest: string
  comment: string
}

const messages: IMessagesFrom[] = [
  {
    id: 1,
    vacancy: {
      id: 1,
      name: ''
    },
    full_name: 'Admin Content',
    birthday: '2023-09-13',
    address: 'г.Ташкент, Юнусабадский район ул Амира Темура, дом 9',
    email: 'admin@gmail.com',
    phone: '+998777777777',
    now_do: '',
    study_info: 'asdasdasd',
    english: true,
    german: false,
    language_level: 'asd',
    stimulus: 'asd',
    interest: 'asd',
    comment: 'asd'
  }
]

export const GET_RESUMES = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/resume',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_RESUME = async (id: number) => {
  const response = await request({
    url: '/dashboard/admin/resume/' + id,
    method: 'GET'
  })

  return response?.data
}

function Vacancy() {
  const { i18n } = useTranslation()
  const [globalFilter, setGlobalFilter] = useState('')
  const [id, setId] = useState(0)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const columns = useMemo<MRT_ColumnDef<IMessagesFrom>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Ism Familiya'
      },

      {
        accessorKey: 'address',
        header: 'Address'
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },
      {
        accessorKey: 'phone',
        header: 'Phone'
      },
      {
        accessorKey: 'id',
        header: 'Ko`rish',
        Cell: ({ cell }) => (
          //@ts-ignore
          <IconButton onClick={() => setId(String(cell.getValue()))}>
            <RemoveRedEyeIcon />
          </IconButton>
        )
      }
    ],
    []
  )

  const { data, isError, refetch, isLoading, isFetching } = useQuery(
    [
      'resumes',
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize //refetch when pagination.pageSize changes
    ],
    () =>
      GET_RESUMES({
        perPage: pagination.pageSize,
        page: pagination?.pageIndex + 1,
        lang: i18n.language,
        search: globalFilter
      })
  )
  const {
    data: rData,
    isError: rIsError,
    refetch: rRefetch,
    isLoading: rIsLoading,
    isFetching: rIsFetching
  } = useQuery(['resume', id], () => GET_RESUME(id), {
    enabled: !!id
  })
  const [open, setOpen] = React.useState(true)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box>
      <MaterialReactTable
        columns={columns}
        data={data?.data || []}
        // muiTableProps={{
        //   sx: {
        //     border: '1px solid rgba(81, 81, 81, 1)'
        //   }
        // }}
        // muiTableHeadCellProps={{
        //   sx: {
        //     border: '1px solid rgba(81, 81, 81, 1)'
        //   }
        // }}
        // muiTableBodyCellProps={{
        //   sx: {
        //     border: '1px solid rgba(81, 81, 81, 1)'
        //   }
        // }}
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
      <Modal
        open={!!id}
        onClose={() => setId(0)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' typography={'h4'}>
            Resume
          </Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', justifyContent: 'space-between' }}>
            <ListItem
              style={{
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <ListItemText primary={`Ism familiya:`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Tug‘ilgan sana:`} />
              <ListItemText primary={rData?.data?.birthday} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Yashash manzili:`} />
              <ListItemText primary={rData?.data?.address} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`E-mail:`} />
              <ListItemText primary={rData?.data?.email} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Telefon:`} />
              <ListItemText primary={rData?.data?.phone} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Mutaxassislik bo‘yicha:`} />
              <ListItemText primary={rData?.data?.full_name || ''} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Biladigan tillari:`} />
              <ListItemText primary={rData?.data?.langugaes} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Til bilish darajasi:`} />
              <ListItemText primary={rData?.data?.degre} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Hozirda nima bilan shug'ullanasiz?`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Qayerda va qaysi mutaxassislik bo‘yicha o‘qigansiz yoki o‘qiyapsiz?`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Tibbiyot sohasida tushunchangiz bormi?`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Bizga qo’shiishdan maqsad:`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>

            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Tibbiyotda qiziqqan sohalari:`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>
            <Divider component='li' />
            <ListItem>
              <ListItemText primary={`Qo‘shimcha izoh:`} />
              <ListItemText primary={rData?.data?.full_name} />
            </ListItem>
            <Divider component='li' />
          </List>
        </Box>
      </Modal>
    </Box>
  )
}

export default Vacancy

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}
