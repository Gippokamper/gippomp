import { ITranslation } from '../../category/data/data'

export interface IComment {
  id: number
  title: ITranslation
  description: ITranslation
}

export const comments = [
  {
    id: 1,
    title: {
      uz: 'comment uz',
      ru: 'comment ru',
      en: 'comment en'
    },
    description: {
      uz: 'Description uz',
      ru: 'Description ru',
      en: 'Description en'
    }
  }
]
