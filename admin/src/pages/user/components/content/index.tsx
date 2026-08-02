import { Box, InputAdornment, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'
import styles from './index.module.scss'
import OutlinedButton from '../../../../components/outlined-button'
import MoneyWallet from '../../../../assets/icons/MoneyWallet'
import { Search } from '@mui/icons-material'
import HistoryCard from '../history-card'
import Payments from '../payments'
import Tariffs from '../tariffs'
import Settings from '../settings'
import Messages from '../messages'
import TariffIcon from '../../../../assets/icons/TariffIcon'
import SettingsIcon from '../../../../assets/icons/Setting'
import ChatIcon from '../../../../assets/icons/ChatIcon'

function Content() {
  const [selected, setSelected] = useState('To’lovlar')
  return (
    <Box className={styles.container}>
      <Box className={styles.container_header}>
        <OutlinedButton
          icon={<MoneyWallet />}
          onClick={() => setSelected('To’lovlar')}
          isActive={selected === 'To’lovlar'}
          title='To’lovlar'
        />
        <OutlinedButton
          icon={<TariffIcon />}
          isActive={selected === 'Tariflar'}
          onClick={() => setSelected('Tariflar')}
          title='Tariflar'
        />
        <OutlinedButton
          icon={<SettingsIcon />}
          isActive={selected === 'Sozlamalar'}
          onClick={() => setSelected('Sozlamalar')}
          title='Sozlamalar'
        />
        <OutlinedButton
          icon={<ChatIcon />}
          isActive={selected === 'Xabarlar'}
          onClick={() => setSelected('Xabarlar')}
          title='Xabarlar'
        />
      </Box>
      <Box className={styles.container_content}>
        {selected === 'To’lovlar' && <Payments />}
        {selected === 'Tariflar' && <Tariffs />}
        {selected === 'Sozlamalar' && <Settings />}
        {selected === 'Xabarlar' && <Messages />}
      </Box>
    </Box>
  )
}

export default Content
