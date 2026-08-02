import { request } from '../../utils/request'

export const GET_LABS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/laboratory',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_LAB = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/laboratory/' + id,
    method: 'GET'
  })

  return response?.data
}
