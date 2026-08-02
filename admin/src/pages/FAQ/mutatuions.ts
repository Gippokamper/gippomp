import { request } from '../../utils/request'

export const CREATE_FAQ = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/quiz_landing',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_FAQ = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/quiz_landing/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_FAQ = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/quiz_landing/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_FAQ = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/quiz_landing/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
