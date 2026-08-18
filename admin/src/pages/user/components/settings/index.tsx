import { Box, FormControl, Grid, Input, InputLabel, OutlinedInput } from '@mui/material'
import React from 'react'
import TextInput from '../../../../components/input'
import styles from './index.module.scss'
import OutlinedButton from '../../../../components/outlined-button'

function Settings() {
  return (
    <Box className={styles.container}>
      <Grid container xs={12} spacing={2} sx={{ mb: '1.88rem' }}>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput type='file' />
        </Grid>
      </Grid>
      <OutlinedButton title='Saqlash' isActive />
    </Box>
  )
}

export default Settings
