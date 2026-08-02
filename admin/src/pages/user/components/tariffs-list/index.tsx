import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from './index.module.scss'
import TariffCard from '../tariff-card'

function TariffsList() {
  return (
    <Box>
      <Typography className={styles.title}>Triflar</Typography>
      <TariffCard />
    </Box>
  )
}

export default TariffsList
