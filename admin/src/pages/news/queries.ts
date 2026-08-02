import { request } from '../../utils/request'

export const GET_NEWS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/news',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_NEW = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/news/' + id,
    method: 'GET'
  })

  return response?.data
}
