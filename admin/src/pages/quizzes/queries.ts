import { request } from '../../utils/request'

export const GET_STUDY_PLANS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/quizzes',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_STUDY_PLAN = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/quizzes/' + id,
    method: 'GET'
  })

  return response?.data
}
