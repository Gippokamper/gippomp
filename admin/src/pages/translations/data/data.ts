export interface ITranslation {
  id: number
  key: string
  translation: { uz: string; ru: string; en: string }
}

export const translations: ITranslation[] = [
  {
    id: 1,
    key: 'hello',
    translation: { uz: 'Salom', ru: 'Privet', en: 'Hello' }
  }
]
