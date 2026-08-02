import { Search } from '@mui/icons-material'
import { InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import HistoryCard from '../history-card'
import styles from './index.module.scss'
import PaidTariffs from '../paid-tariffs'
import Devices from '../devises'
import TariffsList from '../tariffs-list'

function Tariffs() {
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
      <PaidTariffs />
      <Devices />
      <TariffsList />
    </>
  )
}

export default Tariffs
