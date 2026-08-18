import React from 'react'
import MainLayout from '../../layouts/main'
import { Box, Card, Grid } from '@mui/material'
import styles from './index.module.scss'
import UserInfo from './components/user-info'
import Content from './components/content'

function User() {
  return (
    <>
      <Box>
        <p className={styles.title}>Account</p>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <UserInfo />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <Content />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default User
