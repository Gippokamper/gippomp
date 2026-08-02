import { Box, Button, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
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
  const [text, setText] = useState({
    uz: '',
    ru: '',
    en: ''
  })
  const [alignment, setAlignment] = React.useState<'uz' | 'ru' | 'en'>('uz')
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    setAlignment(newAlignment)
  }
  const { data } = useQuery(['privacy'], GET_PRIVACY, {
    onSuccess: data => {
      if (!text?.uz) {
        setText(data?.data?.text)
      }
      console.log('reload')
    }
  })

  const { mutate } = useMutation(EDIT_PRIVACY, {
    onSuccess: () => {
      toast.success('Yangilandi!')
    }
  })

  const handleSubmit = () => {
    console.log(text)
    mutate({ text: text })
  }
  return (
    <Box className={styles.container}>
      <Typography typography={'h5'}>Privacy policy</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label='Language'
          >
            <ToggleButton value='uz'>UZ</ToggleButton>
            <ToggleButton value='ru'>RU</ToggleButton>
            <ToggleButton value='en'>EN</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <MyEditor value={text?.[alignment] || ''} setValue={e => setText({ ...text, [alignment]: e })} />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='success' onClick={() => handleSubmit()} fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PrivacyPolicy
