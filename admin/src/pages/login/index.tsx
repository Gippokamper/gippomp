import { Box, Button, CircularProgress, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import TextInput from '../../components/input'
import { useMutation } from 'react-query'
import { LOGIN } from './mutations'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const { mutate, isLoading } = useMutation(LOGIN, {
    onSuccess: (data: any) => {
      // Token bo'lmasa "undefined" saqlab, keyingi so'rovlarni buzmaymiz.
      if (data?.data?.access_token) {
        localStorage.setItem('accessToken', data.data.access_token)
        navigate('/')
      }
    }
  })
  const [data, setData] = useState({
    phone: '998901112233',
    password: 'admin12345'
  })
  return (
    <Box className={styles.container}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: '0 12px 44px rgba(18, 27, 45, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
          width: 'min(92vw, 560px)'
        }}
      >
        <img src={require('../../assets/images/logo.webp')} alt='logo' className={styles.image} />

        <p className={styles.title}>Profilga kirish</p>

        <TextInput
          className={styles.input}
          value={data.phone}
          onchange={el => setData({ ...data, phone: el })}
          label='Login'
        />
        <TextInput
          className={styles.input}
          value={data.password}
          onchange={el => setData({ ...data, password: el })}
          label='Password'
        />

        <Button variant='contained' fullWidth size='large' sx={{ mt: 1 }} onClick={() => mutate(data)}>
          {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Kirish'}
        </Button>
      </Paper>
    </Box>
  )
}

export default Login
