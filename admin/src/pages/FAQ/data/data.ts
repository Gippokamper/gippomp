export interface IFAQS {
  id: number
  question: { uz: string; ru: string; en: string }
  answer: { uz: string; ru: string; en: string }
}

export const Faqs: IFAQS[] = [
  {
    id: 1,
    question: { uz: 'Salom', ru: 'Privet', en: 'Hello' },
    answer: { uz: 'Salom', ru: 'Privet', en: 'Hello' }
  }
]
