import { Box, IconButton, TextField } from '@mui/material'
import { Send } from '@mui/icons-material'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { request } from '../../../../utils/request'
import toast from 'react-hot-toast'

export const REPLY_FEEDBACK = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/feedback/' + data?.id,
    method: 'POST',
    data: { message: data?.message }
  })
  return response.data
}

interface IProps {
  id: number
  refresh: () => void
}

function MessageComponent(props: IProps) {
  const [message, setMessage] = useState('')
  const { mutate, isLoading } = useMutation(REPLY_FEEDBACK, {
    onSuccess: () => {
      setMessage('')
      props.refresh()
      toast.success('Yuborildi!')
    }
  })

  const send = () => {
    if (!message.trim() || isLoading) return
    mutate({ id: props.id, message: message.trim() })
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', py: 1 }}>
      <TextField
        size='small'
        multiline
        maxRows={4}
        fullWidth
        placeholder='Javob...'
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => {
          // Enter — yuborish, Shift+Enter — yangi qator.
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
      />
      {/* Bo'sh xabar yuborilganda tugma jimgina hech nima qilmasdi. */}
      <IconButton color='primary' disabled={!message.trim() || isLoading} onClick={send}>
        <Send />
      </IconButton>
    </Box>
  )
}

export default MessageComponent
