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
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ImageIcon from '@mui/icons-material/Image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { GET_ARTICLE } from '../articles/queries'
import { CREATE_ARTICLES, UPDATE_ARTICLES } from '../articles/mutatuions'
import { CREATE_CHAPTER } from '../chapter/mutatuions'
import { GET_CATEGORIES } from '../category/queries'
import MyEditor from '../../components/editor'
import ChapterCard from './ChapterCard'
import NoteImagePicker, { PickKind } from './NoteImagePicker'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

interface IProps {
  articleId: string // 'new' yoki id
  defaultCategoryId?: number | null
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

  // Yangi maqola uchun birinchi bo'lim (matn) — maqola bilan birga saqlanadi
  const [firstTitle, setFirstTitle] = useState<any>({ ...EMPTY })
  const [firstContent, setFirstContent] = useState<any>({ ...EMPTY })
  const [picker, setPicker] = useState<PickKind | null>(null)
  const insertRef = useRef<((c: string) => void) | null>(null)

  const { data: allCats } = useQuery(['content-all-cats'], () => GET_CATEGORIES({ perPage: 1000 }))
  const catList: any[] = allCats?.data || []

  const { data: articleRes, isLoading } = useQuery(['content-article', props.articleId], () => GET_ARTICLE(props.articleId), {
    enabled: !isNew
  })
  const article = articleRes?.data

  useEffect(() => {
    if (isNew) {
      const def = catList.find(c => c.id === props.defaultCategoryId)
      setCategories(def ? [def] : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, props.defaultCategoryId, catList.length])

  useEffect(() => {
    if (!isNew && article) {
      setName({ ...EMPTY, ...(article.name || {}) })
      setPaid(!!article.paid)
      setSort(String(article.sort ?? '0'))
      setCategories(Array.isArray(article.category_ids) ? article.category_ids : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, article])

  const chapters: any[] = useMemo(() => (Array.isArray(article?.chapters) ? article.chapters : []), [article])

  const refetchArticle = () => {
    queryClient.invalidateQueries(['content-article', props.articleId])
    setNewChapters([])
  }

  const buildPayload = () => {
    const catIds = categories.map(c => c.id)
    let sorts = String(sort)
      .split(',')
      .map(s => Number(s.trim()) || 0)
    while (sorts.length < catIds.length) sorts.push(0)
    sorts = sorts.slice(0, catIds.length)
    const qids = questions
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    return {
      name,
      category_ids: catIds,
      sort: sorts,
      paid: Number(paid),
      blocks: qids.length ? [{ name, question_ids: qids, sort: 1 }] : []
    }
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_ARTICLES, {
    onSuccess: async (res: any) => {
      const id = res?.data?.id
      // Birinchi bo'lim matni kiritilgan bo'lsa — maqola bilan birga yaratamiz
      const hasTitle = Object.values(firstTitle).some(v => (v as string).trim())
      const hasContent = Object.values(firstContent).some(v => (v as string).trim())
      if (id && (hasTitle || hasContent)) {
        try {
          await CREATE_CHAPTER({
            title: hasTitle ? firstTitle : name, // sarlavha bo'sh bo'lsa maqola nomi
            description: firstContent,
            article_ids: [id],
            sort: [0]
          })
        } catch {
          /* xato toast'i request.ts da chiqadi */
        }
      }
      toast.success('Maqola saqlandi')
      if (id) props.onCreated(id)
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_ARTICLES, {
    onSuccess: () => {
      toast.success('Maqola yangilandi')
      refetchArticle()
    }
  })

  const validate = () => {
    if (!Object.values(name).some(v => (v as string).trim())) {
      toast.error('Maqola nomini kiriting')
      return false
    }
    if (!categories.length) {
      toast.error('Kamida bitta kategoriya tanlang')
      return false
    }
    return true
  }

  const saveNew = () => {
    if (!validate()) return
    create(buildPayload())
  }
  const saveExisting = () => {
    if (!validate()) return
    update({ id: article.id, ...buildPayload() })
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
        {isNew ? 'Nom va matnni kiriting — bitta «Saqlash» bilan yaratiladi.' : 'Maqola ma`lumoti va bo`limlar (matn).'}
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
            <FormControlLabel control={<Switch checked={paid} onChange={e => setPaid(e.target.checked)} />} label='Premium' />
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
          {!isNew && (
            <Grid item xs={12}>
              <Button variant='contained' disabled={updating} onClick={saveExisting}>
                {updating ? 'Saqlanmoqda...' : 'Maqolani saqlash'}
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {isNew ? (
        /* ── Yangi maqola: birinchi bo'lim (matn) + bitta Saqlash ── */
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
            <Typography variant='subtitle2' color='text.secondary'>
              Matn (birinchi bo`lim) — ixtiyoriy
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button size='small' startIcon={<NoteAddIcon />} onClick={() => setPicker('note')}>
                Eslatma
              </Button>
              <Button size='small' startIcon={<ImageIcon />} onClick={() => setPicker('image')}>
                Rasm
              </Button>
            </Box>
          </Box>
          <TextField
            size='small'
            fullWidth
            label={`Bo'lim sarlavhasi (${lang.toUpperCase()})`}
            value={firstTitle[lang] || ''}
            onChange={e => setFirstTitle({ ...firstTitle, [lang]: e.target.value })}
            sx={{ mb: 1.5 }}
          />
          <MyEditor
            key={lang}
            value={firstContent[lang] || ''}
            setValue={(e: string) => setFirstContent({ ...firstContent, [lang]: e })}
            insertRef={insertRef}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant='contained' size='large' disabled={creating} onClick={saveNew}>
              {creating ? 'Saqlanmoqda...' : 'Maqolani saqlash'}
            </Button>
          </Box>

          <NoteImagePicker
            open={!!picker}
            kind={picker || 'note'}
            onClose={() => setPicker(null)}
            onPick={token => {
              if (insertRef.current) insertRef.current(token)
              else setFirstContent({ ...firstContent, [lang]: (firstContent[lang] || '') + ' ' + token + ' ' })
            }}
          />
        </Paper>
      ) : (
        /* ── Mavjud maqola: bo'limlar ro'yxati ── */
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant='subtitle2' color='text.secondary'>
              Bo`limlar (matn){' '}
              <Box component='span' sx={{ color: 'text.disabled' }}>
                {chapters.length + newChapters.length}
              </Box>
            </Typography>
            <Button size='small' variant='contained' startIcon={<AddIcon />} onClick={() => setNewChapters(prev => [...prev, Date.now()])}>
              Bo`lim
            </Button>
          </Box>

          {chapters.map((ch: any) => (
            <ChapterCard key={ch.id} articleId={article.id} chapter={ch} onSaved={refetchArticle} onRemoved={refetchArticle} />
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
              Bo`lim yo`q — «Bo`lim» tugmasi bilan matn qo`shing
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  )
}

export default ArticleEditor
