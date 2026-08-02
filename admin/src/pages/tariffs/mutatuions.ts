import { request } from '../../utils/request'

export const CREATE_TARIFF = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/tariffs',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_TARIFF = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/tariffs/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_TARIFF = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/tariffs' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_TARIFF = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/tariffs/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}
