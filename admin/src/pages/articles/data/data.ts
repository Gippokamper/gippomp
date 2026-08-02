import { ICategory } from '../../category/data/data'

export interface ITranslation {
  en: string
  uz: string
  ru: string
}

export interface IArticle {
  id: number
  sort: number[]
  category_ids: ICategory[]
  name: ITranslation
  status: boolean
  paid: boolean
}

export const category1: ICategory = {
  id: 1,
  category_ids: [],
  // Bo'sh massiv yoki o'z ichida boshqa "ICategory" obyektlari
  sort: [1],
  name: {
    en: 'Category 1',
    uz: 'Kategoriya 1',
    ru: 'Категория 1'
  },
  status: true,
  paid: false
}

export const article: IArticle = {
  id: 2,
  category_ids: [category1], // "category1" obyektini o'z ichiga olgan massiv
  name: {
    en: 'Category 2',
    uz: 'Kategoriya 2',
    ru: 'Категория 2'
  },
  status: false,
  paid: true,
  sort: [2]
}

// Va hokazo...
