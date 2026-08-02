import { Box, Input, OutlinedInput, Typography } from '@mui/material'
import React from 'react'
import styles from './index.module.scss'

interface ITextInput {
  type?: string
  className?: string
  label?: string
  value?: string
  onchange?: (val: string) => void
}

function TextInput(props: ITextInput) {
  return (
    <Box className={`${styles.container} ${props.className ? props.className : ''}`}>
      <Typography className={styles.label}>{props.label || 'Label'}</Typography>
      <OutlinedInput
        value={props.value}
        //@ts-ignore
        onChange={el => props.onchange(el.target.value)}
        fullWidth
        size='small'
        type='text'
        {...props}
        label={''}
      />
    </Box>
  )
}

export default TextInput
