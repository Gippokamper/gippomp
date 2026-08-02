import { request } from '../../utils/request'

export const LOGIN = async (data: any) => {
  const response = await request({
    url: '/auth/login',
    data: data,
    method: 'POST'
  })

  return response.data
}
