import { request } from '../../utils/request'

export const GET_CATEGORIES = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/categories',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_CATEGORY = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/categories/' + id,
    method: 'GET'
  })

  return response?.data
}
