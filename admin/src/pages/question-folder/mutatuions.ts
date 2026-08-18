import { request } from '../../utils/request'

export const CREATE_FOLDER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/folders',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_FOLDER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/folders/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_FOLDER = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/folders/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_FOLDER = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/folders/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}

export const BULK_DELETE_CHILD_FOLDER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/folders/folders/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}

export const BULK_DELETE_CHILD_QUESTION = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/folders/questions/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}
