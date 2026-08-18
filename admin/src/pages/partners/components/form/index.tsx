import { Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../../../../components/form/Form'
import { useSearchParams } from 'react-router-dom'
import { GET_PARTNER } from '../../queries'
import { CREATE_PARTNER, UPDATE_PARTNER } from '../../mutatuions'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'

function PartnersForm() {
  const [searchParams] = useSearchParams()
  const [imageLoader, setImageLoader] = useState(false)
  return (
    <Form
      getQuery={GET_PARTNER}
      updateMutation={UPDATE_PARTNER}
      createMutation={CREATE_PARTNER}
      name='paretner'
      pageName='Partners'
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        return (
          <div>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Hamkor
            </Typography>
            <form>
              <Grid container spacing={2} p={3}>
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

export default PartnersForm
