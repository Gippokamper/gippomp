import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { GET_CATEGORY } from '../category/queries'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '../category/mutatuions'

interface IProps {
  open: boolean
  onClose: () => void
  // Tahrirlash uchun kategoriya id; yangi bo'lsa undefined
  editId?: number | null
  // Yangi kategoriya qaysi ota ichida yaratiladi (root bo'lsa null)
  parentId?: number | null
  onSaved: () => void
}

const EMPTY = { uz: '', ru: '', en: '' }

// Kategoriya yaratish/tahrirlash. Payload hozirgi ishlaydigan CategoryForm bilan
// bir xil — backend qoidalariga tegmaymiz.
function CategoryDrawer(props: IProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [name, setName] = useState({ ...EMPTY })
  const [sort, setSort] = useState('0')
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (!props.open) return
    if (props.editId) {
      GET_CATEGORY(String(props.editId)).then((res: any) => {
        const d = res?.data
        setName({ ...EMPTY, ...(d?.name || {}) })
        // Ota bo'lsa category_sort, bo'lmasa sort
        const s = d?.category_ids?.length ? d?.category_sort : d?.sort
        setSort(String(s ?? 0))
        setPaid(!!d?.paid)
      })
    } else {
      setName({ ...EMPTY })
      setSort('0')
      setPaid(false)
    }
  }, [props.open, props.editId])

  const done = () => {
    queryClient.invalidateQueries(['content-root'])
    queryClient.invalidateQueries(['content-category'])
    props.onSaved()
    props.onClose()
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_CATEGORY, {
    onSuccess: () => {
      toast.success(t('Created'))
      done()
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_CATEGORY, {
    onSuccess: () => {
      toast.success(t('Updated'))
      done()
    }
  })

  const save = () => {
    if (!Object.values(name).some(v => v.trim())) {
      toast.error('Kategoriya nomini kiriting')
      return
    }
    const sortNum = Number(String(sort).trim()) || 0
    const parent = props.parentId ?? null

    // Ota ichida bo'lsa: category_ids=[parent], category_sort=[sort], sort=[]
    // Root bo'lsa: category_ids=null, sort=[sort], category_sort=[]
    const payload: any = {
      name,
      category_ids: parent ? [parent] : null,
      ...(parent ? { category_sort: [sortNum], sort: [] } : { sort: [sortNum], category_sort: [] }),
      paid: Number(paid)
    }
    if (props.editId) update({ id: props.editId, ...payload })
    else create(payload)
  }

  return (
    <Drawer
      anchor='right'
      open={props.open}
      onClose={props.onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '26rem' }, maxWidth: '100%' } }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            {props.editId ? 'Kategoriyani tahrirlash' : props.parentId ? 'Kichik kategoriya' : 'Yangi kategoriya'}
          </Typography>
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              size='small'
              fullWidth
              label='Nomi (O`zbekcha)'
              value={name.uz}
              onChange={e => setName({ ...name, uz: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size='small'
              fullWidth
              label='Ruscha'
              value={name.ru}
              onChange={e => setName({ ...name, ru: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size='small'
              fullWidth
              label='Inglizcha'
              value={name.en}
              onChange={e => setName({ ...name, en: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size='small'
              fullWidth
              type='number'
              label='Tartib'
              value={sort}
              onChange={e => setSort(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch checked={paid} onChange={e => setPaid(e.target.checked)} />}
              label='Premium'
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' fullWidth disabled={creating || updating} onClick={save}>
              {creating || updating ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  )
}

export default CategoryDrawer
