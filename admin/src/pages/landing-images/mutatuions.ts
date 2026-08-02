import { request } from '../../utils/request'

export const CREATE_IMAGE = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/photos_landing',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_IMAGE = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/photos_landing/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_IMAGE = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/photos_landing' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_IMAGE = async (data: string[]) => {
  const response = await request({
    url: '/dashboard/admin/photos_landing/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
