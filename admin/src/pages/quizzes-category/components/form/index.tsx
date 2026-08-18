import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import Form from '../../../../components/form/Form'

import { useQuery } from 'react-query'
import { ICategory } from '../../data/data'
import { useSearchParams } from 'react-router-dom'
import { GET_STUDY_PLAN, GET_STUDY_PLANS } from '../../queries'
import { CREATE_STUDY_PLAN, UPDATE_STUDY_PLAN } from '../../mutatuions'
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
  const { data, isLoading } = useQuery(['quizzes-all'], () => GET_STUDY_PLANS({ perPage: 1000 }))
  const [searchParams] = useSearchParams()

  //   const { data: category, refetch } = useQuery(
  //     ['category', searchParams?.get('id')],
  //     () => GET_CATEGORY(`${searchParams.get('id')}`),
  //     {
  //       enabled: !!searchParams?.get('id')
  //     }
  //   )
  //   const { mutate: deleteChildCategory } = useMutation(BULK_DELETE_CHILD_CATEGORY, {
  //     onSuccess: () => {
  //       refetch()
  //     }
  //   })
  //   const { mutate: deleteArticle } = useMutation(BULK_DELETE_CHILD_ARTICLE, {
  //     onSuccess: () => {
  //       refetch()
  //     }
  //   })
  return (
    <Form
      getQuery={GET_STUDY_PLAN}
      updateMutation={UPDATE_STUDY_PLAN}
      createMutation={CREATE_STUDY_PLAN}
      name='Quiz-category'
      pageName='Quizzes-Category'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        // console.log(getValues('category_ids'), 'value', getInfo?.data?.data?.parent_category)
        return (
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Test bo'limi
              {/* <Translations text='Edit' /> - <Translations text='Translation' /> */}
            </Typography>
            <form>
              <Grid container spacing={2} p={3}>
                <Grid item sm={12}>
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    size='small'
                    variant='outlined'
                    fullWidth
                    required
                    label={'O`zbek'}
                    {...register('name.uz')}
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
                    label={'English'}
                    {...register('name.en')}
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
                    label={'Russian'}
                    {...register('name.ru')}
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
                    label={'Info O`zbek'}
                    {...register('info.uz')}
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
                    label={'Info English'}
                    {...register('info.en')}
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
                    label={'Info Russian'}
                    {...register('info.ru')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <CustomAutocomplete
                    loading={isLoading}
                    name='quiz_ids'
                    label='Ota bo`limlar'
                    data={data?.data?.filter((el: ICategory) => el.id !== Number(searchParams.get('id'))) || []}
                    getOption={(value: any) => {
                      return value?.name?.[i18n.language]
                    }}
                    //   onchange={setValue}
                    multiple={true}
                    setValue={setValue}
                    value={getValues('quiz_ids') || []}
                    defaultValue={getInfo?.data?.data?.quiz_ids || []}
                    control={control}
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
                    label={'Sort'}
                    {...(!!getInfo?.data?.data && !getInfo?.data?.data?.quiz_ids?.length
                      ? register('sort')
                      : register('quiz_sort'))}
                  />
                </Grid>

                <Grid item sm={12}>
                  <Button
                    variant='contained'
                    color='success'
                    fullWidth
                    disabled={isSubmitting}
                    onClick={handleSubmit((data: any) =>
                      handleFinish({
                        ...data,
                        quiz_ids: data?.quiz_ids?.map((el: any) => el.id) || null,
                        ...(!!data?.quiz_ids?.length
                          ? {
                              quiz_sort: String(data?.quiz_sort ?? '')
                                .trim()
                                .split(',')
                                .map((item: string) => +item)
                                .filter((n: number) => !isNaN(n))
                            }
                          : {
                              sort: String(data?.quiz_sort ?? '')
                                .trim()
                                .split(',')
                                .map((item: string) => +item)
                                .filter((n: number) => !isNaN(n)),
                              quiz_sort: []
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
            {/* {category?.data?.child_category?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: '1.88rem' }}>
                  Categories
                </Typography>
                {category?.data?.child_category?.map((category: ICategory) => (
                  <CategoryItem
                    key={category?.id}
                    title={category?.name?.uz}
                    to='/categories'
                    onClick={() =>
                      deleteChildCategory({
                        id: searchParams.get('id'),
                        childId: category?.id
                      })
                    }
                  />
                ))}
              </Box>
            )}
            {category?.data?.articles?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: '1.88rem' }}>
                  Categories
                </Typography>
                {category?.data?.articles?.map((article: any) => (
                  <CategoryItem
                    key={article?.id}
                    title={article?.name?.uz}
                    to='/articles'
                    onClick={() =>
                      deleteArticle({
                        id: searchParams.get('id'),
                        childId: article?.id
                      })
                    }
                  />
                ))}
              </Box>
            )} */}
          </Box>
        )
      }}
    </Form>
  )
}

export default CategoryForm
