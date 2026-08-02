import { Search } from '@mui/icons-material'
import { InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import HistoryCard from '../history-card'
import styles from './index.module.scss'

function Payments() {
  return (
    <>
      <OutlinedInput
        className={styles.container_content_input}
        id='input-with-icon-adornment'
        size='small'
        fullWidth
        type='outlined'
        startAdornment={
          <InputAdornment position='start'>
            <Search />
          </InputAdornment>
        }
      />
      <HistoryCard />
      <HistoryCard />
      <HistoryCard />
      <HistoryCard />
    </>
  )
}

export default Payments
