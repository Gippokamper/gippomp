import { request } from '../../helpers/request'

export const LOGIN = async (data: any) => {
  const response = await request({
    url: 'auth/login',
    method: 'POST',
    data: data
  })

  return response.data
}
