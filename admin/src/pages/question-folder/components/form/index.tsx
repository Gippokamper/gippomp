import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import CategoryItem from '../category-item'
import CustomAutocomplete from '../../../../components/custom-autocomplite'
import Form from '../../../../components/form/Form'
import { GET_FOLDER, GET_FOLDERS } from '../../queries'
import { BULK_DELETE_CHILD_FOLDER, BULK_DELETE_CHILD_QUESTION, CREATE_FOLDER, UPDATE_FOLDER } from '../../mutatuions'
import { useMutation, useQuery } from 'react-query'
import i18n from '../../../../configs/i18n'
import { useSearchParams } from 'react-router-dom'
import CustomCheckbox from '../../../../components/checkbox'
import { IFolders } from '../../data/data'

const initialValues = {
  name: {
    uz: '',
    ru: '',
    en: ''
  },
  paid: true
}

function CategoryForm() {
  const { data, isLoading } = useQuery(['folders'], GET_FOLDERS)
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
                  <CustomAutocomplete
                    name='folder_ids'
                    loading={isLoading}
                    data={data?.data?.filter((el: IFolders) => el.id !== Number(searchParams.get('id'))) || []}
                    getOption={(value: any) => {
                      return value?.name?.[i18n.language]
                    }}
                    //   onchange={setValue}
                    multiple={true}
                    setValue={setValue}
                    value={getValues('folder_ids') || []}
                    defaultValue={getInfo?.data?.data?.folders || []}
                    control={control}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    size='small'
                    disabled={!getValues('folder_ids')?.length}
                    variant='outlined'
                    fullWidth
                    required
                    id='form-props-required'
                    defaultValue={getInfo?.data?.data?.folders_sort}
                    label={'Sort'}
                    {...register('sort')}
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
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
            {folder?.data?.child_folder?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography typography={'h5'} sx={{ mb: '1.88rem' }}>
                  Categories
                </Typography>
                {folder?.data?.child_folder?.map((category: IFolders) => (
                  <CategoryItem
                    key={category?.id}
                    title={category?.name?.uz}
                    to='/categories'
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
            {folder?.data?.articles?.length > 0 && (
              <Box
                sx={{
                  p: '1.88rem'
                }}
              >
                <Typography typography={'h5'} sx={{ mb: '1.88rem' }}>
                  Categories
                </Typography>
                {folder?.data?.articles?.map((article: any) => (
                  <CategoryItem
                    key={article?.id}
                    title={article?.name?.uz}
                    to='/articles'
                    onClick={() =>
                      deleteChildQuestion({
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
