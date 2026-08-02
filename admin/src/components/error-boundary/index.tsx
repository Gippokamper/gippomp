import React from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface Props {
  children: React.ReactNode
  // location o'zgarganda boundary reset bo'lishi uchun (App.tsx da key sifatida beriladi)
  resetKey?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

// Sahifa ichida kutilmagan xato bo'lsa — butun admin oq ekran bo'lib qolmasin.
// O'rniga xato kartochkasi + "Qayta yuklash"/"Orqaga" tugmalari ko'rsatiladi.
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Konsolga yozamiz — kelajakda Sentry va h.k. ga jo'natish mumkin.
    console.error('Admin sahifa xatosi:', error, info)
  }

  componentDidUpdate(prevProps: Props) {
    // Boshqa sahifaga o'tilganda xatoni tozalaymiz.
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, maxWidth: 480, textAlign: 'center', border: '1px solid #eee', borderRadius: 3 }}>
          <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
            Nimadir xato ketdi
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Bu sahifada kutilmagan xatolik yuz berdi. Sahifani qayta yuklab ko'ring yoki orqaga qayting.
          </Typography>
          {this.state.error?.message && (
            <Typography
              variant='caption'
              sx={{ display: 'block', mb: 3, p: 1.5, bgcolor: '#faf5f5', color: '#a33', borderRadius: 1, wordBreak: 'break-word', fontFamily: 'monospace' }}
            >
              {this.state.error.message}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
              Orqaga
            </Button>
            <Button variant='contained' startIcon={<RefreshIcon />} onClick={() => window.location.reload()}>
              Qayta yuklash
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }
}

export default ErrorBoundary
