import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import CategoryItem from '../category-item'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import Form from '../../../../components/form/Form'
import { GET_CATEGORIES, GET_CATEGORY } from '../../queries'
import {
  BULK_DELETE_CHILD_ARTICLE,
  BULK_DELETE_CHILD_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY
} from '../../mutatuions'
import { useMutation, useQuery } from 'react-query'
import { ICategory } from '../../data/data'
import { useSearchParams } from 'react-router-dom'
import CustomCheckbox from '../../../../components/checkbox'
import { useTranslation } from 'react-i18next'

const initialValues = {
  name: {
    uz: '',
    ru: '',
    en: ''
  },
  paid: true
}

function CategoryForm() {
  const { i18n } = useTranslation()
  const { data, isLoading } = useQuery(['categories-all'], () => GET_CATEGORIES({ perPage: 1000 }))
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: childs } = useQuery(['categories', searchParams?.get('id')], () =>
    GET_CATEGORIES({ category_id: searchParams?.get('id') })
  )
  const { data: category, refetch } = useQuery(
    ['category', searchParams?.get('id')],
    () => GET_CATEGORY(`${searchParams.get('id')}`),
    {
      enabled: !!searchParams?.get('id')
    }
  )
  const { mutate: deleteChildCategory } = useMutation(BULK_DELETE_CHILD_CATEGORY, {
    onSuccess: () => {
      refetch()
    }
  })
  const { mutate: deleteArticle } = useMutation(BULK_DELETE_CHILD_ARTICLE, {
    onSuccess: () => {
      refetch()
    }
  })
  return (
    <Form
      getQuery={GET_CATEGORY}
      updateMutation={UPDATE_CATEGORY}
      createMutation={CREATE_CATEGORY}
      name='Category'
      pageName='Categories'
      initialValues={initialValues}
    >
      {({
        getInfo,
        handleFinish,
        createInfo,
        updateInfo,
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        errors, isSubmitting }) => {
        // console.log(getValues('category_ids'), 'value', getInfo?.data?.data?.parent_category)
        return (
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Kategoriya
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
                  <CustomAutocomplete
                    name='category_ids'
                    label='Ota kategoriyalar'
                    loading={isLoading}
                    data={data?.data?.filter((el: ICategory) => el.id !== Number(searchParams.get('id'))) || []}
                    getOption={(value: any) => {
                      return value?.name?.[i18n.language]
                    }}
                    //   onchange={setValue}
                    multiple={true}
                    setValue={setValue}
                    value={getValues('category_ids') || []}
                    defaultValue={getInfo?.data?.data?.category_ids || []}
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
                    defaultValue={getInfo?.data?.data?.parent_category_sort?.join(', ')}
                    onLoad={
                      getInfo?.data?.data?.parent_category_sort &&
                      setValue('sort', getInfo?.data?.data?.parent_category_sort?.join(', '))
                    }
                    required
                    label={'Sort'}
                    {...(getInfo?.data?.data?.category_ids?.length ? register('category_sort') : register('sort'))}
                  />
                </Grid>
                <Grid item sm={12}>
                  <CustomCheckbox
                    defaultValue={getInfo?.data?.data?.paid}
                    setValue={setValue}
                    value={getValues}
                    name='paid'
                    label='Premium'
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
                        category_ids: data?.category_ids?.map((el: any) => el.id) || null,
                        ...(data?.category_ids?.length > 0
                          ? {
                              category_sort: String(data?.category_sort || data?.sort)
                                ?.split(',')
                                ?.map((item: string) => +item),
                              sort: []
                            }
                          : {
                              sort: String(data?.sort || data?.category_sort)
                                ?.split(',')
                                ?.map((item: string) => +item),
                              category_sort: []
                            }),
                        paid: Number(data?.paid)
                      })
                    )}
                  >
                    {/* <Translations text='Submit' /> */}
                    Saqlash
                  </Button>
                </Grid>
              </Grid>
            </form>
            {category?.data?.child_category?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: '1.88rem' }}>
                  Ichki kategoriyalar
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
                  Maqolalar
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
            )}
          </Box>
        )
      }}
    </Form>
  )
}

export default CategoryForm
