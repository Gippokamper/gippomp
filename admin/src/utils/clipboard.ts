import { toast } from 'react-hot-toast'

// navigator.clipboard faqat xavfsiz kontekstda (https/localhost) mavjud.
// Ilgari nusxa olish jimgina muvaffaqiyatsiz tugashi mumkin edi — endi
// natijasi haqida doim xabar beriladi.
export const copyCode = (text: string) => {
  if (!navigator?.clipboard) {
    toast.error('Brauzer nusxa olishni qo‘llab-quvvatlamaydi')
    return
  }
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success('Nusxa olindi'))
    .catch(() => toast.error('Nusxa olib bo‘lmadi'))
}
