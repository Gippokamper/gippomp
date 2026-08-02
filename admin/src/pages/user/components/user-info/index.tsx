import { Box, Card, CardContent } from '@mui/material'
import React from 'react'
import InfoText from '../info-text'
import styles from './index.module.scss'

function UserInfo() {
  return (
    <Box className={styles.container}>
      <InfoText title='Talaba' image='...' text='Nikolayev Nikolay' />
      <InfoText title='Tarif:' nonImage text='+1 qurilma' />
      <InfoText title='Jinsi:' nonImage text='Erkak' />
      <InfoText title='Telefon raqam:' nonImage text='+998 99 999 99 99' />
      <InfoText title='Email:' nonImage text='nmadurnmadur@gmail.com' />
    </Box>
  )
}

export default UserInfo
