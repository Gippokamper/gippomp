import { Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import Form from '../../../../components/form/Form'
import { GET_VOCABULARY } from '../../queries'
import { CREATE_VOCABULARY, UPDATE_VOCABULARY } from '../../mutatuions'
import { useSearchParams } from 'react-router-dom'
import Translations from '../../../../components/translations'

function TranslationsForm() {
  const [searchParams] = useSearchParams()
  return (
    <Form
      getQuery={GET_VOCABULARY}
      updateMutation={UPDATE_VOCABULARY}
      createMutation={CREATE_VOCABULARY}
      name='Translation'
      pageName='Translations'
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues }) => {
        return (
          <div>
            <Typography
              typography={'h3'}
              style={{
                textAlign: 'center',
                verticalAlign: 'middle',
                marginTop: 10
              }}
            >
              <Translations text='Edit' /> - <Translations text='Translation' />
            </Typography>
            <form>
              <Grid container sm={12} spacing={5} p={10}>
                <Grid item sm={12} lg={12}>
                  <TextField
                    size='small'
                    multiline
                    InputLabelProps={{
                      shrink: true
                    }}
                    fullWidth
                    required
                    id='form-props-required'
                    label={'Key'}
                    {...register('key')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextField
                    size='small'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    required
                    id='form-props-required'
                    label={'Uzbek'}
                    {...register('translation[uz]')}
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
                    id='form-props-required'
                    label={'English'}
                    {...register('translation[en]')}
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
                    id='form-props-required'
                    label={'Russian'}
                    {...register('translation[ru]')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <Button
                    onClick={handleSubmit((data: any) =>
                      handleFinish(!searchParams.get('id') ? data : { id: searchParams.get('id'), ...data })
                    )}
                    variant='contained'
                    color='success'
                    fullWidth
                  >
                    {/* <Translations text='Submit' /> */}
                    Submit
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

export default TranslationsForm
