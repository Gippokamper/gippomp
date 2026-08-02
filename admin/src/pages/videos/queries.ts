import { request } from '../../utils/request'

export const GET_VIDEOS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/videos',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_VIDEO = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/videos/' + id,
    method: 'GET'
  })

  return response?.data
}
