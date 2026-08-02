import { Box, Typography } from '@mui/material'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
import React, { useMemo } from 'react'
import styles from './index.module.scss'

type PaidTariffsType = {
  buyDate: string
  tariff: string
  endDate: string
  addition: string
}

const paidTariffs = [
  {
    buyDate: '2023-07-15',
    tariff: 'Tariff nomi',
    endDate: '2024-07-15',
    addition: "Qo'shimcha ma'lumot"
  }
]

function PaidTariffs() {
  const columns = useMemo<MRT_ColumnDef<PaidTariffsType>[]>(
    () => [
      {
        accessorKey: 'buyDate', //access nested data with dot notation
        header: 'Sotib olindi'
      },
      {
        accessorKey: 'tariff',
        header: 'Tarif'
      },
      {
        accessorKey: 'endDate', //normal accessorKey
        header: 'Tugaydi'
      },
      {
        accessorKey: 'addition',
        header: 'Qo’shimcha malumot'
      }
    ],
    []
  )

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} typography={'p'}>
        Tarif rejamiz
      </Typography>
      <MaterialReactTable columns={columns} data={paidTariffs} />
    </Box>
  )
}

export default PaidTariffs
