import { request } from '../../utils/request'

export const GET_USERS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/users',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_USER = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/users/' + id,
    method: 'GET'
  })

  return response?.data
}

export const GET_USERS_INFO = async () => {
  const response = await request({
    url: '/dashboard/admin/users/statistics',
    method: 'GET'
  })

  return response?.data
}

export const GET_FEEDBACK = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/feedback',
    method: 'GET',
    params: params
  })
  return response?.data
}
