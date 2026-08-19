import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { GET_STUDY_PLAN as GET_QUIZ } from '../quizzes/queries'
import { CREATE_STUDY_PLAN as CREATE_QUIZ, UPDATE_STUDY_PLAN as UPDATE_QUIZ } from '../quizzes/mutatuions'
import { GET_FOLDERS, GET_IDS } from '../question-folder/queries'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

interface IProps {
  quizId: string // 'new' yoki id
  defaultParentId?: number | null
  onCreated: (id: number) => void
  onDone: () => void
}

function QuizEditor(props: IProps) {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const queryClient = useQueryClient()
  const isNew = props.quizId === 'new'

  const [lang, setLang] = useState<Lang>('uz')
  const [name, setName] = useState<any>({ ...EMPTY })
  const [info, setInfo] = useState<any>({ ...EMPTY })
  const [packages, setPackages] = useState<any[]>([]) // QBank paketlari (papkalar)
  const [existingCount, setExistingCount] = useState(0)
  const [saving, setSaving] = useState(false)

  const { data: folderData } = useQuery(['qbank-folders'], () => GET_FOLDERS({ without_child: 1, perPage: 1000 }))
  const folderOptions: any[] = folderData?.data || []

  const { data: quizRes, isLoading } = useQuery(['quiz-one', props.quizId], () => GET_QUIZ(props.quizId), { enabled: !isNew })
  const quiz = quizRes?.data

  useEffect(() => {
    if (!isNew && quiz) {
      setName({ ...EMPTY, ...(quiz.name || {}) })
      setInfo({ ...EMPTY, ...(quiz.info || {}) })
      const blocks = Array.isArray(quiz.blocks) ? quiz.blocks : []
      const total = blocks.reduce((acc: number, b: any) => acc + (b?.questions?.length || 0), 0)
      setExistingCount(total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, quiz])

  const parentIds = useMemo(() => {
    if (isNew) return props.defaultParentId ? [props.defaultParentId] : null
    const ids = (quiz?.quiz_ids || []).map((q: any) => q.id)
    return ids.length ? ids : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, quiz, props.defaultParentId])

  const { mutate: update, isLoading: updating } = useMutation(UPDATE_QUIZ, {
    onSuccess: () => {
      toast.success('Test yangilandi')
      queryClient.invalidateQueries(['quiz-tests'])
      queryClient.invalidateQueries(['quiz-one', props.quizId])
    }
  })

  const buildBlocks = async () => {
    // Paket tanlangan bo'lsa — har paket bitta blok (savollari bilan). Aks holda
    // bo'sh: backend update bo'sh bloklarni e'tiborsiz qoldiradi (eskisi saqlanadi).
    if (!packages.length) return []
    const blocks: any[] = []
    for (let i = 0; i < packages.length; i++) {
      const f = packages[i]
      let ids: number[] = []
      try {
        const res: any = await GET_IDS(String(f.slug), { type: 'child' })
        ids = (res?.data?.questions_string || []).map((x: any) => Number(x)).filter((n: number) => !isNaN(n))
      } catch {
        ids = []
      }
      blocks.push({ name: f.name, question_ids: ids, sort: i })
    }
    return blocks
  }

  const save = async () => {
    if (!Object.values(name).some(v => (v as string).trim())) {
      toast.error('Test nomini kiriting')
      return
    }
    setSaving(true)
    try {
      const blocks = await buildBlocks()
      const qids = parentIds
      const payload: any = {
        name,
        info,
        sort: [0],
        quiz_ids: qids,
        quiz_sort: qids ? qids.map(() => 0) : null,
        blocks
      }
      if (isNew) {
        const res: any = await CREATE_QUIZ(payload)
        const id = res?.data?.id
        toast.success('Test yaratildi')
        queryClient.invalidateQueries(['quiz-tests'])
        if (id) props.onCreated(id)
        else props.onDone()
      } else {
        update({ id: quiz.id, ...payload })
      }
    } catch (e: any) {
      if (e?.message) toast.error(String(e.message))
    } finally {
      setSaving(false)
    }
  }

  if (!isNew && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: '48rem' }}>
      <Typography variant='h5' sx={{ fontWeight: 800, mb: 0.3 }}>
        {isNew ? 'Yangi test' : name.uz || 'Test'}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Nom, ma`lumot va savol to`plami (QBank).
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            Test
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
              label={`Test nomi (${lang.toUpperCase()})`}
              value={name[lang] || ''}
              onChange={e => setName({ ...name, [lang]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size='small'
              fullWidth
              multiline
              minRows={2}
              label={`Ma'lumot (${lang.toUpperCase()})`}
              value={info[lang] || ''}
              onChange={e => setInfo({ ...info, [lang]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              size='small'
              options={folderOptions}
              value={packages}
              onChange={(_, v) => setPackages(v as any[])}
              isOptionEqualToValue={(o: any, v: any) => o?.id === v?.id}
              getOptionLabel={(o: any) => o?.name?.[lng] || o?.name?.uz || `#${o?.id}`}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Savol to`plamlari (QBank)'
                  placeholder='Paket tanlang...'
                  helperText={
                    !isNew && !packages.length && existingCount
                      ? `Hozir biriktirilgan: ${existingCount} ta savol. Yangi paket tanlasangiz — almashadi.`
                      : 'Har paket — bitta savol bloki'
                  }
                />
              )}
            />
          </Grid>
          {!!packages.length && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {packages.map((p, i) => (
                  <Chip key={p.id} size='small' label={`${i + 1}. ${p?.name?.[lng] || p?.name?.uz}`} />
                ))}
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant='contained' disabled={saving || updating} onClick={save}>
                {saving || updating ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
              <Button variant='text' onClick={props.onDone}>
                Orqaga
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default QuizEditor
