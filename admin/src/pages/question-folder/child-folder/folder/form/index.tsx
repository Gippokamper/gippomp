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
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'

import { CREATE_QUESTION, UPDATE_QUESTION } from '../mutatuions'
import { IQuestion } from '../data/data'
import { GET_QUESTION } from '../queries'
import { Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { IFolders } from '../../data/data'
import { GET_FOLDERS } from '../../../queries'
import { GET_ARTICLES } from '../../../../articles/queries'
import MyEditor from '../../../../../components/editor'
import toast from 'react-hot-toast'

function QuestionsForm() {
  const { i18n } = useTranslation()
  const { folder: folderSlug } = useParams()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [index, setIndex] = useState(1)
  const [image, setImage] = useState({
    photo: '',
    info: ''
  })
  const [folder, setFolder] = useState<IFolders | null>(null)
  const navigate = useNavigate()
  const [answers, setAnswers] = useState([
    {
      name: {
        uz: '',
        ru: '',
        en: ''
      },
      description: {
        uz: '',
        ru: '',
        en: ''
      },
      photos: [''],
      status: false,
      link: ''
    }
  ])

  const handleChangeActual = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index && !!item) {
          return {
            ...item,
            status: event.target.checked
          }
        } else {
          return item
        }
      })
    )
  }

  const handleAnswerName = (event: any, index: number) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index && !!item) {
          return {
            ...item,
            name: { ...item.name, [alignment]: event.target?.value }
          }
        } else {
          return item
        }
      })
    )
  }
  const handleAnswerDescription = (event: any, index: number) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            description: { ...item.description, [alignment]: event }
          }
        } else {
          return item
        }
      })
    )
  }
  const handleAnswerLink = (event: any, index: number) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index && !!item) {
          return {
            ...item,
            link: event?.slug
          }
        } else {
          return item
        }
      })
    )
  }

  const [alignment, setAlignment] = React.useState<'uz' | 'ru' | 'en'>('uz')
  const [name, setName] = useState({
    uz: '',
    ru: '',
    en: ''
  })
  const [addInfo, setAddInfo] = useState({
    uz: '',
    ru: '',
    en: ''
  })

  const addAnswer = () => {
    setAnswers([
      ...answers,
      {
        name: {
          uz: '',
          ru: '',
          en: ''
        },
        description: {
          uz: '',
          ru: '',
          en: ''
        },
        photos: [''],
        status: false,
        link: ''
      }
    ])
    setIndex(answers.length + 1)
  }

  const removeAnswer = (index: number) => {
    setAnswers(prev => prev?.filter((_, i) => i !== index))
    setIndex(answers.length - 1)
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    //@ts-ignore
    newAlignment && setAlignment(newAlignment)
  }


  const { data: folders } = useQuery(['folders-without-child'], () => GET_FOLDERS({ without_child: 1, perPage: 1000 }))
  const { data: articles } = useQuery(['articles-all'], () => GET_ARTICLES({ perPage: 1000 }))

  const { refetch } = useQuery(
    ['questions', searchParams.get('question_id')],
    () => GET_QUESTION(String(searchParams.get('question_id'))),
    {
      enabled: false,
      onSuccess: (data: { data: IQuestion }) => {
        //@ts-ignore
        setAnswers(data?.data?.answers)
        setFolder(data?.data?.folder_ids?.[0])
        setAddInfo(data?.data?.additional_info)
        setName(data?.data?.name)
        setImage(data?.data?.photo)

        // setTitle(data?.data?.name)
        // setContent(data?.data?.answers)
      }
    }
  )

  useEffect(() => {
    if (searchParams.get('question_id')) {
      refetch()
    }
    //eslint-disable-next-line
  }, [searchParams.get('question_id')])
  const { mutate: create, isLoading: isCreating } = useMutation(CREATE_QUESTION, {
    onSuccess: () => navigate(-1)
  })
  const { mutate: update, isLoading: isUpdating } = useMutation(UPDATE_QUESTION, {
    onSuccess: () => navigate(-1)
  })
  const isSaving = isCreating || isUpdating

  const handleSubmit = () => {
    const folderId = folders?.data?.find((el: any) => el.slug === folderSlug)?.id
    // folder_ids backend'da majburiy: papka topilmasa ilgari [undefined]
    // yuborilib, tushunarsiz 400 xatosi qaytardi.
    if (!folderId) {
      toast.error('Papka topilmadi — sahifani yangilang')
      return
    }
    const payload = {
      name: name,
      answers: answers,
      photo: image,
      additional_info: addInfo,
      folder_ids: [folderId]
    }
    const questionId = searchParams.get('question_id')
    questionId ? update({ id: questionId, ...payload }) : create(payload)
  }

  const addAnswerImage = (index: number) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index && !!item) {
          return {
            ...item,
            photos: [...item.photos, '']
          }
        } else {
          return item
        }
      })
    )
  }
  const deleteAnswerImage = (index: number, inx: number) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index && !!item) {
          return {
            ...item,
            photos: item?.photos?.filter((_, idx) => idx !== inx)
          }
        } else {
          return item
        }
      })
    )
  }
  const editAnswerImage = (index: number, inx: number, link: string) => {
    setAnswers(prev =>
      prev?.map((item, i) => {
        if (i === index && !!item) {
          return {
            ...item,
            photos: item?.photos?.map((el, idx) => (idx === inx ? link : el))
          }
        } else {
          return item
        }
      })
    )
  }
  return (
    <>
      <Box sx={{ p: '1.88rem' }}>
        <Typography
          variant='h6'
          style={{
            textAlign: 'center',
            verticalAlign: 'middle',
            marginTop: '1.88rem',
            marginBottom: '1.88rem'
          }}
        >
          Savol
          {/* <Translations text='Edit' /> - <Translations text='Translation' /> */}
        </Typography>
        <form
          style={{
            borderRadius: '1rem',
            padding: '2rem',
            backgroundColor: '#fff'
          }}
        >
          <Grid container spacing={2} wrap='wrap'>
            {/* <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                size='small'
                fullWidth
                //@ts-ignore
                getOptionLabel={(option: IFolders) => option.name[i18n.language]}
                options={folders?.data || []}
                value={folder}
                onChange={(_, e) => setFolder(e)}
                //@ts-ignore
                renderInput={params => <TextField {...params} label='Folders' />}
              />
            </Grid> */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem'
              }}
            >
              <ToggleButtonGroup
                color='primary'
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label='Language'
              >
                <ToggleButton value='uz'>UZ</ToggleButton>
                <ToggleButton value='ru'>RU</ToggleButton>
                <ToggleButton value='en'>EN</ToggleButton>
              </ToggleButtonGroup>
              <Button variant='contained' color='success' fullWidth disabled={isSaving} onClick={handleSubmit}>
                {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem'
              }}
            >
              <Typography variant='h6'>Savol</Typography>
              <ToggleButtonGroup
                color='primary'
                value={step}
                exclusive
                onChange={(_, value) => value && setStep(value)}
                aria-label='Type'
              >
                <ToggleButton value={1}>Question</ToggleButton>
                <ToggleButton value={2}>Additional Info</ToggleButton>
                <ToggleButton value={3}>Answers</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {step === 1 && (
              <>
                <Grid item xs={12}>
                  <MyEditor
                    height={400}
                    value={name[alignment] || ''}
                    setValue={el => setName({ ...name, [alignment]: el })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size='small'
                    value={image.photo}
                    onChange={e =>
                      setImage({
                        ...image,
                        photo: e.target.value
                      })
                    }
                    fullWidth
                    label={'Photo'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size='small'
                    value={image.info}
                    onChange={e =>
                      setImage({
                        ...image,
                        info: e.target.value
                      })
                    }
                    fullWidth
                    label={'Info'}
                  />
                </Grid>
              </>
            )}
            {step === 2 && (
              <Grid item xs={12}>
                <MyEditor
                  height={400}
                  value={addInfo[alignment] || ''}
                  setValue={el => setAddInfo({ ...addInfo, [alignment]: el })}
                />
              </Grid>
            )}
            {step === 3 && (
              <>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem'
                  }}
                >
                  <Autocomplete
                    disablePortal
                    size='small'
                    fullWidth
                    //@ts-ignore
                    getOptionLabel={(option: IArticle) => option.name[i18n.language]}
                    options={articles?.data || []}
                    //@ts-ignore
                    value={articles?.data?.find((option: IArticle) => option.slug === answers?.[index - 1]?.link)}
                    onChange={(_, e) => handleAnswerLink(e, index - 1)}
                    //@ts-ignore
                    renderInput={params => <TextField {...params} label='Article' />}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(Number(answers?.[index - 1]?.status))}
                        onChange={e => handleChangeActual(e, index - 1)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label='Correct'
                    labelPlacement='start'
                  />
                  <IconButton onClick={() => removeAnswer(index - 1)}>
                    <Delete />
                  </IconButton>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem'
                  }}
                >
                  <ToggleButtonGroup
                    color='primary'
                    value={index}
                    exclusive
                    onChange={(_, value) => value && setIndex(value)}
                    aria-label='Language'
                  >
                    {answers?.map((_, i) => (
                      <ToggleButton value={i + 1}>{i + 1}</ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <Button variant='contained' color='success' onClick={addAnswer}>
                    Add
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size='small'
                    value={answers?.[index - 1]?.name?.[alignment] || ''}
                    onChange={e => handleAnswerName(e, index - 1)}
                    multiline
                    fullWidth
                    required
                    label={'Title'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MyEditor
                    value={answers?.[index - 1]?.description?.[alignment] || ''}
                    setValue={e => handleAnswerDescription(e, index - 1)}
                    height={400}
                  />
                </Grid>
                {/* <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                >
                  {answers?.[index - 1]?.photos?.map((photo, i) => (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <FileUploaderSingle
                        type='news'
                        images={photo}
                        setImage={(el: string) => editAnswerImage(index - 1, i, el)}
                      />
                      <IconButton onClick={() => deleteAnswerImage(index - 1, i)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                  <Button onClick={() => addAnswerImage(index - 1)} variant='contained' color='success'>
                    Add
                  </Button>
                </Grid> */}
              </>
            )}
          </Grid>
        </form>
      </Box>
    </>
  )
}

export default QuestionsForm
