import { request } from '../../utils/request'

export const GET_TARIFFS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/tariffs',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_TARIFF = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/tariffs/' + id,
    method: 'GET'
  })

  return response?.data
}

export const GET_TARIFFS_INTERVAL = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/terms',
    params: params,
    method: 'GET'
  })

  return response?.data
}
