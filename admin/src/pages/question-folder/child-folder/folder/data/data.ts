import { IFolders, ITranslation } from '../../data/data'

export interface IQuestionMin {
  id: number
  name: ITranslation
}

export const questions: IQuestionMin[] = [
  {
    id: 9,
    name: {
      ru: 'Farmakologiya',
      uz: 'Farmakologiya',
      en: 'Farmakologiya'
    }
  }
]

export interface IQuestion {
  id: number
  folder_ids: IFolders[]
  additional_info: ITranslation
  photo: {
    photo: string
    info: string
  }
  answers: [
    {
      id: number
      name: ITranslation
      status: '0' | boolean
    }[]
  ]
  name: ITranslation
}
