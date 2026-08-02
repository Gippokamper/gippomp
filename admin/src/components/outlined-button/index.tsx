import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import styles from './index.module.scss'

interface IProps {
  icon?: ReactElement
  title: string
  onClick?: () => void
  isActive?: boolean
}

function OutlinedButton(props: IProps) {
  return (
    <Box width={'25%'} onClick={props.onClick} className={props.isActive ? styles.container_active : styles.container}>
      {props.icon}
      <Typography className={styles.title} typography={'span'}>
        {props.title}
      </Typography>
    </Box>
  )
}

export default OutlinedButton
