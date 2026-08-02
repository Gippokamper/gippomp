import { request } from '../../helpers/request'

export const FORGOT_PASSWORD = async (data: any) => {
  const response = await request({
    url: 'forgot_password/send_code',
    method: 'POST',
    data: data
  })

  return response.data
}

export const FORGOT_SEND_CODE = async (data: any) => {
  const response = await request({
    url: 'forgot_password/check_code',
    method: 'POST',
    data: data
  })

  return response.data
}

export const SET_PASSWORD = async (data: any) => {
  const response = await request({
    url: 'forgot_password/new_password',
    method: 'POST',
    data: data
  })

  return response.data
}
