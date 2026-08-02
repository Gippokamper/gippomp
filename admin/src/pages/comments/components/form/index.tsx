import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { top100Films } from '../../../../components/multiple-select'
import { PlusOne } from '@mui/icons-material'
import MyEditor from '../../../../components/editor'
import MainLayout from '../../../../layouts/main'
import { useMutation, useQuery } from 'react-query'
import { GET_COMMENT } from '../../queries'
import { CREATE_COMMENT, UPDATE_COMMENT } from '../../mutatuions'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IComment } from '../../data/data'
import { GET_IMAGES } from '../../../images/queries'
import { IImage } from '../../../images/data/data'
import { useTranslation } from 'react-i18next'
import Translations from '../../../../components/translations'

interface IProps {
  refetch: () => void
}

function CommentsForm(props: IProps) {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
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
  const clearForm = () => {
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

  const { refetch } = useQuery(['comment', searchParams.get('id')], () => GET_COMMENT(String(searchParams.get('id'))), {
    enabled: false,
    onSuccess: (data: { data: IComment }) => {
      setTitle(data?.data?.title)
      setContent(data?.data?.description)
    }
  })

  useEffect(() => {
    if (searchParams.get('id')) {
      refetch()
    } else {
      clearForm()
    }
  }, [searchParams.get('id')])

  const { data: images } = useQuery(['images'], GET_IMAGES)

  const { mutate: create } = useMutation(CREATE_COMMENT, {
    onSuccess: (data: any) => {
      props.refetch()
      navigator.clipboard.writeText('/dashboard/user/article_note_text/' + String(data?.data?.id))
      clearForm()
      setSearchParams({})
    }
  })
  const { mutate: update } = useMutation(UPDATE_COMMENT, {
    onSuccess: (data: any) => {
      props.refetch()
      navigator.clipboard.writeText('/dashboard/user/article_note_text/' + String(data?.data?.id))
      clearForm()
      setSearchParams({})
    }
  })

  const handleSubmit = () => {
    !!searchParams.get('id')
      ? update({
          id: searchParams.get('id'),
          title: title,
          description: content
        })
      : create({
          title: title,
          description: content
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
        <Translations text='Edit' /> - <Translations text='Comment' />
      </Typography> */}
      <form
        style={{
          borderRadius: '1rem',
          padding: '2rem',
          backgroundColor: '#fff'
        }}
      >
        <Grid container xs={12} spacing={'1.88rem'} wrap='wrap'>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'row' }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              size='small'
              fullWidth
              //@ts-ignore
              getOptionLabel={(option: IImage) => option.title[i18n.language]}
              options={images?.data || []}
              //@ts-ignore
              renderInput={params => <TextField {...params} label='Photos' />}
            />
            <IconButton onClick={() => window.open('/images-edit', '_blank', 'rel=noopener noreferrer')}>
              <PlusOne />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'row' }}>
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
  )
}

export default CommentsForm
