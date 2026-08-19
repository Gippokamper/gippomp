import { Box, Button, FormControlLabel, Grid, Paper, Switch, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { GET_CATEGORY } from '../category/queries'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '../category/mutatuions'

const EMPTY = { uz: '', ru: '', en: '' }

interface IProps {
  // tahrirlash uchun kategoriya id (yangi bo'lsa yo'q)
  editId?: number | null
  // yangi kategoriya qaysi ota ichida (root bo'lsa null)
  parentId?: number | null
  // tahrirlashda qayta so'rov qilmaslik uchun tayyor ma'lumot
  initial?: { name?: any; sort?: any; paid?: any }
  onDone: () => void
  onCancel: () => void
}

// Kategoriya yaratish/tahrirlash — ro'yxat ichida (inline), alohida panel emas.
// Payload hozirgi ishlaydigan backend qoidalari bilan bir xil:
// prepareForValidation sort'ni massiv sifatida oladi va [0] ni oladi.
function InlineCategoryForm(props: IProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState<any>({ ...EMPTY, ...(props.initial?.name || {}) })
  const [sort, setSort] = useState(String(props.initial?.sort ?? '0'))
  const [paid, setPaid] = useState(!!props.initial?.paid)

  // Tahrirlash, lekin initial berilmagan bo'lsa — yuklaymiz
  useEffect(() => {
    if (props.editId && !props.initial) {
      GET_CATEGORY(String(props.editId)).then((res: any) => {
        const d = res?.data
        setName({ ...EMPTY, ...(d?.name || {}) })
        setSort(String((d?.category_ids?.length ? d?.category_sort : d?.sort) ?? 0))
        setPaid(!!d?.paid)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editId])

  const finish = () => {
    queryClient.invalidateQueries(['content-all-cats-nav'])
    queryClient.invalidateQueries(['content-category'])
    props.onDone()
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_CATEGORY, {
    onSuccess: () => {
      toast.success('Kategoriya yaratildi')
      finish()
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_CATEGORY, {
    onSuccess: () => {
      toast.success('Yangilandi')
      finish()
    }
  })

  const save = () => {
    if (!Object.values(name).some(v => (v as string).trim())) {
      toast.error('Kategoriya nomini kiriting')
      return
    }
    const sortNum = Number(String(sort).trim()) || 0
    const parent = props.parentId ?? null
    const payload: any = {
      name,
      category_ids: parent ? [parent] : null,
      ...(parent ? { category_sort: [sortNum], sort: [sortNum] } : { sort: [sortNum], category_sort: [] }),
      paid: Number(paid)
    }
    if (props.editId) update({ id: props.editId, ...payload })
    else create(payload)
  }

  return (
    <Paper
      elevation={0}
      sx={{ p: 1.5, mb: 1.5, border: '1px solid', borderColor: 'primary.main', borderRadius: 2, bgcolor: 'rgba(77,175,0,.03)' }}
    >
      <Grid container spacing={1.2} alignItems='center'>
        <Grid item xs={12} sm={4}>
          <TextField size='small' fullWidth label='Nomi (UZ)' value={name.uz} onChange={e => setName({ ...name, uz: e.target.value })} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField size='small' fullWidth label='RU' value={name.ru} onChange={e => setName({ ...name, ru: e.target.value })} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField size='small' fullWidth label='EN' value={name.en} onChange={e => setName({ ...name, en: e.target.value })} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <TextField size='small' fullWidth type='number' label='Tartib' value={sort} onChange={e => setSort(e.target.value)} />
        </Grid>
        <Grid item xs={8} sm={3}>
          <FormControlLabel control={<Switch size='small' checked={paid} onChange={e => setPaid(e.target.checked)} />} label='Premium' />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: { sm: 'flex-end' } }}>
            <Button size='small' onClick={props.onCancel}>
              Bekor
            </Button>
            <Button size='small' variant='contained' disabled={creating || updating} onClick={save}>
              {creating || updating ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default InlineCategoryForm
