import { request } from '../../utils/request'

export const GET_VOCABULARIES = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/vocabulary',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_VOCABULARY = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/vocabulary/' + id,
    method: 'GET'
  })

  return response?.data
}
