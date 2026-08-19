import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ImageIcon from '@mui/icons-material/Image'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LockIcon from '@mui/icons-material/Lock'
import { useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import MyEditor from '../../components/editor'
import { CREATE_CHAPTER, UPDATE_CHAPTER, DELETE_CHAPTER } from '../chapter/mutatuions'
import { GET_CHAPTER } from '../chapter/queries'
import NoteImagePicker, { PickKind } from './NoteImagePicker'

type Lang = 'uz' | 'ru' | 'en'
const EMPTY = { uz: '', ru: '', en: '' }

interface IProps {
  articleId: number
  // Mavjud bo'lim (backend'dan) yoki null — yangi
  chapter?: any
  defaultOpen?: boolean
  onSaved: () => void
  onRemoved: () => void
}

function ChapterCard(props: IProps) {
  const existing = props.chapter
  const [open, setOpen] = useState(!!props.defaultOpen)
  const [lang, setLang] = useState<Lang>('uz')
  const [title, setTitle] = useState<any>({ ...EMPTY, ...(existing?.title || {}) })
  const [content, setContent] = useState<any>({ ...EMPTY, ...(existing?.description || {}) })
  const [paid, setPaid] = useState<boolean>(!!existing?.paid)
  const [picker, setPicker] = useState<PickKind | null>(null)
  const insertRef = useRef<((c: string) => void) | null>(null)

  const heading = title.uz || title.ru || title.en || 'Yangi bo`lim'

  // Bo'lim bir nechta maqolaga tegishli bo'lishi mumkin. Article show so'rovi
  // bo'limning boshqa maqolalarini yuklamaydi — shuning uchun yangilashdan oldin
  // GET_CHAPTER bilan aniq ulanishlarni olamiz, aks holda ular uzilib qolardi.
  const buildArticleIds = async () => {
    let list: any[] = existing?.article_ids
    let sortStr: string = existing?.sort
    if (!Array.isArray(list) || list.length === 0) {
      try {
        const res: any = await GET_CHAPTER(String(existing.id))
        list = res?.data?.article_ids || []
        sortStr = res?.data?.sort ?? sortStr
      } catch {
        list = []
      }
    }
    const ids: number[] = (list || []).map((a: any) => a.id)
    if (!ids.includes(props.articleId)) ids.push(props.articleId)
    let sorts = String(sortStr || '')
      .split(',')
      .map((s: string) => Number(s.trim()) || 0)
    while (sorts.length < ids.length) sorts.push(0)
    sorts = sorts.slice(0, ids.length)
    return { ids, sorts }
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_CHAPTER, {
    onSuccess: () => {
      toast.success('Bo`lim saqlandi')
      props.onSaved()
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_CHAPTER, {
    onSuccess: () => {
      toast.success('Bo`lim yangilandi')
      props.onSaved()
    }
  })
  const { mutate: remove } = useMutation(DELETE_CHAPTER, {
    onSuccess: () => {
      toast.success('Bo`lim o`chirildi')
      props.onRemoved()
    }
  })

  const save = async () => {
    if (!Object.values(title).some(v => (v as string).trim())) {
      toast.error('Bo`lim sarlavhasini kiriting')
      return
    }
    if (existing?.id) {
      const { ids, sorts } = await buildArticleIds()
      update({ id: existing.id, title, description: content, paid: Number(paid), article_ids: ids, sort: sorts })
    } else {
      create({ title, description: content, paid: Number(paid), article_ids: [props.articleId], sort: [0] })
    }
  }

  const del = () => {
    if (existing?.id) {
      if (window.confirm('Bo`lim o`chirilsinmi?')) remove(String(existing.id))
    } else {
      props.onRemoved()
    }
  }

  return (
    <Box sx={{ border: '1px solid rgba(18,27,45,.10)', borderRadius: 2, mb: 1.2, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          bgcolor: '#f6f8fa',
          cursor: 'pointer'
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1, fontWeight: 700, fontSize: '.93rem' }} noWrap>
          {heading}
        </Typography>
        {paid && (
          <Chip
            size='small'
            color='warning'
            icon={<LockIcon sx={{ fontSize: 14 }} />}
            label='Premium'
            sx={{ fontWeight: 700, mr: 0.5 }}
          />
        )}
        <ExpandMoreIcon
          sx={{ color: 'text.secondary', transform: open ? 'rotate(180deg)' : 'none', transition: '.15s' }}
        />
      </Box>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ p: 1.5, borderTop: '1px solid rgba(18,27,45,.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
            <ToggleButtonGroup size='small' exclusive color='primary' value={lang} onChange={(_, v) => v && setLang(v)}>
              <ToggleButton value='uz'>UZ</ToggleButton>
              <ToggleButton value='ru'>RU</ToggleButton>
              <ToggleButton value='en'>EN</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button size='small' startIcon={<NoteAddIcon />} onClick={() => setPicker('note')}>
                Eslatma
              </Button>
              <Button size='small' startIcon={<ImageIcon />} onClick={() => setPicker('image')}>
                Rasm
              </Button>
              <IconButton size='small' color='error' onClick={del}>
                <DeleteOutlineIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>

          <TextField
            size='small'
            fullWidth
            label={`Sarlavha (${lang.toUpperCase()})`}
            value={title[lang] || ''}
            onChange={e => setTitle({ ...title, [lang]: e.target.value })}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            sx={{ mb: 1 }}
            control={<Switch size='small' checked={paid} onChange={e => setPaid(e.target.checked)} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '.9rem' }}>
                Bu bo`lim Premium
                <Tooltip title='Yoqilsa — bu bo`limni faqat tarif to`lagan foydalanuvchilar ko`radi. Qolgan bo`limlar bepul ochiq qoladi.'>
                  <HelpOutlineIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
                </Tooltip>
              </Box>
            }
          />

          {/* MyEditor — shrift, fontfamily, marker shablonlari va butun panel shu yerda.
              key={lang} — til almashganda muharrir shu tilning matnini ko'rsatadi. */}
          <MyEditor
            key={lang}
            value={content[lang] || ''}
            setValue={(e: string) => setContent({ ...content, [lang]: e })}
            insertRef={insertRef}
          />

          <Box sx={{ mt: 1.5 }}>
            <Button variant='contained' disabled={creating || updating} onClick={save}>
              {creating || updating ? 'Saqlanmoqda...' : 'Bo`limni saqlash'}
            </Button>
          </Box>
        </Box>
      </Collapse>

      <NoteImagePicker
        open={!!picker}
        kind={picker || 'note'}
        onClose={() => setPicker(null)}
        onPick={token => {
          // Kursor joyiga avtomatik qo'yamiz. Muharrir ochilgan (init bo'lgan) bo'lishi kerak.
          if (insertRef.current) {
            insertRef.current(token)
          } else {
            // Muharrir hali tayyor bo'lmasa — matn oxiriga qo'shamiz.
            setContent({ ...content, [lang]: (content[lang] || '') + ' ' + token + ' ' })
          }
        }}
      />
    </Box>
  )
}

export default ChapterCard
