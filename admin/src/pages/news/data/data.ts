import { ITranslation } from '../../category/data/data'

export interface INews {
  id: number
  slug: string
  photo: string
  title: ITranslation
  description: ITranslation
  date: string
  actual: boolean
}

export const news: INews[] = [
  {
    id: 5,
    slug: 'anatomik-atamalar4qw',
    photo: '/asdasd/asdasd',
    title: {
      ru: 'Anatomik atamalar4qw',
      uz: 'Anatomik atamalar3',
      en: 'Anatomik atamalar3'
    },
    description: {
      ru: 'asd',
      uz: 'asd',
      en: 'asd'
    },
    date: '2023-01-01 12:00:00',
    actual: true
  }
]
