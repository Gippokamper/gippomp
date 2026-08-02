import { Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FileUploaderSingle from '../../../components/file-uploader/FileUploaderSingle'
import MyEditor from '../../../components/editor'
import MainLayout from '../../../layouts/main'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { IImage } from '../data/data'
import { CREATE_IMAGE, UPDATE_IMAGE } from '../mutatuions'
import { GET_IMAGE } from '../queries'

function ImagesForm(props: any) {
  const [imageLoader, setImageLoader] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [images, setImages] = useState({
    photo: '',
    marker_photo: ''
  })

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

  const clearForm = () => {
    setImages({
      photo: '',
      marker_photo: ''
    })
    setTitle({
      uz: '',
      ru: '',
      en: ''
    })
    setContent({
      uz: '',
      ru: '',
      en: ''
    })
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    setAlignment(newAlignment)
  }

  const { refetch } = useQuery(['comment', searchParams.get('id')], () => GET_IMAGE(String(searchParams.get('id'))), {
    enabled: false,
    onSuccess: (data: { data: IImage }) => {
      setTitle(data?.data?.title)
      setContent(data?.data?.description)
      setImages({
        photo: data?.data?.photo,
        marker_photo: data?.data?.marker_photo
      })
    }
  })

  useEffect(() => {
    if (searchParams.get('id')) {
      refetch()
    } else {
      clearForm()
    }
    //eslint-disable-next-line
  }, [searchParams.get('id')])
  const { mutate: create, isLoading: crateLoading } = useMutation(CREATE_IMAGE, {
    onSuccess: (data: any) => {
      clearForm()

      props.refetch()
      navigator.clipboard.writeText('/dashboard/user/article_note_photos/' + String(data?.data?.id))
    }
  })
  const { mutate: update, isLoading: updateLoading } = useMutation(UPDATE_IMAGE, {
    onSuccess: (data: any) => {
      clearForm()

      props.refetch()
      navigator.clipboard.writeText('/dashboard/user/article_note_photos/' + String(data?.data?.id))
    }
  })

  const handleSubmit = () => {
    !!searchParams.get('id')
      ? update({
          id: searchParams.get('id'),
          title: title,
          description: content,
          ...images
        })
      : create({
          title: title,
          description: content,
          ...images
        })
  }

  return (
    <Box sx={{ pl: '1.88rem' }}>
      {/* <Typography
        typography={'h3'}
        style={{
          textAlign: 'center',
          verticalAlign: 'middle',
          marginTop: '1.88rem',
          marginBottom: '1.88rem'
        }}
      >
        Edit-Category
      </Typography> */}
      <form
        style={{
          borderRadius: '1rem',
          padding: '2rem',
          backgroundColor: '#fff'
        }}
      >
        <Grid container xs={12} spacing={'0.5rem'} wrap='wrap'>
          <Grid item xs={6}>
            <FileUploaderSingle
              type='images'
              setLoading={setImageLoader}
              images={images.photo}
              setImage={(el: string) => setImages({ ...images, photo: el })}
            />
          </Grid>
          <Grid item xs={6}>
            <FileUploaderSingle
              type='images'
              setLoading={setImageLoader}
              images={images.marker_photo}
              setImage={(el: string) => setImages({ ...images, marker_photo: el })}
            />
          </Grid>
          <Grid item xs={6}>
            <ToggleButtonGroup
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
          <Grid item xs={6}>
            <Button
              disabled={imageLoader || crateLoading || updateLoading}
              variant='contained'
              color='success'
              fullWidth
              onClick={handleSubmit}
            >
              {/* <Translations text='Submit' /> */}
              {imageLoader || crateLoading || updateLoading ? 'Loading' : 'Submit'}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              size='small'
              value={title?.[alignment] || ''}
              onChange={e => setTitle({ ...title, [alignment]: e.target.value })}
              multiline
              fullWidth
              required
              id='form-props-required'
              label={'Title'}
            />
          </Grid>
          <Grid item xs={12}>
            <MyEditor value={content?.[alignment] || ''} setValue={el => setContent({ ...content, [alignment]: el })} />
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default ImagesForm
