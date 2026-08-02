import React from 'react'
import styles from './index.module.scss'
import { Box, Typography } from '@mui/material'

function TariffCard() {
  return (
    <Box className={styles.container}>
      <Typography className={styles.title}>“1 oy” tarifi</Typography>
      <Typography className={styles.description}>Bir oylik tarif rejasi</Typography>
      <Typography className={styles.price}>10 000 so’m</Typography>
      <Box className={styles.button}>Ulanish</Box>
    </Box>
  )
}

export default TariffCard
