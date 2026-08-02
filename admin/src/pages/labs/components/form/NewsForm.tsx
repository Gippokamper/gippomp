import { Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import MainLayout from '../../../../layouts/main'
import MyEditor from '../../../../components/editor'
import { GET_LAB } from '../../queries'
import { ILabs } from '../../data/data'
import { CREATE_LAB, UPDATE_LAB } from '../../mutatuions'

function LabsForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [alignment, setAlignment] = React.useState<'uz' | 'ru' | 'en'>('uz')
  const [title, setTitle] = useState({
    uz: '',
    ru: '',
    en: ''
  })
  const [content, setContent] = useState({
    uz: '',
    ru: '',
    en: ''
  })

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    setAlignment(newAlignment)
  }

  const { refetch } = useQuery(
    ['labsss', searchParams.get('labs_id')],
    () => GET_LAB(String(searchParams.get('labs_id'))),
    {
      enabled: false,
      onSuccess: (data: { data: ILabs }) => {
        setTitle(data?.data?.name)
        setContent(data?.data?.description)
      }
    }
  )

  useEffect(() => {
    if (searchParams.get('labs_id')) {
      refetch()
    }
    //eslint-disable-next-line
  }, [searchParams.get('labs_id')])
  const { mutate: create } = useMutation(CREATE_LAB, {
    onSuccess: () => navigate(-1)
  })
  const { mutate: update } = useMutation(UPDATE_LAB, {
    onSuccess: () => navigate(-1)
  })

  const handleSubmit = () => {
    !!searchParams.get('labs_id')
      ? update({
          id: searchParams.get('labs_id'),
          name: title,
          description: content
        })
      : create({
          name: title,
          description: content
        })
  }

  return (
    <>
      <Box sx={{ p: '1.88rem' }}>
        <Typography
          typography={'h3'}
          style={{
            textAlign: 'center',
            verticalAlign: 'middle',
            marginTop: '1.88rem',
            marginBottom: '1.88rem'
          }}
        >
          Edit-Labs
          {/* <Translations text='Edit' /> - <Translations text='Translation' /> */}
        </Typography>
        <form
          style={{
            borderRadius: '1rem',
            padding: '2rem',
            backgroundColor: '#fff'
          }}
        >
          <Grid container spacing={'1.8rem'}>
            <Grid item xs={12} md={6}>
              <ToggleButtonGroup
                color='primary'
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label='Language'
                fullWidth
              >
                <ToggleButton value='uz'>UZ</ToggleButton>
                <ToggleButton value='ru'>RU</ToggleButton>
                <ToggleButton value='en'>EN</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>
                {/* <Translations text='Submit' /> */}
                Submit
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                size='small'
                value={title[alignment] || ''}
                onChange={e => setTitle({ ...title, [alignment]: e.target.value })}
                multiline
                fullWidth
                required
                id='form-props-required'
                label={'Title'}
              />
            </Grid>
            <Grid item xs={12}>
              <MyEditor value={content[alignment] || ''} setValue={el => setContent({ ...content, [alignment]: el })} />
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}

export default LabsForm
