import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  TextareaAutosize,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import styles from './index.module.scss'
import { top100Films } from '../../../../components/multiple-select'
import MyEditor from '../../../../components/editor'
import OutlinedButton from '../../../../components/outlined-button'
import { useMutation, useQuery } from 'react-query'
import { GET_USERS } from '../../../users/queries'
import { request } from '../../../../utils/request'
import toast from 'react-hot-toast'

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
  const [forAll, setForAll] = useState(true)
  const [user, setUser] = useState<any>(null)
  console.log(search, 'search')

  const { data } = useQuery(['users', search], () => GET_USERS({ search: search }))
  const { mutate, isLoading } = useMutation(REPLY_FEEDBACK, {
    onSuccess: () => {
      setMessage('')
      setUser([])
      setForAll(true)
      toast.success('Xabar ruborildi!')
    }
  })
  return (
    <Box className={styles.container}>
      <Grid container xs={12} spacing={'1.88rem'}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={forAll}
                onChange={e => {
                  if (!!e.target.checked) {
                    setForAll(e.target.checked)
                    setUser([])
                  } else {
                    setForAll(e.target.checked)
                  }
                }}
                defaultChecked
              />
            }
            label='Hammaga'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            freeSolo
            inputValue={search}
            onInputChange={(_, e) => setSearch(e)}
            value={user || []}
            onChange={(_, val) => {
              if (val.length) {
                setUser(val)
                setForAll(false)
              } else {
                setUser(val)
                setForAll(true)
              }
            }}
            disablePortal
            id='combo-box-demo'
            size='small'
            fullWidth
            getOptionLabel={(option: any) => option.firstname + ' ' + option.lastname}
            options={data?.data || []}
            //@ts-ignore
            renderInput={params => <TextField {...params} label='Users' />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Описание</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize
            value={message}
            onChange={e => setMessage(e.target.value)}
            minRows={9}
            style={{
              width: '100%'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <OutlinedButton
            onClick={() => {
              if (!!message && !isLoading) {
                mutate({
                  user_ids: user?.map((e: any) => Number(e.id)) || [],
                  message: message,
                  type: 'message'
                })
              }
            }}
            title='Yuborish'
            isActive
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default MessagesTo
