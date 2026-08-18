import { Box, Button, Drawer, IconButton, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import {
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_TableInstance,
  MaterialReactTable
} from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Confirm from '../../components/confirm'

interface IProps {
  buttons?: React.ReactNode[]
  topComponent?: React.ReactNode
  tableProps?: any
  /** Eski chaqiriqlar uchun qoldirilgan — jadval endi faqat API ma'lumotini ko'rsatadi. */
  data?: any[]
  columns?: any[]
  drawerComponent?: React.ReactElement
  onClick?: (el: any) => void
  pageName?: string
  collectionQuery: any
  deleteBulkMutation?: any
  params?: any
  disablePagination?: boolean
  /** Backend'da yaratish yo'q bo'lsa (masalan Users) — qo'shish tugmasi yashiriladi. */
  disableAdd?: boolean
  /** Backend'da bulk_delete yo'q bo'lsa — tanlash va o'chirish yashiriladi. */
  disableDelete?: boolean
  onAdd?: (el?: any) => void
  rightContent?: (cb: any) => ReactElement
}

function PageLayout(props: IProps) {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const tableInstanceRef = React.useRef<MRT_TableInstance<any>>(null)

  // Jadval holati har bir sahifaning o'zida saqlanadi. Ilgari u global context'da
  // edi: Users'da 5-sahifaga o'tib Articles'ga kirsangiz, Articles ham 5-sahifadan
  // ochilardi (ko'pincha bo'sh) va qidiruv matni sahifalar orasida yopishib qolardi.
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [confirmOpen, setConfirmOpen] = useState(false)

  const paramsKey = useMemo(() => JSON.stringify(props.params ?? {}), [props.params])
  const canDelete = !props.disableDelete && !!props.deleteBulkMutation

  // Qidiruv yoki filtr (params) o'zgarsa 1-sahifaga qaytamiz: aks holda 3-sahifada
  // turib qidirganda "hech narsa topilmadi" ko'rinardi.
  useEffect(() => {
    setPagination(prev => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }))
    setRowSelection({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter, paramsKey])

  const { data, isError, isLoading, isFetching, refetch } = useQuery(
    // params ham kalitga kiradi: aks holda bir xil pageName'li ikki sahifa
    // (masalan Study Plan / Study Plan Folders) bir-birining cache'ini ko'rsatardi.
    [
      props.pageName,
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        lang: i18n.language,
        search: globalFilter,
        params: paramsKey
      }
    ],
    () =>
      props.collectionQuery({
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1,
        lang: i18n.language,
        search: globalFilter,
        ...(props.params ? props.params : {})
      }),
    { keepPreviousData: true }
  )

  const rows: any[] = Array.isArray(data?.data) ? data.data : []
  const rowCount: number = data?.meta?.total ?? rows.length

  const selectedIds = useMemo(() => Object.keys(rowSelection).filter(key => rowSelection[key]), [rowSelection])

  const { mutate: deleteRows, isLoading: isDeleting } = useMutation(
    (ids: string[]) => (props.deleteBulkMutation ? props.deleteBulkMutation({ ids }) : Promise.resolve()),
    {
      onSuccess: () => {
        setRowSelection({})
        setConfirmOpen(false)
        toast.success(t('Deleted'))
        queryClient.invalidateQueries([props.pageName])
      },
      onError: () => setConfirmOpen(false)
    }
  )

  const handleAdd = () => {
    if (props.onAdd) {
      props.onAdd()
      return
    }
    // Mavjud query param'lar saqlanadi (masalan messages'dagi ?type=...).
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('id')
      next.set('onAdd', 'true')
      return next
    })
  }

  const closeDrawer = () => {
    // navigate(-1) admin'ni butunlay boshqa sahifaga olib ketishi mumkin edi —
    // shunchaki drawer'ni ochgan param'larni tozalaymiz.
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('id')
      next.delete('onAdd')
      return next
    })
  }

  const title = props.pageName ? t(props.pageName) : ''

  return (
    <>
      {props.topComponent && props.topComponent}
      <Box
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', lg: 'nowrap' },
          maxWidth: '100%',
          alignItems: 'flex-start',
          gap: 2
        }}
      >
        {props.rightContent && <Box sx={{ width: { xs: '100%', lg: '38%' } }}>{props.rightContent(refetch)}</Box>}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              mb: 2,
              gap: 1.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant='h5' sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              {!isLoading && (
                <Typography variant='body2' color='text.secondary'>
                  {rowCount}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
              {props.buttons?.map(button => button)}
              <Tooltip title={t('Refresh')}>
                <IconButton onClick={() => refetch()} size='small'>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {/* Tugma faqat qator tanlanganda ishlaydi — ilgari u hech nima
                  tanlanmagan holatda ham bosilib, bo'sh so'rov yuborardi. */}
              {canDelete && (
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<DeleteOutlineIcon />}
                  disabled={!selectedIds.length || isDeleting}
                  onClick={() => setConfirmOpen(true)}
                >
                  {t('Delete')}
                  {selectedIds.length ? ` (${selectedIds.length})` : ''}
                </Button>
              )}
              {!props.disableAdd && (
                <Button onClick={handleAdd} variant='contained' startIcon={<AddIcon />}>
                  {t('Add')}
                </Button>
              )}
            </Box>
          </Box>
          <MaterialReactTable
            tableInstanceRef={tableInstanceRef}
            localization={i18n.language === 'ru' ? MRT_Localization_RU : MRT_Localization_EN}
            enablePagination={!props.disablePagination}
            columns={props.columns || []}
            // Faqat API ma'lumoti. Ilgari so'rov xato bo'lsa mock (demo) qatorlar
            // ko'rsatilardi va admin ularni haqiqiy deb o'ylardi.
            data={rows}
            enableRowSelection={canDelete}
            selectAllMode='page'
            enableColumnActions={false}
            // Backend saralash/ustun filtrini qo'llab-quvvatlamaydi: bu boshqaruvlar
            // hech nima qilmasdi, shuning uchun o'chirildi.
            enableSorting={false}
            enableColumnFilters={false}
            enableDensityToggle={false}
            enableFullScreenToggle={false}
            muiTablePaperProps={{
              elevation: 0,
              sx: { borderRadius: 3, border: '1px solid rgba(18, 27, 45, 0.08)', overflow: 'hidden' }
            }}
            muiTableHeadCellProps={{
              sx: { backgroundColor: '#f6f8fa', fontWeight: 700, color: '#121b2d', fontSize: '0.875rem' }
            }}
            muiTableBodyCellProps={{ sx: { fontSize: '0.875rem' } }}
            muiSearchTextFieldProps={{
              placeholder: t('Search'),
              sx: { minWidth: '18rem' },
              variant: 'outlined',
              size: 'small'
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => {
                if (props.onClick) {
                  props.onClick(row.original)
                  return
                }
                if (!props.drawerComponent) return
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev)
                  next.delete('onAdd')
                  next.set('id', String((row.original as any)?.uuid ?? (row.original as any)?.id ?? ''))
                  return next
                })
              },
              sx: {
                cursor: props.onClick || props.drawerComponent ? 'pointer' : 'default',
                '&:hover td': { backgroundColor: 'rgba(77, 175, 0, 0.06)' }
              }
            })}
            enableColumnResizing
            columnResizeMode='onChange'
            // Tanlov kalitlari = bulk_delete kutadigan id'lar.
            getRowId={originalRow => String((originalRow as any)?.id ?? (originalRow as any)?.uuid ?? '')}
            manualFiltering
            manualPagination
            manualSorting
            muiToolbarAlertBannerProps={isError ? { color: 'error', children: t('Error loading data') } : undefined}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            onRowSelectionChange={setRowSelection}
            rowCount={rowCount}
            state={{
              globalFilter,
              isLoading,
              pagination,
              rowSelection,
              showAlertBanner: isError,
              showProgressBars: isFetching,
              density: 'comfortable'
            }}
            {...props.tableProps}
          />
        </Box>
      </Box>
      <Drawer
        open={(!!searchParams.get('id') || !!searchParams.get('onAdd')) && !!props.drawerComponent}
        anchor='right'
        variant='temporary'
        onClose={closeDrawer}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '90%', md: '46rem' }, maxWidth: '100%' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={closeDrawer} aria-label={t('Close')}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* key — har bir yozuv uchun forma yangidan quriladi. Ilgari A yozuvini
            ochib, keyin B ni ochsangiz, formadagi lokal holat (rasm, muharrir
            matni, ro'yxatlar) A dan qolib ketardi. */}
        {props.drawerComponent &&
          React.cloneElement(props.drawerComponent, {
            key: searchParams.get('id') || (searchParams.get('onAdd') ? 'new' : 'closed')
          })}
      </Drawer>
      <Confirm
        isOpen={confirmOpen}
        title={`${t('Delete')} (${selectedIds.length})?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => deleteRows(selectedIds)}
      />
    </>
  )
}

export default PageLayout
