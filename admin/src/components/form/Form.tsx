import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

export interface IChildrenProps {
  create: any
  createInfo: any
  createArray: any
  createArrayInfo: any
  update: any
  updateInfo: any
  get: any
  getInfo: any
  handleFinish: (values: any, type?: string) => void
  register: any
  control: any
  handleSubmit: any
  setValue: any
  getValues: any
  errors: any
  isSubmitting: boolean
}
export interface ICollectionForm {
  createMutation: any
  updateMutation: any
  createArrayMutation?: any
  getQuery: any
  name: string
  children: (props: IChildrenProps) => JSX.Element
  handleFinish?: (values: any) => void
  errorMessage?: string
  customVariables?: object[] | undefined
  initialValues?: any
  pageName?: string
}

export default function Form(props: ICollectionForm) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors }
  } = useForm()

  const getInfo = useQuery([props.name, searchParams.get('id')], () => props.getQuery(searchParams.get('id')), {
    enabled: !!searchParams.get('id'),
    onSuccess: (value: any) => {
      if (searchParams.has('onAdd')) {
        reset(props.initialValues)
        return
      }
      reset(props.name === 'Countries-details' ? value?.data?.details : value?.data)
    }
  })

  useEffect(() => {
    if (searchParams.get('onAdd')) {
      reset(props.initialValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('onAdd')])
  const { refetch: get } = getInfo

  // Drawer'ni yopish: ilgari navigate(-1) chaqirilardi va u ko'pincha admin'ni
  // butunlay boshqa sahifaga tashlab yuborardi. Endi faqat param'lar tozalanadi.
  const closeDrawer = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('id')
      next.delete('onAdd')
      return next
    })
  }

  // Ro'yxatni yangilash: ilgari to'liq (pageName + pagination + til + qidiruv)
  // kalit bilan refetch qilinardi va u ro'yxatning haqiqiy kalitiga mos kelmasa
  // (yoki pageName berilmagan bo'lsa) jadval eski holicha qolardi.
  // invalidateQueries prefiks bo'yicha ishlaydi — barcha sahifalar yangilanadi.
  const refreshCollection = () => {
    if (props.pageName) queryClient.invalidateQueries([props.pageName])
    queryClient.invalidateQueries([props.name])
  }

  // Xato toast'i request.ts (axios interceptor) darajasida chiqadi va u Laravel
  // validatsiya xatolarini maydon bo'yicha ko'rsatadi — bu yerda takrorlamaymiz.
  const showError = (err: any) => {
    console.error(props.name, err)
  }

  const createInfo = useMutation(props.createMutation, {
    onSuccess: () => {
      refreshCollection()
      reset(props.initialValues)
      closeDrawer()
      toast.success(t('Created'))
    },
    onError: showError
  })
  const { mutate: create } = createInfo
  const createArrayInfo = useMutation(props.createArrayMutation, {
    onSuccess: () => {
      refreshCollection()
      reset(props.initialValues)
      closeDrawer()
      toast.success(t('Created'))
    },
    onError: showError
  })
  const { mutate: createArray } = createArrayInfo
  const updateInfo = useMutation(props.updateMutation, {
    onSuccess: () => {
      refreshCollection()
      closeDrawer()
      toast.success(t('Updated'))
    },
    // Xato bo'lganda forma tozalanmaydi — admin kiritgan ma'lumotini yo'qotmaydi.
    onError: showError
  })
  const { mutate: update } = updateInfo

  async function handleFinish(values: any) {
    const id = searchParams.get('id')

    if (id) {
      // id — URL'dan (Users'da bu uuid). values ichidagi id undan ustun emas.
      update({ ...values, id })
    } else {
      values.arrays ? createArray(values) : create(values)
    }
  }

  return props.children({
    create,
    createInfo,
    createArray,
    createArrayInfo,
    update,
    updateInfo,
    get,
    getInfo,
    handleFinish,
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    errors,
    isSubmitting: createInfo.isLoading || updateInfo.isLoading || createArrayInfo.isLoading
  })
}
