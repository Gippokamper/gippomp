import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { GET_VIDEO } from '../videos/queries'
import { CREATE_VIDEOS, UPDATE_VIDEOS } from '../videos/mutatuions'
import { GET_VIDEO_CATEGORIES } from '../video-category/queries'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

// YouTube havolasidan video ID ni ajratib, oldindan ko'rish uchun
const ytId = (url: string): string | null => {
  const m = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : null
}

interface IProps {
  videoId: string // 'new' yoki id
  defaultCategoryId?: number | null
  onCreated: (id: number) => void
  onDone: () => void
}

function VideoEditor(props: IProps) {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const queryClient = useQueryClient()
  const isNew = props.videoId === 'new'

  const [lang, setLang] = useState<Lang>('uz')
  const [name, setName] = useState<any>({ ...EMPTY })
  const [link, setLink] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  const { data: allCats } = useQuery(['vc-all-cats'], () => GET_VIDEO_CATEGORIES({ perPage: 1000 }))
  const catList: any[] = allCats?.data || []

  const { data: videoRes, isLoading } = useQuery(['vc-video', props.videoId], () => GET_VIDEO(props.videoId), {
    enabled: !isNew
  })
  const video = videoRes?.data

  useEffect(() => {
    if (isNew) {
      const def = catList.find(c => c.id === props.defaultCategoryId)
      setCategories(def ? [def] : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, props.defaultCategoryId, catList.length])

  useEffect(() => {
    if (!isNew && video) {
      setName({ ...EMPTY, ...(video.name || {}) })
      setLink(video.link || '')
      setCategories(Array.isArray(video.category_ids) ? video.category_ids : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, video])

  const buildPayload = () => {
    const catIds = categories.map(c => c.id)
    const sorts = catIds.map(() => 0) // tartib avtomatik
    return { name, link: link.trim(), category_ids: catIds, sort: sorts }
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_VIDEOS, {
    onSuccess: (res: any) => {
      toast.success('Video saqlandi')
      const id = res?.data?.id
      queryClient.invalidateQueries(['vc-detail'])
      if (id) props.onCreated(id)
      else props.onDone()
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_VIDEOS, {
    onSuccess: () => {
      toast.success('Video yangilandi')
      queryClient.invalidateQueries(['vc-detail'])
      queryClient.invalidateQueries(['vc-video', props.videoId])
    }
  })

  const validate = () => {
    if (!Object.values(name).some(v => (v as string).trim())) {
      toast.error('Video nomini kiriting')
      return false
    }
    if (!link.trim()) {
      toast.error('Video havolasini kiriting')
      return false
    }
    if (!categories.length) {
      toast.error('Kamida bitta kategoriya tanlang')
      return false
    }
    return true
  }

  const save = () => {
    if (!validate()) return
    if (isNew) create(buildPayload())
    else update({ id: video.id, ...buildPayload() })
  }

  if (!isNew && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  const vid = ytId(link)

  return (
    <Box sx={{ maxWidth: '48rem' }}>
      <Typography variant='h5' sx={{ fontWeight: 800, mb: 0.3 }}>
        {isNew ? 'Yangi video' : name.uz || 'Video'}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Nom, YouTube havolasi va kategoriya.
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            Video
          </Typography>
          <ToggleButtonGroup size='small' exclusive color='primary' value={lang} onChange={(_, v) => v && setLang(v)}>
            <ToggleButton value='uz'>UZ</ToggleButton>
            <ToggleButton value='ru'>RU</ToggleButton>
            <ToggleButton value='en'>EN</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              size='small'
              fullWidth
              label={`Video nomi (${lang.toUpperCase()})`}
              value={name[lang] || ''}
              onChange={e => setName({ ...name, [lang]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size='small'
              fullWidth
              label='YouTube havolasi'
              placeholder='https://youtube.com/watch?v=...'
              value={link}
              onChange={e => setLink(e.target.value)}
            />
          </Grid>
          {vid && (
            <Grid item xs={12}>
              <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(18,27,45,.08)' }}>
                <Box
                  component='iframe'
                  src={`https://www.youtube.com/embed/${vid}`}
                  title='preview'
                  allowFullScreen
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              size='small'
              options={catList}
              value={categories}
              onChange={(_, v) => setCategories(v as any[])}
              isOptionEqualToValue={(o: any, v: any) => o?.id === v?.id}
              getOptionLabel={(o: any) => o?.name?.[lng] || o?.name?.uz || `#${o?.id}`}
              renderInput={params => <TextField {...params} label='Kategoriyalar' />}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button variant='contained' disabled={creating || updating} onClick={save}>
                {creating || updating ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
              <Button variant='text' onClick={props.onDone}>
                Orqaga
              </Button>
              {!isNew && link && (
                <Link href={link} target='_blank' rel='noreferrer' sx={{ ml: 'auto' }} variant='body2'>
                  Havolani ochish
                </Link>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default VideoEditor
