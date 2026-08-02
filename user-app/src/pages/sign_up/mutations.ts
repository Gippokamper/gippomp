import { request } from '../../helpers/request'

export const REGISTER = async (data: any) => {
  const response = await request({
    url: 'auth/register',
    method: 'POST',
    data: data
  })

  return response.data
}
