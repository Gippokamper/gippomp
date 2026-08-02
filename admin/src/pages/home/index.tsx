import { Title } from '@mui/icons-material'
import { Box, Card, CardContent, CardHeader, Grid } from '@mui/material'
import React from 'react'
import MainLayout from '../../layouts/main'

function Home() {
  return (
    <>
      <Box sx={{ p: 2 }}>
        <Grid container gap={2}>
          <Grid item sm={6} md={3} xl={2}>
            <Card title='title'>
              <CardHeader title='Bank' />
              <CardContent>21322</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Home
