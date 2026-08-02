import { request } from '../../../utils/request'

export const GET_NOTIFICATIONS = async (params: any) => {
  const response = await request({
    url: '/dashboard/admin/notification/feedback',
    params: params,
    method: 'GET'
  })

  return response?.data
}
