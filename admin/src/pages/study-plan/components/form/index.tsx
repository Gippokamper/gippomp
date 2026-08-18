import { Autocomplete, Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../../../../components/form/Form'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { GET_STUDY_PLAN, GET_STUDY_PLANS } from '../../queries'
import {
  CREATE_STUDY_BLOCK,
  CREATE_STUDY_PLAN,
  DELETE_STUDY_BLOCK,
  UPDATE_STUDY_BLOCK,
  UPDATE_STUDY_PLAN
} from '../../mutatuions'
import DefaultValue from '../../../../components/defaultvalue/DefaultValue'
import { GET_ARTICLES } from '../../../articles/queries'
import { IArticle } from '../../../articles/data/data'
import { useTranslation } from 'react-i18next'

const initialValues = {
  name: {
    uz: '',
    ru: '',
    en: ''
  },
  info: {
    uz: '',
    ru: '',
    en: ''
  }
}

function CategoryForm() {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const { data } = useQuery(['study-plans-without-child'], () => GET_STUDY_PLANS({ without_child: 1, perPage: 1000 }))
  const { data: aData } = useQuery(['articles-all'], () => GET_ARTICLES({ perPage: 1000 }))
  const [alignment, setAlignment] = React.useState<'uz' | 'ru' | 'en'>('uz')
  const [searchParams] = useSearchParams()
  const [name, setName] = useState({
    uz: '',
    ru: '',
    en: ''
  })
  const [info, setInfo] = useState({
    uz: '',
    ru: '',
    en: ''
  })
  const [plans, setPlans] = useState([])
  const [sort, setSort] = useState('')
  const [articles, setArticles] = useState<IArticle[]>([])
  const [articleSort, setArticleSort] = useState('')
  const [block, setBlock] = useState([
    {
      name: {
        uz: '',
        ru: '',
        en: ''
      },
      question_ids: '',
      sort: ''
    }
  ])

  const addBlock = () => {
    setBlock([
      ...block,
      {
        name: {
          uz: '',
          ru: '',
          en: ''
        },
        question_ids: '',
        sort: ''
      }
    ])
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    newAlignment && setAlignment(newAlignment)
  }

  const { mutate: create } = useMutation(CREATE_STUDY_BLOCK, {
    onSuccess: async () => {
      await queryClient.refetchQueries(['Study-plan', searchParams.get('id')])
    }
  })
  const { mutate: update } = useMutation(UPDATE_STUDY_BLOCK, {
    onSuccess: async () => {
      await queryClient.refetchQueries(['Study-plan', searchParams.get('id')])
    }
  })
  const { mutate: deleteBlock } = useMutation(DELETE_STUDY_BLOCK, {
    onSuccess: async () => {
      await queryClient.refetchQueries(['Study-plan', searchParams.get('id')])
    }
  })

  const handleSave = (index: number) => {
    const data = block[index]
    //@ts-ignore
    if (data?.id) {
      update({
        type: 'study_plan',
        plan_id: searchParams.get('id'),
        blocks: [{ ...data, question_ids: data.question_ids?.trim()?.split(',') }],
        //@ts-ignore
        id: data.id
      })
    } else {
      create({
        id: searchParams.get('id'),
        type: 'study_plan',
        blocks: [{ ...data, question_ids: data.question_ids?.trim()?.split(',') }]
      })
    }
  }

  const handleDelete = (index: number) => {
    const data = block[index]
    //@ts-ignore
    if (data?.id) {
      //@ts-ignore
      deleteBlock(data?.id)
    } else {
      setBlock(prev => prev.filter((_, i) => i !== index))
    }
  }

  return (
    <Form
      getQuery={GET_STUDY_PLAN}
      updateMutation={UPDATE_STUDY_PLAN}
      createMutation={CREATE_STUDY_PLAN}
      name='Study-plan'
      pageName='Study-Plans'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        return (
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              O'quv rejasi
              {/* <Translations text='Edit' /> - <Translations text='Translation' /> */}
            </Typography>
            <form>
              <Grid container spacing={2} p={3}>
                <Grid item sm={12}>
                  <DefaultValue defaultValue={getInfo?.data?.data?.plan_ids} setDefaultValue={e => setPlans(e)}>
                    <Autocomplete
                      disablePortal
                      size='small'
                      fullWidth
                      //@ts-ignore
                      getOptionLabel={(option: IArticle) => option.name[i18n.language]}
                      options={data?.data || []}
                      value={plans}
                      multiple
                      onChange={(_, e: any) => setPlans(e)}
                      //@ts-ignore
                      renderInput={params => <TextField {...params} label='Study plans' />}
                    />
                  </DefaultValue>
                </Grid>
                <Grid item sm={12}>
                  <DefaultValue
                    defaultValue={getInfo?.data?.data}
                    setDefaultValue={e => setSort(!!Number(e?.sort) ? e?.sort : e.plan_sort)}
                  >
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      size='small'
                      variant='outlined'
                      fullWidth
                      required
                      label={'Sort'}
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                    />
                  </DefaultValue>
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
                      InputLabelProps={{
                        shrink: true
                      }}
                      size='small'
                      variant='outlined'
                      fullWidth
                      required
                      label={'Name'}
                      value={name[alignment]}
                      onChange={e => setName({ ...name, [alignment]: e.target.value })}
                    />
                  </DefaultValue>
                </Grid>

                <Grid item sm={12}>
                  <DefaultValue defaultValue={getInfo?.data?.data?.info} setDefaultValue={e => setInfo(e)}>
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      size='small'
                      variant='outlined'
                      fullWidth
                      required
                      label={'Info'}
                      value={info[alignment]}
                      onChange={e => setInfo({ ...info, [alignment]: e.target.value })}
                    />
                  </DefaultValue>
                </Grid>
                <Grid item sm={12}>
                  <DefaultValue defaultValue={getInfo?.data?.data?.article_ids} setDefaultValue={e => setArticles(e)}>
                    <Autocomplete
                      disablePortal
                      size='small'
                      fullWidth
                      //@ts-ignore
                      getOptionLabel={(option: IArticle) => option.name[i18n.language]}
                      options={aData?.data || []}
                      value={articles}
                      multiple
                      onChange={(_, e: any) => setArticles(e)}
                      //@ts-ignore
                      renderInput={params => <TextField {...params} label='Articles' />}
                    />
                  </DefaultValue>
                </Grid>
                <Grid item sm={12}>
                  <DefaultValue
                    defaultValue={getInfo?.data?.data?.article_sort}
                    setDefaultValue={e => setArticleSort(e)}
                  >
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      size='small'
                      variant='outlined'
                      fullWidth
                      required
                      label={'Sort'}
                      value={articleSort}
                      onChange={e => setArticleSort(e.target.value)}
                    />
                  </DefaultValue>
                </Grid>

                <Grid item sm={12}>
                  Block
                  <Button sx={{ ml: '2rem' }} variant='contained' color='success' onClick={addBlock}>
                    Add
                  </Button>
                </Grid>
                <DefaultValue
                  defaultValue={getInfo?.data?.data?.blocks}
                  setDefaultValue={e =>
                    setBlock(
                      e?.map((el: any) => {
                        return {
                          ...el,
                          question_ids: el?.questions?.map((item: any) => item.id)?.join(', ')
                        }
                      })
                    )
                  }
                >
                  {block?.map((el, i) => (
                    <React.Fragment key={i}>
                      <Grid item sm={2}>
                        <TextField
                          InputLabelProps={{
                            shrink: true
                          }}
                          size='small'
                          variant='outlined'
                          fullWidth
                          required
                          label={'Sort'}
                          value={el.sort}
                          onChange={e =>
                            setBlock(prev =>
                              prev?.map((item, index) => (index === i ? { ...item, sort: e.target.value } : item))
                            )
                          }
                        />
                      </Grid>
                      <Grid item sm={10}>
                        <TextField
                          InputLabelProps={{
                            shrink: true
                          }}
                          size='small'
                          variant='outlined'
                          fullWidth
                          required
                          label={'Name'}
                          value={el.name[alignment]}
                          onChange={e =>
                            setBlock(prev =>
                              prev?.map((item, index) =>
                                index === i ? { ...item, name: { ...item.name, [alignment]: e.target.value } } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid item sm={12}>
                        <TextField
                          InputLabelProps={{
                            shrink: true
                          }}
                          size='small'
                          variant='outlined'
                          fullWidth
                          required
                          label={'Questions'}
                          value={el.question_ids}
                          onChange={e =>
                            setBlock(prev =>
                              prev?.map((item, index) =>
                                index === i ? { ...item, question_ids: e.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <Button variant='contained' color='error' fullWidth onClick={() => handleDelete(i)}>
                          Delete
                        </Button>
                      </Grid>
                      {!!searchParams.get('id') && (
                        <Grid item sm={6}>
                          <Button variant='contained' color='success' fullWidth onClick={() => handleSave(i)}>
                            Save
                          </Button>
                        </Grid>
                      )}
                    </React.Fragment>
                  ))}
                </DefaultValue>

                <Grid item sm={12}>
                  <Button
                    variant='contained'
                    color='success'
                    fullWidth
                    disabled={isSubmitting}
                    onClick={handleSubmit((data: any) =>
                      handleFinish({
                        type: 'study_plan',
                        ...(data?.id ? { id: data.id } : {}),
                        article_ids: articles?.map(article => article?.id),
                        article_sort: articleSort?.trim()?.split(','),
                        //@ts-ignore
                        plan_ids: plans?.map(plan => plan?.id),
                        ...(!!plans?.length
                          ? { plan_sort: sort?.trim()?.split(',') }
                          : { sort: sort?.trim()?.split(',') }),
                        name: name,
                        info: info,
                        blocks: block?.map(item => {
                          return {
                            ...item,
                            question_ids: item.question_ids?.trim()?.split(',')
                          }
                        })
                      })
                    )}
                  >
                    {/* <Translations text='Submit' /> */}
                    Saqlash
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

export default CategoryForm
