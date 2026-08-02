import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
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
  const { data, isLoading } = useQuery(['categoryies'], GET_STUDY_PLANS)
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
      name='Study-plan'
      pageName='Study-Plans'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues }) => {
        // console.log(getValues('category_ids'), 'value', getInfo?.data?.data?.parent_category)
        return (
          <Box>
            <Typography
              typography={'h3'}
              style={{
                textAlign: 'center',
                verticalAlign: 'middle',
                marginTop: '1.88rem'
              }}
            >
              Edit-Category
              {/* <Translations text='Edit' /> - <Translations text='Translation' /> */}
            </Typography>
            <form>
              <Grid container sm={12} spacing={'1.88rem'} p={'1.88rem'}>
                <Grid item sm={12}>
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    size='small'
                    variant='outlined'
                    fullWidth
                    required
                    id='form-props-required'
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
                    id='form-props-required'
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
                    id='form-props-required'
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
                    id='form-props-required'
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
                    id='form-props-required'
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
                    id='form-props-required'
                    label={'Info Russian'}
                    {...register('info.ru')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <CustomAutocomplete
                    loading={isLoading}
                    name='plan_ids'
                    data={data?.data?.filter((el: ICategory) => el.id !== Number(searchParams.get('id'))) || []}
                    getOption={(value: any) => {
                      return value?.name?.[i18n.language]
                    }}
                    //   onchange={setValue}
                    multiple={true}
                    setValue={setValue}
                    value={getValues('plan_ids') || []}
                    defaultValue={getInfo?.data?.data?.parent_category || []}
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
                    defaultValue={getInfo?.data?.data?.plan_sort ?? getInfo?.data?.data?.sort}
                    required
                    id='form-props-required'
                    label={'Sort'}
                    {...register('plan_sort')}
                  />
                </Grid>

                <Grid item sm={12}>
                  <Button
                    variant='contained'
                    color='success'
                    fullWidth
                    onClick={handleSubmit((data: any) =>
                      handleFinish({
                        ...data,
                        plan_ids: data?.plan_ids?.map((el: any) => el.id) || null,
                        ...(!!data?.plan_ids?.length
                          ? {
                              plan_sort: String(data?.plan_sort ?? '')
                                .trim()
                                .split(',')
                                .map((item: string) => +item)
                                .filter((n: number) => !isNaN(n))
                            }
                          : {
                              sort: String(data?.plan_sort ?? '')
                                .trim()
                                .split(',')
                                .map((item: string) => +item)
                                .filter((n: number) => !isNaN(n)),
                              plan_sort: []
                            })
                      })
                    )}
                  >
                    {/* <Translations text='Submit' /> */}
                    Submit
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
                <Typography typography={'h5'} sx={{ mb: '1.88rem' }}>
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
                <Typography typography={'h5'} sx={{ mb: '1.88rem' }}>
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
