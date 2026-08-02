export interface ITranslation {
  en: string
  uz: string
  ru: string
}

export interface IFolders {
  id: number
  sort: number[]
  folders_ids: IFolders[]
  name: ITranslation
  slug: string
}

export const folder1: IFolders = {
  id: 1,
  folders_ids: [],
  sort: [1],
  name: {
    en: 'Category 1',
    uz: 'Kategoriya 1',
    ru: 'Категория 1'
  },
  slug: 'asd'
}

export const folder2: IFolders = {
  id: 2,
  folders_ids: [folder1],
  name: {
    en: 'Category 2',
    uz: 'Kategoriya 2',
    ru: 'Категория 2'
  },
  sort: [2],
  slug: 'asd'
}

export const categoryArr = [folder1, folder2]
