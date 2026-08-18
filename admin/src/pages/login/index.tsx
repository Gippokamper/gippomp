import { Box, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { LOGIN } from './mutations'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  // Ilgari bu yerda admin login/paroli kodga yozib qo'yilgan edi.
  const [data, setData] = useState({ phone: '', password: '' })
  const [touched, setTouched] = useState(false)

  const { mutate, isLoading } = useMutation(LOGIN, {
    onSuccess: (response: any) => {
      const token = response?.data?.access_token
      const role = response?.data?.user?.role
      if (!token) {
        toast.error('Kirish amalga oshmadi')
        return
      }
      // Admin paneliga faqat admin kira oladi. Ilgari oddiy foydalanuvchi ham
      // kirar, keyin har bir so'rov 403 qaytarib, sabab ko'rinmasdi.
      if (role && role !== 'admin') {
        toast.error('Bu hisob admin emas')
        return
      }
      localStorage.setItem('accessToken', token)
      navigate('/', { replace: true })
    }
  })

  // Allaqachon kirgan bo'lsa login sahifasi ko'rsatilmaydi.
  if (localStorage.getItem('accessToken')) {
    return <Navigate to='/' replace />
  }

  const isValid = data.phone.trim().length > 0 && data.password.length > 0

  const submit = () => {
    setTouched(true)
    if (!isValid || isLoading) return
    mutate({ phone: data.phone.trim(), password: data.password })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#eef2f5',
        p: 2
      }}
    >
      <Paper
        component='form'
        onSubmit={(e: React.FormEvent) => {
          // Enter bosilganda ham kirish ishlaydi.
          e.preventDefault()
          submit()
        }}
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: '0 12px 44px rgba(18, 27, 45, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: 'min(92vw, 26rem)'
        }}
      >
        <img
          src={require('../../assets/images/logo.webp')}
          alt='Gippokamp'
          style={{ width: '10rem', objectFit: 'contain' }}
        />

        <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
          Profilga kirish
        </Typography>

        <TextField
          fullWidth
          size='small'
          label='Telefon'
          placeholder='998901112233'
          autoComplete='username'
          value={data.phone}
          error={touched && !data.phone.trim()}
          helperText={touched && !data.phone.trim() ? 'Telefon raqamini kiriting' : ' '}
          onChange={e => setData({ ...data, phone: e.target.value })}
        />
        <TextField
          fullWidth
          size='small'
          label='Parol'
          // Parol ochiq matnda ko'rinardi.
          type={showPassword ? 'text' : 'password'}
          autoComplete='current-password'
          value={data.password}
          error={touched && !data.password}
          helperText={touched && !data.password ? 'Parolni kiriting' : ' '}
          onChange={e => setData({ ...data, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' size='small'>
                  {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button type='submit' variant='contained' fullWidth size='large' disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Kirish'}
        </Button>
      </Paper>
    </Box>
  )
}

export default Login
