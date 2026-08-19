import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
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
import { CREATE_CHAPTER } from '../chapter/mutatuions'
import { GET_CATEGORIES } from '../category/queries'
import { GET_FOLDERS, GET_IDS } from '../question-folder/queries'
import ChapterCard from './ChapterCard'
import NewSectionCard from './NewSectionCard'

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
  // QBank — bitta paket (savol papkasi) biriktiriladi
  const [pkg, setPkg] = useState<any | null>(null)
  const [existingQids, setExistingQids] = useState<number[]>([])
  const [existingQCount, setExistingQCount] = useState(0)
  const [newChapters, setNewChapters] = useState<number[]>([])

  // Yangi maqola bo'limlari — hammasi birga tayyorlanadi, bitta «Publish» bilan
  // maqola + barcha bo'limlar yaratiladi.
  const [sections, setSections] = useState<any[]>([{ title: { ...EMPTY }, content: { ...EMPTY } }])
  const [publishing, setPublishing] = useState(false)

  const { data: allCats } = useQuery(['content-all-cats'], () => GET_CATEGORIES({ perPage: 1000 }))
  const catList: any[] = allCats?.data || []

  // QBank paketlari — savollari bor (leaf) papkalar
  const { data: folderData } = useQuery(['qbank-folders'], () => GET_FOLDERS({ without_child: 1, perPage: 1000 }))
  const folderOptions: any[] = folderData?.data || []

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
      setCategories(Array.isArray(article.category_ids) ? article.category_ids : [])
      // Maqolaga allaqachon biriktirilgan savollar (bloklardan) — saqlab qolamiz
      const qs = article?.blocks?.[0]?.questions
      const ids = Array.isArray(qs) ? qs.map((q: any) => q.id) : []
      setExistingQids(ids)
      setExistingQCount(ids.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, article])

  const chapters: any[] = useMemo(() => (Array.isArray(article?.chapters) ? article.chapters : []), [article])

  const refetchArticle = () => {
    queryClient.invalidateQueries(['content-article', props.articleId])
    setNewChapters([])
  }

  // Test paketining savol ID larini aniqlaymiz: yangi paket tanlangan bo'lsa —
  // o'shaniki; aks holda avval biriktirilganini saqlaymiz (tahrirlashда o'chib
  // ketmasligi uchun — backend update blocklarni qayta yozadi).
  const resolveQuestionIds = async (): Promise<number[]> => {
    if (pkg?.slug) {
      try {
        const res: any = await GET_IDS(String(pkg.slug), { type: 'child' })
        const ids = res?.data?.questions_string || []
        return ids.map((x: any) => Number(x)).filter((n: number) => !isNaN(n))
      } catch {
        return existingQids
      }
    }
    return existingQids
  }

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

  const buildPayload = async () => {
    const catIds = categories.map(c => c.id)
    const sorts = catIds.map(() => 0) // tartib avtomatik
    const qids = await resolveQuestionIds()
    return {
      name,
      category_ids: catIds,
      sort: sorts,
      // Maqola o'zi hech qachon premium emas — premium faqat matn ichidagi
      // «Premium» belgisi (<u>). Backend `paid` ni majburiy so'raydi, 0 beramiz.
      paid: 0,
      blocks: qids.length ? [{ name, question_ids: qids, sort: 1 }] : []
    }
  }

  const [saving, setSaving] = useState(false)

  // Yangi maqolani bo'limlari bilan birga chop etish: maqola yaratiladi, so'ng
  // har bir bo'lim ketma-ket (tartib bo'yicha) shu maqolaga ulanadi.
  const publish = async () => {
    if (!validate()) return
    setPublishing(true)
    try {
      const payload = await buildPayload()
      const res: any = await CREATE_ARTICLES(payload)
      const id = res?.data?.id
      if (!id) throw new Error('Maqola yaratilmadi')
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        const hasTitle = Object.values(sec.title).some((v: any) => (v as string).trim())
        const hasContent = Object.values(sec.content).some((v: any) => (v as string).trim())
        if (hasTitle || hasContent) {
          await CREATE_CHAPTER({
            title: hasTitle ? sec.title : name,
            description: sec.content,
            article_ids: [id],
            sort: [i]
          })
        }
      }
      toast.success('Maqola chop etildi')
      queryClient.invalidateQueries(['content-category'])
      props.onCreated(id)
    } catch (e: any) {
      if (e?.message) toast.error(String(e.message))
    } finally {
      setPublishing(false)
    }
  }

  const saveExisting = async () => {
    if (!validate()) return
    setSaving(true)
    update({ id: article.id, ...(await buildPayload()) }, { onSettled: () => setSaving(false) })
  }

  if (!isNew && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  const metaFields = (
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
      <Grid item xs={12}>
        {/* QBank — bitta paket (savol papkasi). Nomi bo'yicha tanlanadi. */}
        <Autocomplete
          size='small'
          options={folderOptions}
          value={pkg}
          onChange={(_, v) => setPkg(v)}
          isOptionEqualToValue={(o: any, v: any) => o?.id === v?.id}
          getOptionLabel={(o: any) => o?.name?.[lng] || o?.name?.uz || `#${o?.id}`}
          renderInput={params => (
            <TextField
              {...params}
              label='Test to`plami (QBank) — ixtiyoriy'
              placeholder='Savol paketini tanlang...'
              helperText={
                !isNew && !pkg && existingQCount
                  ? `Hozir biriktirilgan: ${existingQCount} ta savol. Yangi paket tanlasangiz — almashadi.`
                  : 'Bitta savol paketi biriktiriladi'
              }
            />
          )}
        />
      </Grid>
      {/* Maqola o'zi premium bo'lmaydi. Pullik qilinadigan qism — matn ichida
          «Premium» tugmasi bilan belgilanadigan ma'lumot. */}
    </Grid>
  )

  return (
    <Box sx={{ maxWidth: '52rem' }}>
      <Typography variant='h5' sx={{ fontWeight: 800, mb: 0.3 }}>
        {isNew ? 'Yangi maqola' : name.uz || 'Maqola'}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        {isNew ? 'Nom va matnni kiriting — bitta «Saqlash» bilan yaratiladi.' : 'Maqola ma`lumoti va bo`limlar (matn).'}
      </Typography>

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
        {metaFields}
        {!isNew && (
          <Box sx={{ mt: 2 }}>
            <Button variant='contained' disabled={updating || saving} onClick={saveExisting}>
              {updating || saving ? 'Saqlanmoqda...' : 'Maqolani saqlash'}
            </Button>
          </Box>
        )}
      </Paper>

      {isNew ? (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant='subtitle2' color='text.secondary'>
              Bo`limlar (matn){' '}
              <Box component='span' sx={{ color: 'text.disabled' }}>
                {sections.length}
              </Box>
            </Typography>
            <Button
              size='small'
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => setSections(prev => [...prev, { title: { ...EMPTY }, content: { ...EMPTY } }])}
            >
              Bo`lim
            </Button>
          </Box>
          <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1.5 }}>
            Maqolani bo`limlarga bo`ling (Umumiy ma`lumot, Ta`rif, Etiologiya...). Bitta «Chop etish» bilan hammasi
            yaratiladi. Pullik qism — matnda «Premium» tugmasi bilan belgilanadi.
          </Typography>

          {sections.map((sec, i) => (
            <NewSectionCard
              key={i}
              index={i}
              lang={lang}
              title={sec.title}
              content={sec.content}
              onTitle={(v: any) => setSections(prev => prev.map((s, idx) => (idx === i ? { ...s, title: v } : s)))}
              onContent={(v: any) => setSections(prev => prev.map((s, idx) => (idx === i ? { ...s, content: v } : s)))}
              onRemove={() => setSections(prev => prev.filter((_, idx) => idx !== i))}
              canRemove={sections.length > 1}
            />
          ))}

          <Box sx={{ mt: 2 }}>
            <Button variant='contained' size='large' disabled={publishing} onClick={publish}>
              {publishing ? 'Chop etilmoqda...' : 'Chop etish'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
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
          <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1.5 }}>
            Matnning bir qismini pullik qilish uchun — o`sha matnni belgilab, muharrirdagi «Premium» tugmasini bosing.
          </Typography>

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
