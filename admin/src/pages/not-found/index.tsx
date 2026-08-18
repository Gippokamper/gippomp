import { Box, Button, Paper, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { useLocation, useNavigate } from 'react-router-dom'

// Mavjud bo'lmagan manzil ochilganda ilgari butunlay bo'sh sahifa ko'rinardi
// (Routes hech qanday element qaytarmasdi) — admin nima bo'lganini bilmasdi.
function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', maxWidth: 460, border: '1px solid rgba(18,27,45,0.08)' }}>
        <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
          Sahifa topilmadi
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3, wordBreak: 'break-all' }}>
          {location.pathname}
        </Typography>
        <Button variant='contained' startIcon={<HomeIcon />} onClick={() => navigate('/')}>
          Bosh sahifa
        </Button>
      </Paper>
    </Box>
  )
}

export default NotFound
