import { Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import Form from '../../../../components/form/Form'
import { useSearchParams } from 'react-router-dom'
import { GET_FAQ } from '../../queries'
import { CREATE_FAQ, UPDATE_FAQ } from '../../mutatuions'

function TranslationsForm() {
  const [searchParams] = useSearchParams()
  return (
    <Form getQuery={GET_FAQ} updateMutation={UPDATE_FAQ} createMutation={CREATE_FAQ} name='faq' pageName='Faqs'>
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        return (
          <div>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Savol-javob
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
                    label={'Answer Russian'}
                    {...register('answer[ru]')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <Button
                    disabled={isSubmitting}
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

export default TranslationsForm
