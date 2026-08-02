import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import React, { Fragment, useState } from 'react'
import { top100Films } from '../../../../components/multiple-select'
import { useQuery } from 'react-query'
import { GET_TARIFF, GET_TARIFFS_INTERVAL } from '../../queries'
import { Delete } from '@mui/icons-material'
import Form from '../../../../components/form/Form'
import { CREATE_TARIFF, UPDATE_TARIFF } from '../../mutatuions'
import DefaultValue from '../../../../components/defaultvalue/DefaultValue'
import { ITranslation } from '../../data/data'
import FileUploaderSingle from '../../../../components/file-uploader/FileUploaderSingle'
import { useTranslation } from 'react-i18next'

function TariffsForm() {
  const { i18n } = useTranslation()
  const { data } = useQuery(['tariff-interval'], GET_TARIFFS_INTERVAL)
  const [alignment, setAlignment] = React.useState<'uz' | 'ru' | 'en'>('uz')
  const [image, setImage] = useState('')
  const [advantages, setAdvantages] = React.useState([
    {
      name: { uz: '', ru: '', en: '' },
      status: false
    }
  ])
  const [interval, setInterval] = React.useState<{
    name: ITranslation
    id: number
    month_count: number
  } | null>(null)
  const [name, setName] = React.useState({
    uz: '',
    en: '',
    ru: ''
  })
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    newAlignment && setAlignment(newAlignment)
  }

  return (
    <Form
      getQuery={GET_TARIFF}
      updateMutation={UPDATE_TARIFF}
      createMutation={CREATE_TARIFF}
      name='Tariff'
      pageName='Tariffs'
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues }) => {
        return (
          <Box p={'1.88rem'} width={'100%'}>
            <Typography
              typography={'h3'}
              style={{
                textAlign: 'center',
                verticalAlign: 'middle',
                marginTop: '1.88rem'
              }}
            >
              Edit-Tariff
            </Typography>
            <form>
              <Grid container sm={12} spacing={'1.88rem'}>
                <Grid item sm={12}>
                  <DefaultValue defaultValue={getInfo?.data?.data?.photo} setDefaultValue={e => setImage(e)}>
                    <FileUploaderSingle images={image} setImage={setImage} />
                  </DefaultValue>
                </Grid>
                <Grid item sm={6}>
                  <DefaultValue defaultValue={getInfo?.data?.data?.term_id} setDefaultValue={e => setInterval(e)}>
                    <Autocomplete
                      id='tags-outlined'
                      options={data?.data || []}
                      value={interval}
                      size='small'
                      onChange={(_, e) => setInterval(e)}
                      fullWidth
                      getOptionLabel={(option: any) => option?.name[i18n?.language]}
                      filterSelectedOptions
                      //@ts-ignore
                      renderInput={params => <TextField {...params} label='Select Tariffs InterVal' />}
                    />
                  </DefaultValue>
                </Grid>
                <Grid item sm={6}>
                  <TextField size='small' fullWidth label={'Sort'} type='number' {...register('sort')} />
                </Grid>
                <Grid item sm={12}>
                  <TextField size='small' fullWidth required label={'Price'} type='number' {...register('price')} />
                </Grid>
                <Grid item sm={12}>
                  <ToggleButtonGroup
                    color='primary'
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label='Language'
                    size='small'
                    fullWidth
                  >
                    <ToggleButton value='uz'>UZ</ToggleButton>
                    <ToggleButton value='ru'>RU</ToggleButton>
                    <ToggleButton value='en'>EN</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item sm={12}>
                  <DefaultValue defaultValue={getInfo?.data?.data?.name} setDefaultValue={e => setName(e)}>
                    <TextField
                      size='small'
                      value={name?.[alignment] || ''}
                      onChange={e => setName({ ...name, [alignment]: e.target.value })}
                      fullWidth
                      required
                      id='form-props-required'
                      label={'Name'}
                    />
                  </DefaultValue>
                </Grid>
                <Grid item sm={12}>
                  <Typography>Advantages</Typography>
                </Grid>
                <DefaultValue defaultValue={getInfo?.data?.data?.advantages} setDefaultValue={e => setAdvantages(e)}>
                  {advantages?.map((value, i) => (
                    <Fragment key={i}>
                      <Grid item sm={10}>
                        <TextField
                          size='small'
                          fullWidth
                          required
                          id='form-props-required'
                          label={'Name'}
                          value={value?.name?.[alignment] || ''}
                          onChange={e =>
                            setAdvantages(prev =>
                              prev?.map((el, index) =>
                                index === i ? { ...el, name: { ...el.name, [alignment]: e.target.value } } : el
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid item sm={1}>
                        <Checkbox
                          checked={value?.status}
                          defaultChecked={value?.status}
                          onChange={e =>
                            setAdvantages(prev =>
                              prev?.map((el, index) => (index === i ? { ...el, status: e.target.checked } : el))
                            )
                          }
                        />
                      </Grid>
                      <Grid item sm={1}>
                        <IconButton onClick={() => setAdvantages(prev => prev?.filter((el, index) => index !== i))}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Fragment>
                  ))}
                </DefaultValue>

                <Grid item sm={12}>
                  <Button
                    variant='contained'
                    color='success'
                    fullWidth
                    onClick={() =>
                      setAdvantages([
                        ...advantages,
                        {
                          name: { uz: '', ru: '', en: '' },
                          status: false
                        }
                      ])
                    }
                  >
                    Add Advantage
                  </Button>
                </Grid>

                <Grid item sm={12}>
                  <Button
                    onClick={handleSubmit((data: any) =>
                      handleFinish({
                        ...data,
                        name: name,
                        term_id: interval?.id,
                        advantages: advantages,
                        photo: image
                      })
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
          </Box>
        )
      }}
    </Form>
  )
}

export default TariffsForm
