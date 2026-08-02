export interface ITranslation {
  uz: string
  en: string
  ru: string
}

export interface ITariff {
  id: number
  photo: string
  name: ITranslation
  term_id: {
    id: number
    name: ITranslation
    month_count: number
  }
  advantages: {
    name: ITranslation
    status: boolean
  }[]
  price: number
}

export const tariffs: ITariff[] = [
  {
    id: 1,
    photo: 'https://example.com/photo1.jpg',
    name: {
      uz: 'Tarif Bir',
      en: 'Tariff One',
      ru: 'Тариф Один'
    },
    term_id: {
      id: 1,
      name: { ru: '6 месяцев', uz: '6 oy', en: '6 months' },
      month_count: 1
    },
    advantages: [
      {
        name: {
          uz: 'Afzallik 1',
          en: 'Advantage 1',
          ru: 'Преимущество 1'
        },
        status: true
      },
      {
        name: {
          uz: 'Afzallik 2',
          en: 'Advantage 2',
          ru: 'Преимущество 2'
        },
        status: false
      }
    ],
    price: 100
  },
  {
    id: 2,
    photo: 'https://example.com/photo2.jpg',
    name: {
      uz: 'Tarif Ikki',
      en: 'Tariff Two',
      ru: 'Тариф Два'
    },
    advantages: [
      {
        name: {
          uz: 'Afzallik A',
          en: 'Advantage A',
          ru: 'Преимущество A'
        },
        status: true
      }
    ],
    term_id: {
      id: 1,
      name: { ru: '6 месяцев', uz: '6 oy', en: '6 months' },
      month_count: 1
    },
    price: 200
  }
]
