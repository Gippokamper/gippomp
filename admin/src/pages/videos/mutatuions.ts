import { request } from '../../utils/request'

export const CREATE_VIDEOS = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/videos',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_VIDEOS = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/videos/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_VIDEOS = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/videos/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_VIDEOS = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/videos/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}

export const BULK_DELETE_CHILD_VIDEOS = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/videos/categories/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}

export const BULK_DELETE_CHILD_ARTICLE = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/videos/articles/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}
