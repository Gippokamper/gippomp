import { request } from '../../utils/request'

export const CREATE_NEW = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/news',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_NEW = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/news/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_NEW = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/news' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_NEWS = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/news/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
