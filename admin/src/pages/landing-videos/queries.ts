import { request } from '../../utils/request'

export const GET_VIDEOS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/videos_landing',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_VIDEO = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/videos_landing/' + id,
    method: 'GET'
  })

  return response?.data
}
