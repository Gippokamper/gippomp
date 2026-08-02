import { request } from '../../utils/request'

export const GET_ARTICLES = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/articles',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_ARTICLE = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/articles/' + id,
    method: 'GET'
  })

  return response?.data
}
