import { request } from '../../utils/request'

export const CREATE_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/categories',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/categories/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_CATEGORY = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/categories/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_CATEGORY = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/categories/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}

export const BULK_DELETE_CHILD_CATEGORY = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/categories/categories/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}

export const BULK_DELETE_CHILD_ARTICLE = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/categories/articles/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}
