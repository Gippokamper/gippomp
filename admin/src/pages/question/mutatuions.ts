import { request } from '../../utils/request'

export const CREATE_QUESTION = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/questions',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_QUESTION = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/questions/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_QUESTION = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/questions' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_QUESTIONS = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/questions/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
