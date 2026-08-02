import { ITranslation } from '../../category/data/data'

export interface ILabs {
  id: number
  name: ITranslation
  description: ITranslation
}

export const news: ILabs[] = [
  {
    id: 5,
    name: {
      ru: 'Anatomik atamalar4qw',
      uz: 'Anatomik atamalar3',
      en: 'Anatomik atamalar3'
    },
    description: {
      ru: 'asd',
      uz: 'asd',
      en: 'asd'
    }
  }
]
