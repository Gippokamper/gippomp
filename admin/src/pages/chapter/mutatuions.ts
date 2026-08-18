import { request } from '../../utils/request'

export const CREATE_CHAPTER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/chapters',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_CHAPTER = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/chapters/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_CHAPTER = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/chapters/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_CHAPTERS = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/chapters/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
