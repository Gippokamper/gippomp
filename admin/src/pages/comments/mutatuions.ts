import { request } from '../../utils/request'

export const CREATE_COMMENT = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/article_note_texts',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_COMMENT = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/article_note_texts/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_COMMENT = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/article_note_texts' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_COMMENTS = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/article_note_texts/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
