import { Box, FormControl, Grid, Input, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React from 'react'
import styles from './index.module.scss'
import TextInput from '../../../../components/input'
import OutlinedButton from '../../../../components/outlined-button'
import { useTranslation } from 'react-i18next'
import CustomCheckbox from '../../../../components/checkbox'
import Translations from '../../../../components/translations'
import Form from '../../../../components/form/Form'
import { GET_USER } from '../../queries'
import { CREATE_USER, UPDATE_USER } from '../../mutatuions'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import { Controller } from 'react-hook-form'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'

const initialValues = {
  firstname: '',
  lastname: '',
  phone: 0,
  email: '',
  gender: '',
  profession: '',
  graduation_year: 0,
  place_of_study: '',
  interests: '',
  birthday: '',
  address: '',
  image: null,
  role: '',
  status: true,
  images: {}
}

function UserForm() {
  const { t } = useTranslation()
  return (
    <Form
      getQuery={GET_USER}
      updateMutation={UPDATE_USER}
      createMutation={CREATE_USER}
      name='User'
      pageName='Users'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues }) => {
        return (
          <Box className={styles.container}>
            <Box className={styles.title}>
              <Translations text='Edit' /> - <Translations text='User' />
            </Box>
            <Grid container xs={12} spacing={'1.88rem'} sx={{ mb: '1.88rem' }}>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  size='small'
                  fullWidth
                  variant='outlined'
                  {...register('firstname')}
                  label={t('Name')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Last Name')}
                  {...register('lastname')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Phone')}
                  {...register('phone')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Email')}
                  {...register('email')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  loading={false}
                  name='gender'
                  data={['male', 'female']}
                  getOption={(value: any) => value}
                  //   onchange={setValue}
                  setValue={setValue}
                  value={getInfo?.data?.data?.profession}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  loading={false}
                  name='profession'
                  data={['student', 'teacher']}
                  getOption={(value: any) => value}
                  //   onchange={setValue}
                  setValue={setValue}
                  value={getInfo?.data?.data?.profession}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Graduation year')}
                  {...register('graduation_year')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Place of study')}
                  {...register('place_of_study')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Interests')}
                  {...register('interests')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  type='date'
                  fullWidth
                  label={t('Birthday')}
                  {...register('birthday')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Address')}
                  {...register('address')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  variant='outlined'
                  size='small'
                  fullWidth
                  label={t('Role')}
                  {...register('role')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUploaderSingle />
                {/* <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id='outlined-basic'
                  {...register('image')}
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='file'
                  label={t('Image')}
                  onChange={(event: any) => setValue('image', event.target.files[0])}
                /> */}
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomCheckbox
                  value={getValues}
                  defaultValue={getInfo?.data?.data?.paid}
                  setValue={setValue}
                  name='paid'
                  label='Paid'
                />
              </Grid>
            </Grid>
            <OutlinedButton title='Saqlash' isActive onClick={handleSubmit((data: any) => handleFinish(data))} />
          </Box>
        )
      }}
    </Form>
  )
}

export default UserForm
