import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ImageIcon from '@mui/icons-material/Image'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { GET_ARTICLE } from '../articles/queries'
import { CREATE_ARTICLES, UPDATE_ARTICLES } from '../articles/mutatuions'
import { CREATE_CHAPTER } from '../chapter/mutatuions'
import { GET_CATEGORIES } from '../category/queries'
import { GET_FOLDERS, GET_IDS } from '../question-folder/queries'
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
  const [paid, setPaid] = useState(false)
  // QBank — bitta paket (savol papkasi) biriktiriladi
  const [pkg, setPkg] = useState<any | null>(null)
  const [existingQids, setExistingQids] = useState<number[]>([])
  const [existingQCount, setExistingQCount] = useState(0)
  const [newChapters, setNewChapters] = useState<number[]>([])

  // Yangi maqola uchun birinchi bo'lim (matn)
  const [firstTitle, setFirstTitle] = useState<any>({ ...EMPTY })
  const [firstContent, setFirstContent] = useState<any>({ ...EMPTY })
  const [firstPaid, setFirstPaid] = useState(false)
  const [picker, setPicker] = useState<PickKind | null>(null)
  const insertRef = useRef<((c: string) => void) | null>(null)

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
      setPaid(!!article.paid)
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

  const { mutate: create, isLoading: creating } = useMutation(CREATE_ARTICLES, {
    onSuccess: async (res: any) => {
      const id = res?.data?.id
      const hasTitle = Object.values(firstTitle).some(v => (v as string).trim())
      const hasContent = Object.values(firstContent).some(v => (v as string).trim())
      if (id && (hasTitle || hasContent)) {
        try {
          await CREATE_CHAPTER({
            title: hasTitle ? firstTitle : name,
            description: firstContent,
            paid: Number(firstPaid),
            article_ids: [id],
            sort: [0]
          })
        } catch {
          /* xato toast'i request.ts da */
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

  const buildPayload = async () => {
    const catIds = categories.map(c => c.id)
    const sorts = catIds.map(() => 0) // tartib avtomatik
    const qids = await resolveQuestionIds()
    return {
      name,
      category_ids: catIds,
      sort: sorts,
      paid: Number(paid),
      blocks: qids.length ? [{ name, question_ids: qids, sort: 1 }] : []
    }
  }

  const [saving, setSaving] = useState(false)
  const saveNew = async () => {
    if (!validate()) return
    setSaving(true)
    create(await buildPayload(), { onSettled: () => setSaving(false) })
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
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch checked={paid} onChange={e => setPaid(e.target.checked)} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Butun maqola Premium
              <Tooltip title='Yoqilsa — butun maqola faqat tarif to`laganlarga. Bir qismini pullik qilish uchun — pastda alohida bo`limga Premium qo`ying.'>
                <HelpOutlineIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
              </Tooltip>
            </Box>
          }
        />
      </Grid>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1, flexWrap: 'wrap' }}>
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
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            sx={{ mb: 1 }}
            control={<Switch size='small' checked={firstPaid} onChange={e => setFirstPaid(e.target.checked)} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '.9rem' }}>
                Bu bo`lim Premium
                <Tooltip title='Odatda birinchi bo`lim bepul qoladi. Keyingi bo`limlarni pullik qilishingiz mumkin.'>
                  <HelpOutlineIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
                </Tooltip>
              </Box>
            }
          />
          <MyEditor
            key={lang}
            value={firstContent[lang] || ''}
            setValue={(e: string) => setFirstContent({ ...firstContent, [lang]: e })}
            insertRef={insertRef}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant='contained' size='large' disabled={creating || saving} onClick={saveNew}>
              {creating || saving ? 'Saqlanmoqda...' : 'Maqolani saqlash'}
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
          <Typography variant='caption' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            Har bir bo`limni alohida Premium qilish mumkin — bir qismi bepul, bir qismi pullik.{' '}
            <Chip size='small' color='warning' label='Premium' sx={{ height: 18, fontSize: '.65rem' }} />
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
