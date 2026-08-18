import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import CategoryItem from '../category-item'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import Form from '../../../../components/form/Form'
import { GET_FOLDER, GET_FOLDERS } from '../../queries'
import { BULK_DELETE_CHILD_FOLDER, BULK_DELETE_CHILD_QUESTION, CREATE_FOLDER, UPDATE_FOLDER } from '../../mutatuions'
import { useMutation, useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { IFolders } from '../../data/data'
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
  const { data, isLoading } = useQuery(['folders-all'], () => GET_FOLDERS({ perPage: 1000 }))
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: folder, refetch } = useQuery(
    ['folder', searchParams?.get('id')],
    () => GET_FOLDER(`${searchParams.get('id')}`),
    {
      enabled: !!searchParams?.get('id')
    }
  )
  const { mutate: deleteChildFolder } = useMutation(BULK_DELETE_CHILD_FOLDER, {
    onSuccess: () => {
      refetch()
    }
  })
  const { mutate: deleteChildQuestion } = useMutation(BULK_DELETE_CHILD_QUESTION, {
    onSuccess: () => {
      refetch()
    }
  })
  return (
    <Form
      getQuery={GET_FOLDER}
      updateMutation={UPDATE_FOLDER}
      createMutation={CREATE_FOLDER}
      name='Folder'
      pageName='Folders'
      initialValues={initialValues}
    >
      {({ getInfo, handleFinish, createInfo, updateInfo, register, handleSubmit, control, setValue, getValues, isSubmitting }) => {
        // console.log(getValues('category_ids'), 'value', getInfo?.data?.data?.parent_category)
        return (
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, px: 3, pt: 3 }}>
              Papka
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
                    name='folder_ids'
                    label='Ota papkalar'
                    loading={isLoading}
                    data={data?.data?.filter((el: IFolders) => el.id !== Number(searchParams.get('id'))) || []}
                    getOption={(value: any) => {
                      return value?.name?.[i18n.language]
                    }}
                    //   onchange={setValue}
                    multiple={true}
                    setValue={setValue}
                    value={getValues('folder_ids') || []}
                    defaultValue={getInfo?.data?.data?.folder_ids || []}
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
                    defaultValue={getInfo?.data?.data?.sort}
                    label={'Sort'}
                    {...register('sort')}
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
                        folder_ids: data?.folder_ids?.map((el: any) => el.id) || null,
                        sort: data?.sort
                          ? data?.sort
                              ?.trim()
                              ?.split(',')
                              ?.map((item: string) => +item)
                          : [],
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
            {/* FolderResource `child_folders` (ko'plikda) qaytaradi — ilgari
                `child_folder` o'qilgani uchun ichki papkalar ro'yxati hech
                qachon ko'rinmasdi. Backend'da papka bog'lanishini uzish
                endpoint'i yo'q, shuning uchun ro'yxat faqat ko'rish uchun. */}
            {folder?.data?.child_folders?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: '1.88rem' }}>
                  Ichki papkalar
                </Typography>
                {folder?.data?.child_folders?.map((category: IFolders) => (
                  <CategoryItem
                    key={category?.id}
                    canDelete={false}
                    title={category?.name?.uz}
                    onClick={() =>
                      deleteChildFolder({
                        id: searchParams.get('id'),
                        childId: category?.id
                      })
                    }
                  />
                ))}
              </Box>
            )}
            {/* Papkada `articles` emas, `questions` bo'ladi. */}
            {folder?.data?.questions?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: '1.88rem' }}>
                  Savollar
                </Typography>
                {folder?.data?.questions?.map((question: any) => (
                  <CategoryItem
                    key={question?.id}
                    canDelete={false}
                    title={question?.name?.uz}
                    onClick={() =>
                      deleteChildQuestion({
                        id: searchParams.get('id'),
                        childId: question?.id
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
