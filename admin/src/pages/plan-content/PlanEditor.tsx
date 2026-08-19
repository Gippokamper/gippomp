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
import { GET_STUDY_PLAN } from '../study-plan/queries'
import { CREATE_STUDY_PLAN, UPDATE_STUDY_PLAN } from '../study-plan/mutatuions'
import { GET_ARTICLES } from '../articles/queries'
import { GET_FOLDERS, GET_IDS } from '../question-folder/queries'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }
const strip = (h: any) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

interface IProps {
  planId: string // 'new' yoki id
  defaultParentId?: number | null
  onCreated: (id: number) => void
  onDone: () => void
}

function PlanEditor(props: IProps) {
  const { i18n } = useTranslation()
  const lng = i18n.language
  const queryClient = useQueryClient()
  const isNew = props.planId === 'new'

  const [lang, setLang] = useState<Lang>('uz')
  const [name, setName] = useState<any>({ ...EMPTY })
  const [info, setInfo] = useState<any>({ ...EMPTY })
  const [articles, setArticles] = useState<any[]>([]) // bog'langan maqolalar
  const [artSearch, setArtSearch] = useState('')
  const [packages, setPackages] = useState<any[]>([]) // QBank paketlari
  const [existingCount, setExistingCount] = useState(0)
  const [saving, setSaving] = useState(false)

  const { data: artData } = useQuery(['plan-articles', artSearch], () => GET_ARTICLES({ perPage: 30, search: artSearch }), {
    keepPreviousData: true
  })
  const artOptions: any[] = artData?.data || []

  const { data: folderData } = useQuery(['qbank-folders'], () => GET_FOLDERS({ without_child: 1, perPage: 1000 }))
  const folderOptions: any[] = folderData?.data || []

  const { data: planRes, isLoading } = useQuery(['plan-one', props.planId], () => GET_STUDY_PLAN(props.planId), { enabled: !isNew })
  const plan = planRes?.data

  useEffect(() => {
    if (!isNew && plan) {
      setName({ ...EMPTY, ...(plan.name || {}) })
      setInfo({ ...EMPTY, ...(plan.info || {}) })
      setArticles(Array.isArray(plan.article_ids) ? plan.article_ids : [])
      const blocks = Array.isArray(plan.blocks) ? plan.blocks : []
      setExistingCount(blocks.reduce((acc: number, b: any) => acc + (b?.questions?.length || 0), 0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, plan])

  const parentIds = useMemo(() => {
    if (isNew) return props.defaultParentId ? [props.defaultParentId] : null
    const ids = (plan?.plan_ids || []).map((p: any) => p.id)
    return ids.length ? ids : null
  }, [isNew, plan, props.defaultParentId])

  const { mutate: update, isLoading: updating } = useMutation(UPDATE_STUDY_PLAN, {
    onSuccess: () => {
      toast.success('Reja yangilandi')
      queryClient.invalidateQueries(['plan-full'])
      queryClient.invalidateQueries(['plan-one', props.planId])
    }
  })

  const buildBlocks = async () => {
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
      toast.error('Reja nomini kiriting')
      return
    }
    setSaving(true)
    try {
      const blocks = await buildBlocks()
      const artIds = articles.map(a => a.id)
      const qids = parentIds
      const payload: any = {
        name,
        info,
        sort: [0],
        plan_ids: qids,
        plan_sort: qids ? qids.map(() => 0) : null,
        article_ids: artIds,
        article_sort: artIds.map(() => 0),
        blocks
      }
      if (isNew) {
        const res: any = await CREATE_STUDY_PLAN(payload)
        const id = res?.data?.id
        toast.success('Reja yaratildi')
        queryClient.invalidateQueries(['plan-full'])
        if (id) props.onCreated(id)
        else props.onDone()
      } else {
        update({ id: plan.id, ...payload })
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
        {isNew ? 'Yangi o`quv reja' : name.uz || 'O`quv reja'}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Nom, ma`lumot, maqolalar va savol to`plamlari.
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            O`quv reja
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
              label={`Nomi (${lang.toUpperCase()})`}
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
            {/* Maqolalar — Kontentдan tanlanadi (nomi bo'yicha qidirib) */}
            <Autocomplete
              multiple
              size='small'
              options={artOptions}
              value={articles}
              onChange={(_, v) => setArticles(v as any[])}
              onInputChange={(_, v) => setArtSearch(v)}
              filterOptions={x => x}
              isOptionEqualToValue={(o: any, v: any) => o?.id === v?.id}
              getOptionLabel={(o: any) => strip(o?.name?.[lng] || o?.name?.uz) || `#${o?.id}`}
              renderOption={(liProps, o: any) => (
                <li {...liProps} key={o.id}>
                  {strip(o?.name?.[lng] || o?.name?.uz) || `#${o.id}`}
                </li>
              )}
              renderInput={params => <TextField {...params} label='Maqolalar' placeholder='Nomi bo`yicha qidiring...' />}
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

export default PlanEditor
