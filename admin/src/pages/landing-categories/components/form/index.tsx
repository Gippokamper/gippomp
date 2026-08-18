import { Button, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../../../../components/form/Form'
import { useSearchParams } from 'react-router-dom'
import { GET_CATEGORIES, GET_CATEGORY } from '../../queries'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '../../mutatuions'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'

function LandingCategoryForm() {
  const [searchParams] = useSearchParams()
  const [imageLoader, setImageLoader] = useState(false)
  const { i18n } = useTranslation()
  const { data, isLoading } = useQuery(['landing-categories-all'], () => GET_CATEGORIES({ perPage: 1000 }))
  return (
    <Form
      getQuery={GET_CATEGORY}
      updateMutation={UPDATE_CATEGORY}
      createMutation={CREATE_CATEGORY}
      name='LandingCategory'
      pageName='LandingCategories'
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        return (
          <div>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Landing kategoriya
            </Typography>
            <form>
              <Grid container spacing={2} p={3}>
                <Grid item sm={12}>
                  <TextField
                    size='small'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    required
                    label={'Uzbek'}
                    {...register('name[uz]')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextField
                    size='small'
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true
                    }}
                    label={'English'}
                    {...register('name[en]')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextField
                    size='small'
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true
                    }}
                    label={'Russian'}
                    {...register('name[ru]')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <CustomAutocomplete
                    name='category_id'
                    label='Ota kategoriya'
                    loading={isLoading}
                    data={data?.data || []}
                    getOption={(value: any) => {
                      return value?.name?.[i18n.language]
                    }}
                    //   onchange={setValue}
                    setValue={setValue}
                    value={getValues('category_ids') || null}
                    defaultValue={getInfo?.data?.data?.category_id || null}
                    control={control}
                  />
                </Grid>
                <Grid item sm={12}>
                  <FileUploaderSingle
                    type='images'
                    setLoading={setImageLoader}
                    images={getValues('photo')}
                    setImage={(el: string) => setValue('photo', el)}
                  />
                </Grid>

                <Grid item sm={12}>
                  <Button
                    disabled={isSubmitting}
                    onClick={handleSubmit((data: any) =>
                      handleFinish(
                        !searchParams.get('id')
                          ? { ...data, category_id: data?.category_id?.id || 0 }
                          : { id: searchParams.get('id'), ...data, category_id: data?.category_id?.id || 0 }
                      )
                    )}
                    variant='contained'
                    color='success'
                    fullWidth
                  >
                    {/* <Translations text='Submit' /> */}
                    Saqlash
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        )
      }}
    </Form>
  )
}

export default LandingCategoryForm
