import { Box, Button, CircularProgress, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import styles from './index.module.scss'
import MyEditor from '../../components/editor'
import { request } from '../../utils/request'
import { useMutation, useQuery } from 'react-query'
import toast from 'react-hot-toast'

const GET_PRIVACY = async () => {
  const response = await request({
    url: '/dashboard/admin/privacy_policy',
    method: 'GET'
  })
  return response.data
}
const EDIT_PRIVACY = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/privacy_policy',
    method: 'PUT',
    data: data
  })
  return response.data
}

function PrivacyPolicy() {
  const [text, setText] = useState({ uz: '', ru: '', en: '' })
  const [alignment, setAlignment] = React.useState<'uz' | 'ru' | 'en'>('uz')
  // Ilgari shart `if (!text?.uz)` edi: o'zbekcha matn bo'sh bo'lsa har bir
  // qayta so'rovda tahrirlanayotgan matn ustiga yozib yuborilardi.
  const loadedRef = useRef(false)

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    newAlignment && setAlignment(newAlignment)
  }

  const { isLoading } = useQuery(['privacy'], GET_PRIVACY, {
    onSuccess: data => {
      if (loadedRef.current) return
      loadedRef.current = true
      setText({ uz: '', ru: '', en: '', ...(data?.data?.text || {}) })
    }
  })

  const { mutate, isLoading: isSaving } = useMutation(EDIT_PRIVACY, {
    onSuccess: () => {
      toast.success('Yangilandi!')
    }
  })

  return (
    <Box className={styles.container}>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 2 }}>
        Maxfiylik siyosati
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ToggleButtonGroup
            color='primary'
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label='Language'
            size='small'
          >
            <ToggleButton value='uz'>UZ</ToggleButton>
            <ToggleButton value='ru'>RU</ToggleButton>
            <ToggleButton value='en'>EN</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MyEditor value={text?.[alignment] || ''} setValue={e => setText({ ...text, [alignment]: e })} />
          )}
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' disabled={isSaving || isLoading} onClick={() => mutate({ text })}>
            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PrivacyPolicy
