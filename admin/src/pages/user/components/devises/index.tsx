import { Box, Typography } from '@mui/material'
import React from 'react'
import Device from '../device'
import styles from './index.module.scss'

function Devices() {
  return (
    <Box className={styles.container}>
      <Typography className={styles.title} typography={'p'}>
        Devices
      </Typography>
      <Device />
    </Box>
  )
}

export default Devices
