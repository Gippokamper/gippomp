import { request } from '../../utils/request'

export const CREATE_VIDEO_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/video_categories',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_VIDEO_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/video_categories/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_VIDEO_CATEGORY = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/video_categories/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_VIDEO_CATEGORY = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/video_categories/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}

export const BULK_DELETE_CHILD_VIDEO_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/video_categories/video_categories/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}

export const BULK_DELETE_CHILD_VIDEOS = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/video_categories/videos/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}
