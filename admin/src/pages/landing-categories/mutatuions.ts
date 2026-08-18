import { request } from '../../utils/request'

export const CREATE_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/category_landing',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/category_landing/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_CATEGORY = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/category_landing/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_CATEGORY = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/category_landing/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
