import { Box, Button, Drawer, Typography } from '@mui/material'
import React, { ReactElement, ReactNode, useContext, useMemo, useRef, useState } from 'react'
import MainLayout from '../main'
import { MRT_ColumnDef, MRT_TableInstance, MaterialReactTable } from 'material-react-table'
import { TableFilterContext } from '../../context/TableFilterContext'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface IProps {
  buttons?: React.ReactNode[]
  topComponent?: React.ReactNode
  tableProps?: any
  data: any[]
  columns?: any[]
  drawerComponent?: React.ReactElement
  onClick?: (el: any) => void
  pageName?: string
  filters?: React.ReactElement[]
  collectionQuery?: any
  exportQuery?: any
  deleteBulkMutation?: any
  importMutation?: any
  params?: any
  disablePagination?: boolean
  createData?: (el: any) => any
  onAdd?: (el: any) => void
  rightContent?: (cb: any) => ReactElement
}

function PageLayout(props: IProps) {
  const { i18n } = useTranslation()
  const filter = useContext(TableFilterContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const doesAnyHistoryEntryExist = location.key !== 'default'

  const navigate = useNavigate()
  const {
    columnFilters,
    globalFilter,
    sorting,
    pagination,
    rowCount,
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setPagination,
    setRowCount
  } = filter
  const tableInstanceRef = useRef<MRT_TableInstance<any>>(null) //ts

  const {
    data,
    isError,
    isLoading,
    isFetching: isRefetching,
    refetch
  } = useQuery(
    [props.pageName, pagination?.pageIndex, pagination?.pageSize, i18n.language, globalFilter],
    () =>
      props.collectionQuery({
        perPage: pagination.pageSize,
        page: pagination?.pageIndex + 1,
        lang: i18n.language,
        search: globalFilter,
        ...(props.params ? props.params : {})
      }),

    {
      onSuccess: (data: any) => {
        setRowCount(data?.meta?.total)
      }
    }
  )

  console.log(rowCount, 'rowCount')

  const { mutate } = useMutation(props.deleteBulkMutation, {
    onSuccess: (data: any) => {
      refetch()
      console.log(data, 'delete data')
      toast.success('Deleted')
    }
  })

  console.log(pagination, 'pagination')

  const someEventHandler = () => {
    const rowSelection = tableInstanceRef?.current?.getState().rowSelection
    console.log(rowSelection)

    //@ts-ignore
    mutate({ ids: Object.keys(rowSelection || {}) })
  }

  return (
    <>
      {props.topComponent && props.topComponent}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          maxWidth: '100%',
          alignItems: 'flex-start',
          gap: '1rem'
        }}
      >
        {props.rightContent && (
          <Box
            sx={{
              maxWidth: '50%'
            }}
          >
            {props.rightContent(refetch)}
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            maxWidth: props.rightContent ? '50%' : '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              mb: 2,
              gap: 2
            }}
          >
            <Typography typography={'h3'}>{props?.pageName || 'Users'}</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2
              }}
            >
              {props.buttons?.map(button => button)}
              <Button variant='contained' color='error' onClick={someEventHandler}>
                Delete
              </Button>
              <Button variant='contained'>Edit</Button>
              <Button variant='contained' color='secondary'>
                Block
              </Button>
              <Button
                onClick={props.onAdd ? props.onAdd : () => setSearchParams({ onAdd: 'true' })}
                variant='contained'
                color='success'
              >
                Add
              </Button>
            </Box>
          </Box>
          <MaterialReactTable
            tableInstanceRef={tableInstanceRef}
            localization={i18n.language === 'ru' ? MRT_Localization_RU : MRT_Localization_EN}
            enablePagination={!props.disablePagination}
            columns={props.columns || []}
            data={
              !!props.createData && !!data?.data ? props.createData(data?.data?.data) : data?.data || props.data || []
            }
            selectAllMode='all'
            enableRowSelection
            muiTablePaperProps={{
              elevation: 0,
              sx: { borderRadius: 3, border: '1px solid rgba(18, 27, 45, 0.06)', overflow: 'hidden' }
            }}
            muiTableHeadCellProps={{
              sx: { backgroundColor: '#f6f8fa', fontWeight: 700, color: '#121b2d' }
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => {
                //@ts-ignore
                props.onClick
                  ? props.onClick(row.original)
                  : setSearchParams({ id: row.original?.uuid || row.original?.id })
              },
              sx: {
                cursor: 'pointer',
                '&:hover td': { backgroundColor: 'rgba(77, 175, 0, 0.06)' }
              }
            })}
            // onRowSelectionChange={(e)=>{console.log(e)}}

            //optionally override the default column widths
            // defaultColumn={{
            //   maxSize: 400,
            //   minSize: 2,
            //   size: 150 //default size is usually 180
            // }}
            enableColumnResizing
            columnResizeMode='onChange' //default
            // getRowId={(row: any) => row?.id}
            // initialState={{ showColumnFilters: true }}
            getRowId={originalRow => originalRow.id}
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
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            rowCount={rowCount}
            state={{
              columnFilters,
              globalFilter,
              isLoading,
              pagination,
              showAlertBanner: isError,
              showProgressBars: isRefetching,
              sorting
            }}
          />
        </Box>
      </Box>
      <Drawer
        open={(!!searchParams.get('id') || !!searchParams.get('onAdd')) && !!props.drawerComponent}
        anchor='right'
        variant='temporary'
        onClose={() => {
          if (doesAnyHistoryEntryExist) {
            navigate(-1)
          } else {
            searchParams.delete('id')
            searchParams.delete('onAdd')
            setSearchParams(searchParams)
          }
        }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '80%', sm: '80%' } } }}
      >
        {props.drawerComponent && props.drawerComponent}
      </Drawer>
    </>
  )
}

export default PageLayout
