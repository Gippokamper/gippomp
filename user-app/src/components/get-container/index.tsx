import { useQuery } from 'react-query'
import { request } from '../../helpers/request'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'

interface IProps {
  url: string
  enabled?: boolean
  params?: object
  children: (props: any) => JSX.Element
  onSuccess?: (data: any) => void
  onError?: (data: any) => void
}

function GetContainer(props: IProps) {
  // Yo'naltirish mantig'i use-api-error-handler'ga ko'chirildi — useQueries
  // ishlatadigan sahifalar ham aynan shu xulqni oladi.
  const handleApiError = useApiErrorHandler()

  const { data, isLoading, error, isError, refetch } = useQuery(
    [props.url, ...(props?.params ? Object.values(props.params) : [])],
    async () => {
      const response: any = await request({
        url: props.url,
        params: props.params,
        method: 'GET'
      })
      return response.data
    },
    {
      enabled: !!props.url,
      onSuccess: (data: any) => props.onSuccess && props.onSuccess(data),
      onError: handleApiError
    }
  )
  return props.children({ data, isLoading, error, isError, refetch })
}

export default GetContainer
