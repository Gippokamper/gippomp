import React, { useEffect, useState } from 'react'
import MyEditor from '../../components/editor'
import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material'
import toast from 'react-hot-toast'
import { PlusOne } from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { GET_ARTICLES } from '../articles/queries'
import { GET_COMMENTS } from '../comments/queries'
import { GET_IMAGES } from '../images/queries'
import { IArticle } from '../articles/data/data'
import { IComment } from '../comments/data/data'
import { IImage } from '../images/data/data'
import { GET_CHAPTER } from './queries'
import { CREATE_CHAPTER, UPDATE_CHAPTER } from './mutatuions'
import { useTranslation } from 'react-i18next'

function Chapter() {
  const { i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [articlesId, setArticles] = useState<IArticle[]>([])
  const [sort, setSort] = useState('')
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

  const { data: articles } = useQuery(['articles'], () => GET_ARTICLES({ perPage: 10000 }), {
    onSuccess: data => {
      if (data?.data) {
        if (!articlesId?.length) {
          setArticles(
            data?.data?.filter((value: IArticle) => value?.id === Number(searchParams.get('article_id'))) || []
          )
        }
      }
    }
  })
  const { data: comments } = useQuery(['comments'], () => GET_COMMENTS({ perPage: 10000 }))
  const { data: images } = useQuery(['images'], () => GET_IMAGES({ perPage: 10000 }))

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    // Faol tugma qayta bosilganda newAlignment null bo'ladi —
    // tekshiruvsiz til null bo'lib, maydonlar bo'shab qolardi.
    //@ts-ignore
    newAlignment && setAlignment(newAlignment)
  }

  const { refetch } = useQuery(
    ['chapter', searchParams.get('chapter_id')],
    () => GET_CHAPTER(String(searchParams.get('chapter_id'))),
    {
      enabled: false,
      onSuccess: (data: { data: any }) => {
        setTitle(data?.data?.title)
        setContent(data?.data?.description)
        setSort(data?.data?.sort)
      }
    }
  )

  useEffect(() => {
    if (searchParams.get('chapter_id')) {
      refetch()
    }
    //eslint-disable-next-line
  }, [searchParams.get('chapter_id')])
  const { mutate: create } = useMutation(CREATE_CHAPTER, {
    onSuccess: () => navigate(-1)
  })
  const { mutate: update } = useMutation(UPDATE_CHAPTER, {
    onSuccess: () => navigate(-1)
  })

  const handleSubmit = () => {
    !!searchParams.get('chapter_id')
      ? update({
          id: searchParams.get('chapter_id'),
          title: title,
          description: content,
          article_ids: articlesId?.map(article => article.id),
          sort: !!sort?.trim()?.split(',')?.[0] ? sort?.trim()?.split(',') : [0]
        })
      : create({
          title: title,
          description: content,
          article_ids: articlesId?.map(article => article.id),
          sort: !!sort?.trim()?.split(',')?.[0] ? sort?.trim()?.split(',') : [0]
        })
  }

  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 2 }}>
        {searchParams.get('chapter_id') ? 'Bo`limni tahrirlash' : 'Yangi bo`lim'}
      </Typography>
      <form
        style={{
          borderRadius: '1rem',
          padding: '2rem',
          backgroundColor: '#fff'
        }}
      >
        <Grid container spacing={2} wrap='wrap'>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={articles?.data || []}
              size='small'
              fullWidth
              value={articlesId}
              //@ts-ignore
              getOptionLabel={(option: IArticle) => option.name[i18n.language]}
              onChange={(_, value: IArticle[]) => setArticles(value)}
              defaultValue={
                articles?.data?.filter((value: IArticle) => value.id === Number(searchParams.get('article_id'))) || []
              }
              filterSelectedOptions
              //@ts-ignore
              renderInput={params => <TextField {...params} label='Select Articles' placeholder='Favorites' />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              size='small'
              value={sort}
              onChange={e => setSort(e.target.value)}
              fullWidth
              required
              label={'Sort'}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'row' }}>
            <Autocomplete
              disablePortal
              size='small'
              fullWidth
              //@ts-ignore
              getOptionLabel={(option: IComment) => option.title[i18n.language]}
              options={comments?.data || []}
              onChange={(_, comment) => {
                if (!comment) return
                // Tanlangan eslatma kodini nusxalaymiz — ilgari nusxa olinganini
                // bildiruvchi hech qanday belgi yo'q edi.
                navigator.clipboard
                  ?.writeText('/dashboard/user/article_note_text/' + String((comment as any)?.id))
                  .then(() => toast.success('Eslatma kodi nusxalandi'))
                  .catch(() => toast.error('Nusxa olib bo`lmadi'))
              }}
              //@ts-ignore
              renderInput={params => <TextField {...params} label='Eslatma kodini nusxalash' />}
            />
            <Tooltip title='Yangi eslatma'>
              {/* '/comments-edit' degan route umuman yo'q edi — bo'sh oyna ochilardi. */}
              <IconButton onClick={() => window.open('/comments', '_blank', 'noopener,noreferrer')}>
                <PlusOne />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'row' }}>
            <Autocomplete
              disablePortal
              size='small'
              fullWidth
              //@ts-ignore
              getOptionLabel={(option: IImage) => option.title[i18n.language]}
              options={images?.data || []}
              onChange={(_, photo) => {
                if (!photo) return
                navigator.clipboard
                  ?.writeText('/dashboard/user/article_note_photos/' + String((photo as any)?.id))
                  .then(() => toast.success('Rasm kodi nusxalandi'))
                  .catch(() => toast.error('Nusxa olib bo`lmadi'))
              }}
              //@ts-ignore
              renderInput={params => <TextField {...params} label='Rasm kodini nusxalash' />}
            />
            <Tooltip title='Yangi rasm'>
              <IconButton onClick={() => window.open('/images', '_blank', 'noopener,noreferrer')}>
                <PlusOne />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={6}>
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

            <Button sx={{ ml: 2 }} variant='contained' onClick={() => handleSubmit()}>
              Saqlash
            </Button>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'row' }}>
            <TextField
              size='small'
              value={title[alignment] || ''}
              onChange={e => setTitle({ ...title, [alignment]: e.target.value })}
              fullWidth
              required
              label={'Title'}
            />
          </Grid>
          <Grid item xs={12}>
            <MyEditor value={content[alignment] || ''} setValue={e => setContent({ ...content, [alignment]: e })} />
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default Chapter
