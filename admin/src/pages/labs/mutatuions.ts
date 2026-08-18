import { request } from '../../utils/request'

export const CREATE_LAB = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/laboratory',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_LAB = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/laboratory/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_LAB = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/laboratory/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_LABS = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/laboratory/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
