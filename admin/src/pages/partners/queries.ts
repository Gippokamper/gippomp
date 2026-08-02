import { request } from '../../utils/request'

export const GET_PARTNERS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/partners',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_PARTNER = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/partners/' + id,
    method: 'GET'
  })

  return response?.data
}
