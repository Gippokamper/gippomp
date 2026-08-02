import { Box, IconButton, TextareaAutosize } from '@mui/material'
import { Send } from '@mui/icons-material'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { request } from '../../../../utils/request'
import toast from 'react-hot-toast'

export const REPLY_FEEDBACK = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/feedback/' + data?.id,
    method: 'POST',
    data: data
  })
  return response.data
}

interface IProps {
  id: number
  refresh: () => void
}

function MessageComponent(props: IProps) {
  const [message, setMessage] = useState('')
  const { mutate } = useMutation(REPLY_FEEDBACK, {
    onSuccess: () => {
      setMessage('')
      props.refresh()
      toast.success('Yuborildi!')
    }
  })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <TextareaAutosize
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{
          height: '100%'
        }}
        required
        id='form-props-required'
      />
      <IconButton
        onClick={() => {
          if (!!message) {
            mutate({
              id: props.id,
              message: message
            })
          }
        }}
      >
        <Send />
      </IconButton>
    </Box>
  )
}

export default MessageComponent
