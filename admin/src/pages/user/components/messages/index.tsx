import React, { useMemo } from 'react'
import styles from './index.module.scss'
import { Box, TextareaAutosize, Typography } from '@mui/material'
import OutlinedButton from '../../../../components/outlined-button'
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table'
type PaidTariffsType = {
  date: string
  text: string
}

const paidTariffs = [
  {
    date: '2023-06-05, 16:32:23 ',
    text: 'Nmadur nmadur deb sabsheniya yuborgan man karochi'
  }
]

function Messages() {
  const columns = useMemo<MRT_ColumnDef<PaidTariffsType>[]>(
    () => [
      {
        accessorKey: 'date', //access nested data with dot notation
        header: 'Yuborilgan habar sanasi'
      },
      {
        accessorKey: 'text',
        header: 'Habar'
      }
    ],
    []
  )
  return (
    <Box className={styles.container}>
      <TextareaAutosize className={styles.input} />
      <OutlinedButton title='Yuborish' isActive />
      <Typography className={styles.title}>Habarlar</Typography>
      <MaterialReactTable
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            width: '100%'
          }
        }}
        columns={columns}
        data={paidTariffs}
      />
    </Box>
  )
}

export default Messages
