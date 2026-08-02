import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from './index.module.scss'

function HistoryCard() {
  return (
    <Box className={styles.container}>
      <Typography typography={'p'} className={styles.container_title}>
        O’tkazildi
      </Typography>
      <Typography typography={'p'} className={styles.container_content}>
        +1 qurilma tarifi uchun hisobingizdan 45000 so’m yechib qolindi. Hozircha ballansingiz 365000.00 so’m
      </Typography>
      <Box className={styles.container_info}>
        <Typography typography={'p'} className={styles.container_info_date}>
          12:30, 12.02.2022
        </Typography>
        <Typography typography={'p'} className={styles.container_info_sum}>
          1 200 000.00 UZS{' '}
        </Typography>
      </Box>
    </Box>
  )
}

export default HistoryCard
