import { request } from '../../utils/request'

export const CREATE_PARTNER = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/partners',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_PARTNER = async (data: any) => {
  const response = await request({
    url: '/dashboard/admin/partners/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_PARTNER = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/partners/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_PARTNER = async (data: string[]) => {
  const response = await request({
    url: '/dashboard/admin/partners/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
