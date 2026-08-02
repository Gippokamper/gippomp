import { useContext, useEffect } from 'react'

// import capitalize from "../../utils/capitalize";
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TableFilterContext } from '../../context/TableFilterContext'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

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
  const { i18n } = useTranslation()
  const location = useLocation()
  const doesAnyHistoryEntryExist = location.key !== 'default'
  const navigate = useNavigate()

  const { pagination, globalFilter } = useContext(TableFilterContext)
  // ✅ work on refresh entire field array

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
      console.log(!searchParams.get('onAdd'), 'data')
      //@ts-ignore
      if (!searchParams.has('onAdd')) {
        if (props.name === 'Countries-details') {
          reset(value?.data?.details)
        } else {
          console.log('ishladi')
          reset(value?.data)
        }
      } else {
        reset(props.initialValues)
      }
    }
  })

  useEffect(() => {
    if (searchParams.get('onAdd')) {
      reset(props.initialValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('onAdd')])
  const { refetch: get } = getInfo

  const createInfo = useMutation(props.createMutation, {
    onSuccess: async () => {
      navigate(-1)
      if (doesAnyHistoryEntryExist) {
        // navigate(-1)
      } else {
        searchParams.delete('id')
        searchParams.delete('onAdd')
        setSearchParams(searchParams)
      }
      toast.success('Created')

      await queryClient.refetchQueries([
        props.pageName,
        pagination?.pageIndex,
        pagination?.pageSize,
        i18n.language,
        globalFilter
      ])
      reset(props.initialValues)
    },
    onError: (err: any) => {
      toast.error(props.errorMessage || String(err))
    }
  })
  const { mutate: create } = createInfo
  const createArrayInfo = useMutation(props.createArrayMutation, {
    onSuccess: async () => {
      await queryClient.refetchQueries([
        props.pageName,
        pagination?.pageIndex,
        pagination?.pageSize,
        i18n.language,
        globalFilter
      ])

      navigate(-1)
      if (doesAnyHistoryEntryExist) {
        // navigate(-1)
      } else {
        searchParams.delete('id')
        searchParams.delete('onAdd')
        setSearchParams(searchParams)
      }
      toast.success('Updated')

      reset(props.initialValues)
    },
    onError: (err: any) => {
      toast.error(props.errorMessage || String(err))
    }
  })
  const { mutate: createArray } = createArrayInfo
  const updateInfo = useMutation(props.updateMutation, {
    onSuccess: async () => {
      await queryClient.refetchQueries([
        props.pageName,
        pagination?.pageIndex,
        pagination?.pageSize,
        i18n.language,
        globalFilter
      ])
      navigate(-1)
      if (doesAnyHistoryEntryExist) {
        // navigate(-1)
      } else {
        searchParams.delete('id')
        searchParams.delete('onAdd')
        setSearchParams(searchParams)
      }
      reset(props.initialValues)
      toast.success('Created')
    },
    onError: (err: any) => {
      reset(props.initialValues)

      toast.error(props.errorMessage || String(err))
    }
  })
  const { mutate: update } = updateInfo
  //   const [get, getInfo] = useLazyQuery(props.getQuery)

  async function handleFinish(values: any) {
    const id = searchParams.get('id')
    console.log(values, 'values')

    if (id) {
      console.log(values)
      update({ ...values })
    } else {
      values.arrays ? createArray(values) : create(values)
    }
    // props.form.resetFields()
    // searchParams.delete('id')
    // setSearchParams(searchParams)
    reset(props.initialValues)
  }

  useEffect(() => {
    const actionData = [createInfo, updateInfo, createArrayInfo].find(info => info?.isError)
    if (actionData?.error) {
      if (props.errorMessage) {
        toast.error(props.errorMessage)

        return
      }
      //   actionData?.error?.graphQLErrors.forEach((err: any) => {
      //     message.error(
      //       err?.extensions?.message ? t(err.extensions.message) : err.message
      //     )
      //   })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createInfo, updateInfo, createArrayInfo])

  return props.children({
    create,
    createInfo,
    createArray,
    createArrayInfo,
    update,
    updateInfo,
    get,
    getInfo,
    // loading,
    handleFinish,
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    errors
  })
}
