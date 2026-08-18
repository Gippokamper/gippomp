import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import Form from '../../../../components/form/Form'

import { useQuery } from 'react-query'
import CustomCheckbox from '../../../../components/checkbox'
import { GET_VIDEO_CATEGORIES } from '../../../video-category/queries'
import { GET_VIDEO } from '../../queries'
import { CREATE_VIDEOS, UPDATE_VIDEOS } from '../../mutatuions'
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
  const { data, isLoading } = useQuery(['video-categories-all'], () => GET_VIDEO_CATEGORIES({ perPage: 1000 }))
  //   const { data: childs } = useQuery(['categories', searchParams?.get('id')], () =>
  //     GET_VIDEO_CATEGORIES({ category_id: searchParams?.get('id') })
  //   )
  //   const { data: category, refetch } = useQuery(
  //     ['category', searchParams?.get('id')],
  //     () => GET_VIDEO_CATEGORY(`${searchParams.get('id')}`),
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
      getQuery={GET_VIDEO}
      updateMutation={UPDATE_VIDEOS}
      createMutation={CREATE_VIDEOS}
      name='Video'
      pageName='Videos'
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
              Video
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
                    label={'Link'}
                    {...register('link')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <CustomAutocomplete
                    name='category_ids'
                    label='Kategoriyalar'
                    loading={isLoading}
                    data={data?.data}
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
                    defaultValue={getInfo?.data?.data?.sort}
                    required
                    label={'Sort'}
                    {...register('sort')}
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
                        sort: String(data?.sort ?? '')
                          .trim()
                          .split(',')
                          .map((item: string) => +item)
                          .filter((n: number) => !isNaN(n)),
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
