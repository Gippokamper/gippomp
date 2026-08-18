import { request } from '../../utils/request'

// Ro'yxat endpoint'laridan faqat umumiy sonini olamiz (perPage=1 — eng yengil so'rov).
const totalOf = async (url: string, params?: any) => {
  const response = await request({ url, method: 'GET', params: { perPage: 1, ...(params || {}) } })
  return Number(response?.data?.meta?.total ?? 0)
}

export const GET_DASHBOARD_TOTALS = async () => {
  const [articles, videos, quizzes, folders, news, labs, tariffs] = await Promise.all([
    totalOf('/dashboard/admin/articles'),
    totalOf('/dashboard/admin/videos'),
    totalOf('/dashboard/admin/quizzes'),
    totalOf('/dashboard/admin/folders'),
    totalOf('/dashboard/admin/news'),
    totalOf('/dashboard/admin/laboratory'),
    totalOf('/dashboard/admin/tariffs')
  ])

  return { articles, videos, quizzes, folders, news, labs, tariffs }
}
