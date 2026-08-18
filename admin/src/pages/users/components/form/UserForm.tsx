import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller } from 'react-hook-form'
import Form from '../../../../components/form/Form'
import { GET_USER } from '../../queries'
import { CREATE_USER, UPDATE_USER } from '../../mutatuions'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'
import DefaultValue from '../../../../components/defaultvalue/DefaultValue'

// Maydonlar backend'dagi UserEditRequest bilan mos: qabul qilinmaydigan
// maydonlar (place_of_study, address, paid, role) olib tashlandi — ular
// hech qachon saqlanmasdi, lekin admin saqlandi deb o'ylardi.
const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  gender: '',
  profession: '',
  graduation_year: '',
  interests: '',
  birthday: '',
  province: ''
}

const GENDERS = ['male', 'female']
const PROFESSIONS = ['student', 'doctor', 'teacher']

// Bo'sh maydonlar yuborilmaydi: Laravel qoidalarida `min:2` bor va bo'sh satr
// butun so'rovni 400 bilan qaytarardi.
const stripEmpty = (values: Record<string, any>) =>
  Object.fromEntries(Object.entries(values).filter(([, value]) => value !== '' && value !== null && value !== undefined))

function UserForm() {
  const { t } = useTranslation()
  const [image, setImage] = useState('')

  return (
    <Form
      getQuery={GET_USER}
      updateMutation={UPDATE_USER}
      createMutation={CREATE_USER}
      name='User'
      pageName='Users'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, register, handleSubmit, control, isSubmitting }) => {
        const user = getInfo?.data?.data

        return (
          <Box sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
              {[user?.firstname, user?.lastname].filter(Boolean).join(' ') || t('User')}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              {user?.phone ? `+${user.phone}` : ''}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DefaultValue defaultValue={user?.image} setDefaultValue={setImage}>
                  <FileUploaderSingle images={image} setImage={setImage} type='users' />
                </DefaultValue>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  label={t('Name')}
                  {...register('firstname')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  label={t('Last Name')}
                  {...register('lastname')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  type='email'
                  label={t('Email')}
                  {...register('email')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Telefon raqamini backend tahrirlashga ruxsat bermaydi. */}
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  disabled
                  label={t('Phone')}
                  value={user?.phone ?? ''}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      select
                      size='small'
                      fullWidth
                      label={t('Gender')}
                      InputLabelProps={{ shrink: true }}
                    >
                      <MenuItem value=''>—</MenuItem>
                      {GENDERS.map(item => (
                        <MenuItem key={item} value={item}>
                          {t(item)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='profession'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      select
                      size='small'
                      fullWidth
                      label={t('Profession')}
                      InputLabelProps={{ shrink: true }}
                    >
                      <MenuItem value=''>—</MenuItem>
                      {/* "doctor" ro'yxatda yo'q edi, backend esa uni qo'llaydi */}
                      {PROFESSIONS.map(item => (
                        <MenuItem key={item} value={item}>
                          {t(item)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  type='number'
                  label={t('Graduation year')}
                  {...register('graduation_year')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  type='date'
                  fullWidth
                  label={t('Birthday')}
                  {...register('birthday')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  label={t('Province')}
                  {...register('province')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  fullWidth
                  label={t('Interests')}
                  {...register('interests')}
                />
              </Grid>
            </Grid>

            <Button
              sx={{ mt: 3 }}
              variant='contained'
              disabled={isSubmitting}
              onClick={handleSubmit((values: any) =>
                handleFinish(
                  stripEmpty({
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    gender: values.gender,
                    profession: values.profession,
                    graduation_year: values.graduation_year,
                    interests: values.interests,
                    birthday: values.birthday,
                    province: values.province,
                    image
                  })
                )
              )}
            >
              {t('Save')}
            </Button>
          </Box>
        )
      }}
    </Form>
  )
}

export default UserForm
