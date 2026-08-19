import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import MyEditor from '../../components/editor'
import FileUploaderSingle from '../../components/file-uploader/FileUploaderSingle'
import { GET_QUESTION } from '../question/queries'
import { CREATE_QUESTION, UPDATE_QUESTION } from '../question/mutatuions'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

const emptyAnswer = () => ({ name: { ...EMPTY }, description: { ...EMPTY }, photos: [''], status: false, link: '' })
const toBool = (s: any) => s === true || s === 'true' || s === 1 || s === '1'

interface IProps {
  questionId: string // 'new' yoki id
  folderId: number
  onCreated: (id: number) => void
  onDone: () => void
}

function QuestionEditor(props: IProps) {
  const queryClient = useQueryClient()
  const isNew = props.questionId === 'new'
  const [lang, setLang] = useState<Lang>('uz')

  const [name, setName] = useState<any>({ ...EMPTY })
  const [image, setImage] = useState<any>({ photo: '', info: '' })
  const [addInfo, setAddInfo] = useState<any>({ ...EMPTY })
  const [answers, setAnswers] = useState<any[]>([emptyAnswer()])

  const { data: qRes, isLoading } = useQuery(['qbank-question', props.questionId], () => GET_QUESTION(props.questionId), {
    enabled: !isNew
  })

  useEffect(() => {
    const d = qRes?.data
    if (!isNew && d) {
      setName({ ...EMPTY, ...(d.name || {}) })
      setImage({ photo: d?.photo?.photo || '', info: d?.photo?.info || '' })
      setAddInfo({ ...EMPTY, ...(d.additional_info || {}) })
      const ans = Array.isArray(d.answers) && d.answers.length ? d.answers : [emptyAnswer()]
      setAnswers(
        ans.map((a: any) => ({
          name: { ...EMPTY, ...(a.name || {}) },
          description: { ...EMPTY, ...(a.description || {}) },
          photos: Array.isArray(a.photos) && a.photos.length ? a.photos : [''],
          status: toBool(a.status),
          link: a.link || ''
        }))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, qRes])

  const { mutate: create, isLoading: creating } = useMutation(CREATE_QUESTION, {
    onSuccess: (res: any) => {
      toast.success('Savol saqlandi')
      queryClient.invalidateQueries(['qbank-contents'])
      const id = res?.data?.id
      if (id) props.onCreated(id)
      else props.onDone()
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_QUESTION, {
    onSuccess: () => {
      toast.success('Savol yangilandi')
      queryClient.invalidateQueries(['qbank-contents'])
      queryClient.invalidateQueries(['qbank-question', props.questionId])
    }
  })

  const setAns = (i: number, patch: any) => setAnswers(prev => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)))

  const save = () => {
    if (!Object.values(name).some(v => (v as string).trim())) {
      toast.error('Savol matnini kiriting')
      return
    }
    const validAnswers = answers.filter(a => Object.values(a.name).some((v: any) => (v as string).trim()))
    if (!validAnswers.length) {
      toast.error('Kamida bitta javob kiriting')
      return
    }
    if (!validAnswers.some(a => a.status)) {
      toast.error("Kamida bitta to'g'ri javobni belgilang")
      return
    }
    const payload: any = {
      name,
      photo: image,
      additional_info: addInfo,
      folder_ids: [props.folderId],
      answers: validAnswers
    }
    if (isNew) create(payload)
    else update({ id: qRes?.data?.id, ...payload })
  }

  if (!isNew && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: '52rem' }}>
      <Typography variant='h5' sx={{ fontWeight: 800, mb: 0.3 }}>
        {isNew ? 'Yangi savol' : 'Savolni tahrirlash'}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Savol matni, rasm, javoblar va qo`shimcha ma`lumot.
      </Typography>

      {/* Til (savol, javob, qo'shimcha — hammasi shu til) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <ToggleButtonGroup size='small' exclusive color='primary' value={lang} onChange={(_, v) => v && setLang(v)}>
          <ToggleButton value='uz'>UZ</ToggleButton>
          <ToggleButton value='ru'>RU</ToggleButton>
          <ToggleButton value='en'>EN</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Savol matni */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)', mb: 2 }}>
        <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
          Savol matni ({lang.toUpperCase()})
        </Typography>
        <MyEditor key={'q-' + lang} value={name[lang] || ''} setValue={(e: string) => setName({ ...name, [lang]: e })} />
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant='caption' color='text.secondary'>
              Rasm
            </Typography>
            <FileUploaderSingle type='questions' images={image.photo} setImage={(el: string) => setImage({ ...image, photo: el })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='caption' color='text.secondary'>
              Qo`shimcha rasm
            </Typography>
            <FileUploaderSingle type='questions' images={image.info} setImage={(el: string) => setImage({ ...image, info: el })} />
          </Grid>
        </Grid>
      </Paper>

      {/* Javoblar */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            Javoblar <Box component='span' sx={{ color: 'text.disabled' }}>{answers.length}</Box>
          </Typography>
          <Button size='small' startIcon={<AddIcon />} onClick={() => setAnswers(prev => [...prev, emptyAnswer()])}>
            Javob
          </Button>
        </Box>
        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1.5 }}>
          To`g`ri javob(lar)ni belgilang.
        </Typography>

        {answers.map((a, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 1.2,
              mb: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: a.status ? 'success.light' : 'rgba(18,27,45,.10)',
              bgcolor: a.status ? 'rgba(77,175,0,.05)' : 'transparent'
            }}
          >
            <FormControlLabel
              sx={{ m: 0, mt: 0.5 }}
              control={
                <Checkbox
                  size='small'
                  checked={a.status}
                  icon={<CheckCircleIcon sx={{ color: 'rgba(18,27,45,.2)' }} />}
                  checkedIcon={<CheckCircleIcon color='success' />}
                  onChange={e => setAns(i, { status: e.target.checked })}
                />
              }
              label=''
            />
            <Box sx={{ flex: 1 }}>
              <TextField
                size='small'
                fullWidth
                label={`Javob (${lang.toUpperCase()})`}
                value={a.name[lang] || ''}
                onChange={e => setAns(i, { name: { ...a.name, [lang]: e.target.value } })}
              />
              <TextField
                size='small'
                fullWidth
                label='Izoh (ixtiyoriy)'
                value={a.description[lang] || ''}
                onChange={e => setAns(i, { description: { ...a.description, [lang]: e.target.value } })}
                sx={{ mt: 1 }}
              />
            </Box>
            <IconButton
              size='small'
              color='error'
              sx={{ mt: 0.5 }}
              disabled={answers.length <= 1}
              onClick={() => setAnswers(prev => prev.filter((_, idx) => idx !== i))}
            >
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          </Box>
        ))}
      </Paper>

      {/* Qo'shimcha ma'lumot */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)', mb: 2 }}>
        <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
          Qo`shimcha ma`lumot ({lang.toUpperCase()}) — ixtiyoriy
        </Typography>
        <MyEditor key={'ai-' + lang} value={addInfo[lang] || ''} setValue={(e: string) => setAddInfo({ ...addInfo, [lang]: e })} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant='contained' disabled={creating || updating} onClick={save}>
          {creating || updating ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
        <Button variant='text' onClick={props.onDone}>
          Orqaga
        </Button>
      </Box>
    </Box>
  )
}

export default QuestionEditor
