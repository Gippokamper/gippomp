import { request } from '../../utils/request'

export const CREATE_IMAGE = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/article_note_photos',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_IMAGE = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/article_note_photos/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_IMAGE = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/article_note_photos/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_IMAGES = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/article_note_photos/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
