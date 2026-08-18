import { request } from '../../utils/request'

export const CREATE_ARTICLES = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/articles',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_ARTICLES = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/articles/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_ARTICLES = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/articles/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_ARTICLES = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/articles/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}

export const BULK_DELETE_ARTICLES_CHAPTERS = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/child_relation/articles/chapters/' + data?.id,
    method: 'DELETE',
    data: { ids: [data?.childId] }
  })

  return response.data
}
