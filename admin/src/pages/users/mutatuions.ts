import { request } from '../../utils/request'

export const CREATE_USER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/users',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_USER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/users/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_USER = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/users/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_USER = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/users/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
