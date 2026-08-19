import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import MyEditor from '../../components/editor'
import { GET_CATEGORIES } from '../category/queries'
import { CREATE_CATEGORY } from '../category/mutatuions'
import { CREATE_ARTICLES } from '../articles/mutatuions'
import { CREATE_CHAPTER } from '../chapter/mutatuions'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

interface ICategory {
  id: number
  name?: Record<string, string>
}

// Uchta qadamni (kategoriya → maqola → bo'lim matni) bitta ekranga yig'adigan
// sahifa. Orqa tomonni o'zgartirmaydi: mavjud create so'rovlarini ketma-ket
// chaqiradi. Xato bo'lsa qaysi bosqichda uzilganini aniq aytadi.
function QuickArticle() {
  const { i18n } = useTranslation()
  const lng = (i18n.language as Lang) || 'uz'

  const [lang, setLang] = useState<Lang>('uz')
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [category, setCategory] = useState<ICategory | null>(null)
  const [newCatName, setNewCatName] = useState({ ...EMPTY })
  const [sort, setSort] = useState('0')
  const [premium, setPremium] = useState(false)

  const [name, setName] = useState({ ...EMPTY })
  const [title, setTitle] = useState({ ...EMPTY })
  const [content, setContent] = useState({ ...EMPTY })

  const [loading, setLoading] = useState(false)

  const { data: catData, isLoading: catLoading } = useQuery(['quick-categories'], () =>
    GET_CATEGORIES({ perPage: 1000 })
  )
  const categories: ICategory[] = catData?.data || []

  const hasName = useMemo(() => Object.values(name).some(v => v.trim()), [name])
  const hasNewCat = useMemo(() => Object.values(newCatName).some(v => v.trim()), [newCatName])
  const hasText = useMemo(() => Object.values(title).some(v => v.trim()), [title])

  const resetAll = () => {
    setCategory(null)
    setNewCatName({ ...EMPTY })
    setSort('0')
    setPremium(false)
    setName({ ...EMPTY })
    setTitle({ ...EMPTY })
    setContent({ ...EMPTY })
    setLang('uz')
  }

  const save = async () => {
    // Tekshiruvlar — backend 400 qaytarishidan oldin tushunarli xabar beramiz.
    if (mode === 'existing' && !category) {
      toast.error('Kategoriyani tanlang')
      return
    }
    if (mode === 'new' && !hasNewCat) {
      toast.error('Yangi kategoriya nomini kiriting')
      return
    }
    if (!hasName) {
      toast.error('Maqola nomini kiriting')
      return
    }

    const sortNum = Number(String(sort).trim()) || 0
    const paid = premium ? 1 : 0

    setLoading(true)
    try {
      // 1-qadam: kategoriya (kerak bo'lsa yangisini yaratamiz)
      let categoryId = category?.id
      if (mode === 'new') {
        const catRes: any = await CREATE_CATEGORY({
          name: newCatName,
          category_ids: null,
          category_sort: [],
          sort: sortNum,
          paid
        })
        categoryId = catRes?.data?.id
        if (!categoryId) throw new Error('Kategoriya yaratilmadi')
      }

      // 2-qadam: maqola
      const artRes: any = await CREATE_ARTICLES({
        name,
        category_ids: [categoryId],
        sort: [sortNum],
        paid,
        blocks: []
      })
      const articleId = artRes?.data?.id
      if (!articleId) throw new Error('Maqola yaratilmadi')

      // 3-qadam: matn (faqat kiritilgan bo'lsa) — bo'lim maqolaga ulanadi
      if (hasText) {
        await CREATE_CHAPTER({
          title,
          description: content,
          article_ids: [articleId],
          sort: [0]
        })
      }

      toast.success(hasText ? 'Maqola va matn saqlandi' : 'Maqola saqlandi')
      resetAll()
    } catch (e: any) {
      // Har bosqichning o'z toast'i request.ts da chiqadi; bu qo'shimcha.
      if (e?.message) toast.error(String(e.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: '52rem' }}>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 0.5 }}>
        Tez maqola qo'shish
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        Kategoriya, maqola va matn — hammasi bitta joyda, bitta saqlash bilan.
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(18,27,45,.08)' }}>
        {/* ── Kategoriya ── */}
        <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1.5 }}>
          1. Kategoriya
        </Typography>
        <ToggleButtonGroup
          size='small'
          exclusive
          color='primary'
          value={mode}
          onChange={(_, v) => v && setMode(v)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value='existing'>Mavjuddan tanlash</ToggleButton>
          <ToggleButton value='new'>Yangi kategoriya</ToggleButton>
        </ToggleButtonGroup>

        <Grid container spacing={2} sx={{ mb: 1 }}>
          {mode === 'existing' ? (
            <Grid item xs={12} md={8}>
              <Autocomplete
                options={categories}
                loading={catLoading}
                value={category}
                onChange={(_, v) => setCategory(v)}
                getOptionLabel={(o: ICategory) => o?.name?.[lng] || o?.name?.uz || `#${o?.id}`}
                isOptionEqualToValue={(o, v) => o?.id === v?.id}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Kategoriya'
                    size='small'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {catLoading ? <CircularProgress size={16} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  size='small'
                  fullWidth
                  label='Kategoriya (O`zbekcha)'
                  value={newCatName.uz}
                  onChange={e => setNewCatName({ ...newCatName, uz: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  size='small'
                  fullWidth
                  label='Ruscha'
                  value={newCatName.ru}
                  onChange={e => setNewCatName({ ...newCatName, ru: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  size='small'
                  fullWidth
                  label='Inglizcha'
                  value={newCatName.en}
                  onChange={e => setNewCatName({ ...newCatName, en: e.target.value })}
                />
              </Grid>
            </>
          )}
          <Grid item xs={6} md={3}>
            <TextField
              size='small'
              fullWidth
              type='number'
              label='Tartib'
              value={sort}
              onChange={e => setSort(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Checkbox checked={premium} onChange={e => setPremium(e.target.checked)} />}
              label='Premium'
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Til almashtirgich (maqola nomi + matn uchun umumiy) ── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            2. Maqola nomi va matni
          </Typography>
          <ToggleButtonGroup size='small' exclusive color='primary' value={lang} onChange={(_, v) => v && setLang(v)}>
            <ToggleButton value='uz'>UZ</ToggleButton>
            <ToggleButton value='ru'>RU</ToggleButton>
            <ToggleButton value='en'>EN</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          size='small'
          fullWidth
          label={`Maqola nomi (${lang.toUpperCase()})`}
          value={name[lang]}
          onChange={e => setName({ ...name, [lang]: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          size='small'
          fullWidth
          label={`Bo'lim sarlavhasi (${lang.toUpperCase()}) — ixtiyoriy`}
          value={title[lang]}
          onChange={e => setTitle({ ...title, [lang]: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Typography variant='caption' color='text.secondary'>
          Matn ({lang.toUpperCase()}) — ixtiyoriy
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <MyEditor value={content[lang] || ''} setValue={(e: string) => setContent({ ...content, [lang]: e })} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button variant='contained' disabled={loading} onClick={save}>
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
          <Button variant='text' disabled={loading} onClick={resetAll}>
            Tozalash
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default QuickArticle
