import { request } from '../../utils/request'

export const GET_QUESTIONS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/questions',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_QUESTION = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/questions/' + id,
    method: 'GET'
  })

  return response?.data
}
