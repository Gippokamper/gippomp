import { Box, InputAdornment, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'
import styles from './index.module.scss'
import OutlinedButton from '../../../../components/outlined-button'
import MoneyWallet from '../../../../assets/icons/MoneyWallet'
import { Search } from '@mui/icons-material'
// import HistoryCard from '../history-card'
// import Payments from '../payments'
// import Tariffs from '../tariffs'
// import Settings from '../settings'
// import Messages from '../messages'
// import TariffIcon from '../../../../assets/icons/TariffIcon'
// import SettingsIcon from '../../../../assets/icons/Setting'
// import ChatIcon from '../../../../assets/icons/ChatIcon'
import PersonIcon from '@mui/icons-material/Person'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import RateReviewIcon from '@mui/icons-material/RateReview'
import MessagesTo from '../messages-to'
import MessagesFrom from '../messages-from'
import Vacancy from '../vacancy'
import Feedback from '../feedback'
import { useSearchParams } from 'react-router-dom'

function Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Box className={styles.container}>
      <Box className={styles.container_header}>
        <OutlinedButton
          icon={<PersonIcon />}
          isActive={searchParams.get('type') === 'messages_to'}
          onClick={() => setSearchParams({ type: 'messages_to' })}
          title='Foydalanuvchilarga xabar'
        />
        <OutlinedButton
          icon={<MailOutlineIcon />}
          isActive={searchParams.get('type') === 'messages_from'}
          onClick={() => setSearchParams({ type: 'messages_from' })}
          title='Foydalanuvchilardan xabar'
        />
        <OutlinedButton
          icon={<WorkOutlineIcon />}
          isActive={searchParams.get('type') === 'vacancies'}
          onClick={() => setSearchParams({ type: 'vacancies' })}
          title='Vakansiyalar'
        />
        <OutlinedButton
          icon={<RateReviewIcon />}
          onClick={() => setSearchParams({ type: 'feedback' })}
          isActive={searchParams.get('type') === 'feedback'}
          title='Xabarlar'
        />
      </Box>
      <Box className={styles.container_content}>
        {searchParams.get('type') === 'messages_to' && <MessagesTo />}
        {searchParams.get('type') === 'messages_from' && <MessagesFrom />}
        {searchParams.get('type') === 'vacancies' && <Vacancy />}
        {searchParams.get('type') === 'feedback' && <Feedback />}
      </Box>
    </Box>
  )
}

export default Content
