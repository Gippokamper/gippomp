import { Box, Typography } from '@mui/material'
import React from 'react'
import Desktop from '../../../../assets/icons/Desktop'
import styles from './index.module.scss'

function Device() {
  return (
    <Box className={styles.container}>
      <Desktop />
      <Typography className={styles.text}>Windows 10, Aser Ar965, Персональный компьютер</Typography>
      <Box className={styles.button}>O’chirish</Box>
    </Box>
  )
}

export default Device
