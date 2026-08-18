import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
// import CategoryItem from '../category-item'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import Form from '../../../../components/form/Form'
import { BULK_DELETE_ARTICLES_CHAPTERS, CREATE_ARTICLES, UPDATE_ARTICLES } from '../../mutatuions'
import { useMutation, useQuery } from 'react-query'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { GET_CATEGORIES } from '../../../category/queries'
import { GET_ARTICLE } from '../../queries'
import { ICategory } from '../../../category/data/data'
import CustomCheckbox from '../../../../components/checkbox'
import ChapterItem from '../chapter-item'
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { data: article, refetch } = useQuery(
    ['article', `${searchParams.get('id')}`],
    () => GET_ARTICLE(`${searchParams.get('id')}`),
    {
      enabled: !!searchParams.get('id')
    }
  )
  const { mutate: deleteChapter } = useMutation(BULK_DELETE_ARTICLES_CHAPTERS, {
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <Form
      getQuery={GET_ARTICLE}
      updateMutation={UPDATE_ARTICLES}
      createMutation={CREATE_ARTICLES}
      name='Article'
      pageName='Articles'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        return (
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Maqola
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
                    label='Kategoriyalar'
                    loading={isLoading}
                    data={data?.data || []}
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
                    // onLoad={
                    //   getInfo?.data?.data?.categories_sort &&
                    //   setValue('sort', getInfo?.data?.data?.categories_sort?.join(', '))
                    // }
                    label={'Sort'}
                    {...register('sort')}
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
                    {...register('blocks[0].questions_string')}
                  />
                </Grid>
                <Grid item sm={12}>
                  <CustomCheckbox
                    defaultValue={getInfo?.data?.data?.paid}
                    setValue={setValue}
                    name='paid'
                    label='Premium'
                    value={getValues}
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
                        paid: Number(data?.paid),
                        blocks: data?.blocks?.[0]?.questions_string?.trim(' ')?.split(',')?.[0]
                          ? [
                              {
                                name: data?.name,
                                question_ids: data?.blocks?.[0]?.questions_string?.trim(' ')?.split(','),
                                sort: 1
                              }
                            ]
                          : []
                      })
                    )}
                  >
                    {/* <Translations text='Submit' /> */}
                    Saqlash
                  </Button>
                </Grid>
              </Grid>
            </form>
            {/* Bo'lim qo'shish faqat saqlangan maqola uchun mumkin — ilgari yangi
                maqolada ham ko'rinardi va /chapter?article_id=null ochilardi. */}
            {!!searchParams.get('id') && (
              <Button
                sx={{ ml: '1.88rem' }}
                variant='outlined'
                onClick={() => navigate(`/chapter?article_id=${searchParams.get('id')}`)}
              >
                Bo`lim qo`shish
              </Button>
            )}
            {article?.data?.chapters?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: '1.88rem' }}>
                  Bo`limlar
                </Typography>
                {article?.data?.chapters?.map((chapter: ICategory) => (
                  <ChapterItem
                    key={chapter?.id}
                    onDelete={() =>
                      deleteChapter({
                        id: searchParams.get('id'),
                        childId: chapter?.id
                      })
                    }
                    onEdit={() => {
                      //@ts-ignore
                      navigate({
                        pathname: '/chapter',
                        search: createSearchParams({
                          chapter_id: String(chapter?.id),
                          article_id: String(searchParams.get('id'))
                        }).toString()
                      })
                    }}
                    item={chapter}
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
