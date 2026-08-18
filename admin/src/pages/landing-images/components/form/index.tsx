import { Button, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../../../../components/form/Form'
import { useSearchParams } from 'react-router-dom'
import { GET_IMAGE } from '../../queries'
import { CREATE_IMAGE, UPDATE_IMAGE } from '../../mutatuions'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'

function LandingImagesForm() {
  const [imageLoader, setImageLoader] = useState(false)
  const [searchParams] = useSearchParams()
  return (
    <Form
      getQuery={GET_IMAGE}
      updateMutation={UPDATE_IMAGE}
      createMutation={CREATE_IMAGE}
      name='LandingImage'
      pageName='LandingImages'
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        return (
          <div>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Landing rasm
            </Typography>
            <form>
              <Grid container spacing={2} p={3}>
                <Grid item sm={12} lg={12}>
                  <TextField
                    size='small'
                    multiline
                    InputLabelProps={{
                      shrink: true
                    }}
                    fullWidth
                    required
                    label={'Name'}
                    {...register('name')}
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
                    disabled={imageLoader || isSubmitting}
                    onClick={handleSubmit((data: any) =>
                      handleFinish(!searchParams.get('id') ? data : { id: searchParams.get('id'), ...data })
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

export default LandingImagesForm
