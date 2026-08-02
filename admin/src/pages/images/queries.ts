import { request } from '../../utils/request'

export const GET_IMAGES = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/article_note_photos',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_IMAGE = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/article_note_photos/' + id,
    method: 'GET'
  })

  return response?.data
}
