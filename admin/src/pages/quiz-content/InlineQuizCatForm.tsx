import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { GET_STUDY_PLAN as GET_QUIZ } from '../quizzes/queries'
import { CREATE_STUDY_PLAN as CREATE_QUIZ, UPDATE_STUDY_PLAN as UPDATE_QUIZ } from '../quizzes/mutatuions'

const EMPTY = { uz: '', ru: '', en: '' }

interface IProps {
  editId?: number | null
  parentId?: number | null
  initial?: { name?: any }
  onDone: () => void
  onCancel: () => void
}

// Quiz kategoriyasi — bloksiz quiz (konteyner). Ro'yxat ichida (inline).
function InlineQuizCatForm(props: IProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState<any>({ ...EMPTY, ...(props.initial?.name || {}) })

  useEffect(() => {
    if (props.editId && !props.initial) {
      GET_QUIZ(String(props.editId)).then((res: any) => setName({ ...EMPTY, ...(res?.data?.name || {}) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editId])

  const finish = () => {
    queryClient.invalidateQueries(['quiz-cats'])
    queryClient.invalidateQueries(['quiz-tests'])
    props.onDone()
  }

  const { mutate: create, isLoading: creating } = useMutation(CREATE_QUIZ, {
    onSuccess: () => {
      toast.success('Kategoriya yaratildi')
      finish()
    }
  })
  const { mutate: update, isLoading: updating } = useMutation(UPDATE_QUIZ, {
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
    const parent = props.parentId ?? null
    const payload: any = {
      name,
      info: { ...EMPTY }, // kategoriyada info kerak emas (backend majburiy — bo'sh yuboriladi)
      sort: [0],
      quiz_ids: parent ? [parent] : null,
      quiz_sort: parent ? [0] : null,
      blocks: [] // bloksiz => kategoriya
    }
    if (props.editId) update({ id: props.editId, ...payload })
    else create(payload)
  }

  return (
    <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, border: '1px solid', borderColor: 'primary.main', borderRadius: 2, bgcolor: 'rgba(77,175,0,.03)' }}>
      <Grid container spacing={1.2} alignItems='center'>
        <Grid item xs={12} sm={4}>
          <TextField size='small' fullWidth label='Nomi (UZ)' value={name.uz} onChange={e => setName({ ...name, uz: e.target.value })} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField size='small' fullWidth label='RU' value={name.ru} onChange={e => setName({ ...name, ru: e.target.value })} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField size='small' fullWidth label='EN' value={name.en} onChange={e => setName({ ...name, en: e.target.value })} />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: { sm: 'flex-end' } }}>
            <Button size='small' onClick={props.onCancel}>
              Bekor
            </Button>
            <Button size='small' variant='contained' disabled={creating || updating} onClick={save}>
              {creating || updating ? '...' : 'Saqlash'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default InlineQuizCatForm
