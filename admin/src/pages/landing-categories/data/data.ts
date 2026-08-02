export interface ILandingCategory {
  id: number
  name: { uz: string; ru: string; en: string }
  photo: string
  category_id: number
}

export const translations: ILandingCategory[] = [
  {
    id: 1,
    name: { uz: 'Salom', ru: 'Privet', en: 'Hello' },
    photo: '',
    category_id: 0
  }
]
