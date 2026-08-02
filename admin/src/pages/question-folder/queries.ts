import { request } from '../../utils/request'

export const GET_FOLDERS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/folders',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_FOLDER = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/folders/' + id,
    method: 'GET'
  })

  return response?.data
}

export const GET_IDS = async (id: string, params?: any) => {
  const response = await request({
    url: `/dashboard/admin/folders/${id}/questions_string`,
    params: params,
    method: 'GET'
  })

  return response?.data
}
