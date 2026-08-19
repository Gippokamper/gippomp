import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { GET_ARTICLE } from '../articles/queries'
import { CREATE_ARTICLES, UPDATE_ARTICLES } from '../articles/mutatuions'
import { GET_CATEGORIES } from '../category/queries'
import ChapterCard from './ChapterCard'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

interface IProps {
  // 'new' yoki maqola id
  articleId: string
  // yangi maqola qaysi kategoriya ichida yaratiladi
  defaultCategoryId?: number | null
  // maqola yaratilgach edit rejimiga o'tish uchun
  onCreated: (id: number) => void
}

function ArticleEditor(props: IProps) {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const queryClient = useQueryClient()
  const isNew = props.articleId === 'new'

  const [lang, setLang] = useState<Lang>('uz')
  const [name, setName] = useState<any>({ ...EMPTY })
  const [categories, setCategories] = useState<any[]>([])
  const [sort, setSort] = useState('0')
  const [paid, setPaid] = useState(false)
  const [questions, setQuestions] = useState('')
  const [newChapters, setNewChapters] = useState<number[]>([])

  const { data: allCats } = useQuery(['content-all-cats'], () => GET_CATEGORIES({ perPage: 1000 }))
  const catList: any[] = allCats?.data || []

  const { data: articleRes, isLoading } = useQuery(
    ['content-article', props.articleId],
    () => GET_ARTICLE(props.articleId),
    { enabled: !isNew }
  )
  const article = articleRes?.data

  // Yangi maqola — kontekstdagi kategoriyani oldindan tanlaymiz
  useEffect(() => {
    if (isNew) {
      setName({ ...EMPTY })
      setSort('0')
      setPaid(false)
      setQuestions('')
      const def = catList.find(c => c.id === props.defaultCategoryId)
      setCategories(def ? [def] : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, props.defaultCategoryId, catList.length])

  // Mavjud maqolani yuklaymiz
  useEffect(() => {
    if (!isNew && article) {
      setName({ ...EMPTY, ...(article.name || {}) })
      setPaid(!!article.paid)
      setSort(String(article.sort ?? '0'))
      setCategories(Array.isArray(article.category_ids) ? article.category_ids : [])
      setQuestions('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, article])

  const chapters: any[] = useMemo(() => (Array.isArray(article?.chapters) ? article.chapters : []), [article])

  const refetchArticle = () => {
    queryClient.invalidateQueries(['content-article', props.articleId])
    setNewChapters([])
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_ARTICLES, {
    onSuccess: (res: any) => {
      const id = res?.data?.id
      toast.success('Maqola yaratildi')
      if (id) props.onCreated(id)
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_ARTICLES, {
    onSuccess: () => {
      toast.success('Maqola yangilandi')
      refetchArticle()
    }
  })

  const saveArticle = () => {
    if (!Object.values(name).some(v => (v as string).trim())) {
      toast.error('Maqola nomini kiriting')
      return
    }
    if (!categories.length) {
      toast.error('Kamida bitta kategoriya tanlang')
      return
    }
    const catIds = categories.map(c => c.id)
    // sort — kategoriyalar soniga mos massiv
    let sorts = String(sort)
      .split(',')
      .map(s => Number(s.trim()) || 0)
    while (sorts.length < catIds.length) sorts.push(0)
    sorts = sorts.slice(0, catIds.length)

    const qids = questions
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const payload: any = {
      name,
      category_ids: catIds,
      sort: sorts,
      paid: Number(paid),
      blocks: qids.length ? [{ name, question_ids: qids, sort: 1 }] : []
    }
    if (isNew) create(payload)
    else update({ id: article.id, ...payload })
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
        {isNew ? 'Yangi maqola' : name.uz || 'Maqola'}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Maqola ma`lumoti va bo`limlar (matn) — shu ekranda.
      </Typography>

      {/* ── Maqola meta ── */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            Maqola
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
              label={`Maqola nomi (${lang.toUpperCase()})`}
              value={name[lang] || ''}
              onChange={e => setName({ ...name, [lang]: e.target.value })}
            />
          </Grid>
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
          <Grid item xs={6} md={4}>
            <TextField
              size='small'
              fullWidth
              label='Tartib'
              helperText='Kategoriyalar soniga mos, vergul bilan'
              value={sort}
              onChange={e => setSort(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch checked={paid} onChange={e => setPaid(e.target.checked)} />}
              label='Premium'
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size='small'
              fullWidth
              label='Savol ID lari'
              helperText='Ixtiyoriy, vergul bilan'
              value={questions}
              onChange={e => setQuestions(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' disabled={creating || updating} onClick={saveArticle}>
              {creating || updating ? 'Saqlanmoqda...' : isNew ? 'Maqolani yaratish' : 'Maqolani saqlash'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ── Bo'limlar ── */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            Bo`limlar (matn){' '}
            <Box component='span' sx={{ color: 'text.disabled' }}>
              {chapters.length + newChapters.length}
            </Box>
          </Typography>
          <Button
            size='small'
            variant='contained'
            startIcon={<AddIcon />}
            disabled={isNew}
            onClick={() => setNewChapters(prev => [...prev, Date.now()])}
          >
            Bo`lim
          </Button>
        </Box>

        {isNew ? (
          <Typography variant='body2' color='text.secondary' sx={{ py: 2, textAlign: 'center' }}>
            Avval maqolani saqlang — keyin bo`lim (matn) qo`shasiz.
          </Typography>
        ) : (
          <>
            {chapters.map((ch: any) => (
              <ChapterCard
                key={ch.id}
                articleId={article.id}
                chapter={ch}
                onSaved={refetchArticle}
                onRemoved={refetchArticle}
              />
            ))}
            {newChapters.map(key => (
              <ChapterCard
                key={key}
                articleId={article.id}
                defaultOpen
                onSaved={refetchArticle}
                onRemoved={() => setNewChapters(prev => prev.filter(k => k !== key))}
              />
            ))}
            {!chapters.length && !newChapters.length && (
              <Typography variant='body2' color='text.secondary' sx={{ py: 2, textAlign: 'center' }}>
                Bo`lim yo`q — «Bo`lim» tugmasi bilan matn qo`shing (ixtiyoriy)
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  )
}

export default ArticleEditor
