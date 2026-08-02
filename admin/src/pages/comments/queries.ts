import { request } from '../../utils/request'

export const GET_COMMENTS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/article_note_texts',
    params: params,
    method: 'GET'
  })

  return response?.data
}

export const GET_COMMENT = async (id: string) => {
  const response = await request({
    url: '/dashboard/admin/article_note_texts/' + id,
    method: 'GET'
  })

  return response?.data
}
