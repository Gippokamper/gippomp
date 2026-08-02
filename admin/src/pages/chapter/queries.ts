import { request } from '../../utils/request'

export const GET_CHAPTERS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/chapters',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_CHAPTER = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/chapters/' + id,
    method: 'GET'
  })

  return response?.data
}
