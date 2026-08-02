import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import styles from './index.module.scss'

interface IProps {
  nonImage?: boolean
  title: string
  image?: string
  text: string
}

function InfoText(props: IProps) {
  return (
    <Box className={styles.container}>
      <Typography
        className={styles.container_title}
        sx={{
          mt: props.nonImage ? '1.25rem' : 0
        }}
        typography={'span'}
      >
        {props.title}
      </Typography>
      <Box className={styles.container_content}>
        {!props.nonImage && <Avatar className={styles.container_content_avatar} />}
        <Typography typography={'p'} className={styles.container_content_text}>
          {props.text}
        </Typography>
      </Box>
    </Box>
  )
}

export default InfoText
