import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { GET_USERS } from '../../../users/queries'
import { request } from '../../../../utils/request'
import toast from 'react-hot-toast'
import Confirm from '../../../../components/confirm'

interface Idata {
  user_ids: number[]
  message: string
  type: 'message'
}

export const REPLY_FEEDBACK = async (data: Idata) => {
  const response = await request({
    url: 'dashboard/admin/feedback/',
    method: 'POST',
    data: data
  })
  return response.data
}

function MessagesTo() {
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data, isFetching } = useQuery(['users-search', search], () => GET_USERS({ search, perPage: 20 }), {
    keepPreviousData: true
  })

  const { mutate, isLoading } = useMutation(REPLY_FEEDBACK, {
    onSuccess: () => {
      setMessage('')
      setUsers([])
      setConfirmOpen(false)
      toast.success('Xabar yuborildi!')
    },
    onError: () => setConfirmOpen(false)
  })

  // Foydalanuvchi tanlanmasa backend xabarni BARCHA foydalanuvchilarga yuboradi —
  // shuning uchun bu holat alohida tasdiqlanadi.
  const forAll = users.length === 0
  const canSend = !!message.trim() && !isLoading

  const send = () => {
    if (!canSend) return
    mutate({ user_ids: users.map(user => Number(user.id)), message: message.trim(), type: 'message' })
  }

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(18,27,45,.08)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            inputValue={search}
            onInputChange={(_, value) => setSearch(value)}
            value={users}
            onChange={(_, value) => setUsers(value as any[])}
            size='small'
            fullWidth
            loading={isFetching}
            options={data?.data || []}
            isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
            getOptionLabel={(option: any) => `${option?.firstname ?? ''} ${option?.lastname ?? ''}`.trim()}
            renderInput={params => (
              <TextField
                {...params}
                label='Qabul qiluvchilar'
                placeholder={forAll ? 'Barcha foydalanuvchilar' : ''}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isFetching ? <CircularProgress size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox checked={forAll} onChange={() => setUsers([])} disabled={forAll} />}
            label='Hammaga yuborish'
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            Xabar matni
          </Typography>
          <TextField
            value={message}
            onChange={e => setMessage(e.target.value)}
            multiline
            minRows={8}
            fullWidth
            placeholder='Xabar...'
          />
        </Grid>
        <Grid item xs={12}>
          {/* Ilgari tugma bo'sh xabarda ham "bosiladigan" ko'rinardi, lekin
              hech nima qilmasdi — endi holati aniq. */}
          <Button
            variant='contained'
            startIcon={<SendIcon />}
            disabled={!canSend}
            onClick={() => (forAll ? setConfirmOpen(true) : send())}
          >
            Yuborish
          </Button>
        </Grid>
      </Grid>

      <Confirm
        isOpen={confirmOpen}
        title='Xabar BARCHA foydalanuvchilarga yuborilsinmi?'
        onCancel={() => setConfirmOpen(false)}
        onConfirm={send}
      />
    </Paper>
  )
}

export default MessagesTo
