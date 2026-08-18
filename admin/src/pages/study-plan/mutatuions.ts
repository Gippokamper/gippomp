import { request } from '../../utils/request'

export const CREATE_STUDY_PLAN = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/study_plan',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_STUDY_PLAN = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/study_plan/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_STUDY_PLAN = async (id: string) => {
  const response = await request({
    url: 'dashboard/admin/study_plan/' + id,
    method: 'DELETE'
  })

  return response.data
}

export const BULK_DELETE_STUDY_PLAN = async (data: string[]) => {
  const response = await request({
    url: 'dashboard/admin/study_plan/bulk_delete',
    method: 'DELETE',
    data: data
  })

  return response.data
}

// export const BULK_DELETE_CHILD_STUDY_PLAN = async (data: any) => {
//   const response = await request({
//     url: 'dashboard/admin/child_relation/study_plan/categories/' + data?.id,
//     method: 'DELETE',
//     data: { ids: [data?.childId] }
//   })

//   return response.data
// }

// export const BULK_DELETE_CHILD_ARTICLE = async (data: any) => {
//   const response = await request({
//     url: 'dashboard/admin/child_relation/categories/articles/' + data?.id,
//     method: 'DELETE',
//     data: { ids: [data?.childId] }
//   })

//   return response.data
// }

export const CREATE_STUDY_BLOCK = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/question_blocks',
    method: 'POST',
    data: data
  })

  return response.data
}

export const UPDATE_STUDY_BLOCK = async (data: any) => {
  const response = await request({
    url: 'dashboard/admin/question_blocks/' + data?.id,
    method: 'PUT',
    data: data
  })

  return response.data
}

export const DELETE_STUDY_BLOCK = async (id: any) => {
  const response = await request({
    url: 'dashboard/admin/question_blocks/' + id,
    method: 'DELETE'
  })

  return response.data
}
