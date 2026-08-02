import { ITranslation } from '../../articles/data/data'

export interface IImage {
  id: number
  photo: string
  marker_photo: string
  title: ITranslation
  description: ITranslation
}

export const images: IImage[] = [
  {
    id: 1,
    title: {
      uz: 'comment uz',
      ru: 'comment ru',
      en: 'comment en'
    },
    photo: 'http://localhost/asd/asda.phg',
    marker_photo: 'http://localhost/asd/asda.phg',
    description: {
      uz: 'Description uz',
      ru: 'Description ru',
      en: 'Description en'
    }
  }
]
