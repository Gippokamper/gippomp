import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import qs from 'qs'

export interface IMultiple {
  remove: string
  set: object
}

const useQueryParams = () => {
  //   const history = useHistory()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
  const set = (key: string, value: string) =>
    setSearchParams({ search: qs.stringify({ ...queryParams, [key]: value }) })

  const setObj = (key: string, value: object) =>
    setSearchParams({ search: qs.stringify({ ...queryParams, [key]: value }) })
  const clear = () => setSearchParams({ search: qs.stringify({}) })

  const append = (values: object) => setSearchParams({ search: qs.stringify({ ...queryParams, ...values }) })

  const remove = (key: string) => {
    let newParams = { ...queryParams }
    if (newParams[key]) {
      delete newParams[key]
    }

    setSearchParams({ search: qs.stringify(newParams) })
  }
  const multiple = ({ remove, set }: IMultiple) => {
    let newParams = { ...queryParams }
    const items = remove.split(',')
    items.forEach(k => {
      if (newParams[k]) {
        delete newParams[k]
      }
    })

    newParams = { ...newParams, ...set }

    setSearchParams({
      search: qs.stringify(remove.includes('*') ? set : newParams)
    })
  }
  const removeMany = (...values: string[]) => {
    let newParams = { ...queryParams }
    values.forEach(k => {
      if (newParams[k] !== undefined) {
        delete newParams[k]
      }
    })

    setSearchParams({ search: qs.stringify(newParams) })
  }

  const has = (key: string) => !!queryParams[key]
  const get = (key: string) => queryParams[key]
  const secureGet = (key: string) => queryParams[key] || ''
  const goBack = () => navigate(-1)

  return {
    values: queryParams,
    set,
    remove,
    clear,
    append,
    has,
    get,
    goBack,
    multiple,
    secureGet,
    removeMany,
    setObj
  }
}

export default useQueryParams
