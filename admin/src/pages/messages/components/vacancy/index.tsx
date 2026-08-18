import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { request } from '../../../../utils/request'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RefreshIcon from '@mui/icons-material/Refresh'

interface IResume {
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

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, py: 1, alignItems: 'flex-start' }}>
        <Typography variant='body2' color='text.secondary' sx={{ flex: '0 0 45%' }}>
          {label}
        </Typography>
        <Typography variant='body2' sx={{ flex: 1, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
          {value || '—'}
        </Typography>
      </Box>
      <Divider />
    </>
  )
}

function Vacancy() {
  const { i18n } = useTranslation()
  const [globalFilter, setGlobalFilter] = useState('')
  const [id, setId] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo<MRT_ColumnDef<IResume>[]>(
    () => [
      { accessorKey: 'full_name', header: 'Ism familiya', size: 200 },
      { accessorKey: 'address', header: 'Manzil', size: 220 },
      { accessorKey: 'email', header: 'Email', size: 180 },
      { accessorKey: 'phone', header: 'Telefon', size: 150 },
      {
        id: 'view',
        header: 'Ko`rish',
        size: 90,
        Cell: ({ row }) => (
          // Ilgari bu yerda id String'ga o'girilib, number holatiga yozilardi.
          <IconButton onClick={() => setId(Number(row.original?.id))}>
            <RemoveRedEyeIcon />
          </IconButton>
        )
      }
    ],
    []
  )

  const { data, isError, refetch, isLoading, isFetching } = useQuery(
    ['resumes', globalFilter, pagination.pageIndex, pagination.pageSize, i18n.language],
    () =>
      GET_RESUMES({
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1,
        lang: i18n.language,
        search: globalFilter
      }),
    { keepPreviousData: true }
  )

  const { data: rData, isLoading: rIsLoading } = useQuery(['resume', id], () => GET_RESUME(id), { enabled: !!id })
  const resume: IResume | undefined = rData?.data

  const languages = [resume?.english ? 'Ingliz' : null, resume?.german ? 'Nemis' : null].filter(Boolean).join(', ')

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

      {/* Ilgari bu 400px li Modal edi va uning ichida 9 ta maydon o'rniga
          bir xil `full_name` chiqarilardi (nusxa-ko'chirish xatosi). */}
      <Dialog open={!!id} onClose={() => setId(0)} fullWidth maxWidth='sm' scroll='paper'>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Rezyume
          <IconButton onClick={() => setId(0)} size='small'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {rIsLoading ? (
            <Typography variant='body2'>Yuklanmoqda...</Typography>
          ) : (
            <>
              <Row label='Ism familiya' value={resume?.full_name} />
              <Row label='Tug‘ilgan sana' value={resume?.birthday} />
              <Row label='Yashash manzili' value={resume?.address} />
              <Row label='E-mail' value={resume?.email} />
              <Row label='Telefon' value={resume?.phone} />
              <Row label='Vakansiya' value={resume?.vacancy?.name} />
              <Row label='Biladigan tillari' value={languages} />
              <Row label='Til bilish darajasi' value={resume?.language_level} />
              <Row label="Hozirda nima bilan shug'ullanadi" value={resume?.now_do} />
              <Row label='Ta’lim ma’lumoti' value={resume?.study_info} />
              <Row label='Bizga qo‘shilishdan maqsad' value={resume?.stimulus} />
              <Row label='Tibbiyotda qiziqqan sohalari' value={resume?.interest} />
              <Row label='Qo‘shimcha izoh' value={resume?.comment} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Vacancy
