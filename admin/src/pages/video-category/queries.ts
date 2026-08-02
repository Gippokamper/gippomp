import { request } from '../../utils/request'

export const GET_VIDEO_CATEGORIES = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/video_categories',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_VIDEO_CATEGORY = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/video_categories/' + id,
    method: 'GET'
  })

  return response?.data
}
