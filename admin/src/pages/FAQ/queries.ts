import { request } from '../../utils/request'

export const GET_FAQS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/quiz_landing',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_FAQ = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/quiz_landing/' + id,
    method: 'GET'
  })

  return response?.data
}
