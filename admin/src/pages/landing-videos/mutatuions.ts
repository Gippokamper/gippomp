import { request } from '../../utils/request'

export const CREATE_VIDEO = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/videos_landing',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_VIDEO = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/videos_landing/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_VIDEO = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/videos_landing' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_VIDEO = async (data: string[]) => {
  const response = await request({
    url: '/dashboard/admin/videos_landing/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
