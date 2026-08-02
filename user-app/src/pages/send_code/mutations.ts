import { request } from '../../helpers/request'

export const SEND_CODE = async (data: any) => {
  const response = await request({
    url: 'phone/verification',
    method: 'POST',
    data: data
  })

  return response.data
}
