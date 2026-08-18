import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'
import MyEditor from '../../../../components/editor'
import dayjs, { Dayjs } from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { GET_NEW } from '../../queries'
import { INews } from '../../data/data'
import { CREATE_NEW, UPDATE_NEW } from '../../mutatuions'

function NewsForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [images, setImages] = useState({
    photo: ''
  })

  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))
  const [checked, setChecked] = React.useState(true)

  const handleChangeActual = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

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
    // Faol tugma qayta bosilganda newAlignment null bo'ladi —
    // tekshiruvsiz til null bo'lib, maydonlar bo'shab qolardi.
    //@ts-ignore
    newAlignment && setAlignment(newAlignment)
  }

  const { refetch } = useQuery(
    ['newsss', searchParams.get('news_id')],
    () => GET_NEW(String(searchParams.get('news_id'))),
    {
      enabled: false,
      onSuccess: (data: { data: INews }) => {
        setTitle(data?.data?.title)
        setContent(data?.data?.description)
        setImages({
          photo: data?.data?.photo
        })
        // Sana va "actual" bayrog'i yuklanmasdi: mavjud yangilikni tahrirlaganda
        // sana har safar "hozir"ga, belgi esa "true"ga tushib ketardi.
        if (data?.data?.date) setDate(dayjs(data.data.date))
        setChecked(!!data?.data?.actual)
      }
    }
  )

  useEffect(() => {
    if (searchParams.get('news_id')) {
      refetch()
    }
    //eslint-disable-next-line
  }, [searchParams.get('news_id')])
  const { mutate: create, isLoading: isCreating } = useMutation(CREATE_NEW, {
    onSuccess: () => navigate(-1)
  })
  const { mutate: update, isLoading: isUpdating } = useMutation(UPDATE_NEW, {
    onSuccess: () => navigate(-1)
  })
  const isSaving = isCreating || isUpdating

  const handleSubmit = () => {
    !!searchParams.get('news_id')
      ? update({
          id: searchParams.get('news_id'),
          title: title,
          description: content,
          actual: checked,
          date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
          ...images
        })
      : create({
          title: title,
          description: content,
          actual: checked,
          date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
          ...images
        })
  }

  return (
    <>
      <Box sx={{ p: '1.88rem' }}>
        <Typography
          variant='h6'
          style={{
            textAlign: 'center',
            verticalAlign: 'middle',
            marginTop: '1.88rem',
            marginBottom: '1.88rem'
          }}
        >
          Yangilik
          {/* <Translations text='Edit' /> - <Translations text='Translation' /> */}
        </Typography>
        <form
          style={{
            borderRadius: '1rem',
            padding: '2rem',
            backgroundColor: '#fff'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FileUploaderSingle
                type='news'
                images={images.photo}
                setImage={(el: string) => setImages({ ...images, photo: el })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                  <DateTimePicker label='Date' value={date} onChange={newValue => setDate(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
              <FormControlLabel
                sx={{
                  mt: '1.8rem'
                }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChangeActual}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label='Actual'
                labelPlacement='start'
              />
            </Grid>

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
              <Button variant='contained' color='success' fullWidth disabled={isSaving} onClick={handleSubmit}>
                {/* <Translations text='Submit' /> */}
                Saqlash
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

export default NewsForm
