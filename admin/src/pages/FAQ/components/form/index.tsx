import { Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import Form from '../../../../components/form/Form'
import { useSearchParams } from 'react-router-dom'
import Translations from '../../../../components/translations'
import { GET_FAQ } from '../../queries'
import { CREATE_FAQ, UPDATE_FAQ } from '../../mutatuions'

function TranslationsForm() {
  const [searchParams] = useSearchParams()
  return (
    <Form getQuery={GET_FAQ} updateMutation={UPDATE_FAQ} createMutation={CREATE_FAQ} name='faq' pageName='Faqs'>
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
                <Grid item sm={12}>
                  <TextField
                    size='small'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    required
                    id='form-props-required'
                    label={'Question Uzbek'}
                    {...register('question[uz]')}
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
                    label={'Question English'}
                    {...register('question[en]')}
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
                    label={'Question Russian'}
                    {...register('question[ru]')}
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
                    label={'Answer Uzbek'}
                    {...register('answer[uz]')}
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
                    label={'Answer English'}
                    {...register('answer[en]')}
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
                    label={'Answer Russian'}
                    {...register('answer[ru]')}
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
