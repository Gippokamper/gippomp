import { request } from '../../utils/request'

export const CREATE_VOCABULARY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/vocabulary',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_VOCABULARY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/vocabulary/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_VOCABULARY = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/vocabulary/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_VOCABULARY = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/vocabulary/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
