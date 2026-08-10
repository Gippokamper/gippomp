import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'

import { request } from '../../helpers/request'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import './save-button.scss'

export type SavableType = 'article' | 'video' | 'news'

interface IProps {
  type: SavableType
  id: number
  /** Serverdan kelgan boshlang'ich holat. */
  saved?: boolean
  /** Kartochka ustida turganda kichikroq bo'lsin. */
  compact?: boolean
  /**
   * Maqola asboblar qatorida — faqat belgi, lekin oqimda turadi.
   * `compact` dan farqi shu: u `position: absolute` bilan muqova burchagiga
   * yopishadi, bu esa oddiy flex elementi.
   */
  inline?: boolean
}

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill={filled ? 'currentColor' : 'none'} aria-hidden='true'>
    <path
      d='M6.5 4.5h11a1 1 0 0 1 1 1v14.2a.6.6 0 0 1-.94.5L12 16.4l-5.56 3.8a.6.6 0 0 1-.94-.5V5.5a1 1 0 0 1 1-1Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

/**
 * Materialni "Saqlanganlar"ga qo'shadi yoki oradan oladi.
 *
 * Holat darrov almashadi (optimistik), server javob bermasa — qaytariladi.
 * Aks holda tugma bosilgandan keyin bir zum javobsiz turardi.
 */
function SaveButton({ type, id, saved = false, compact, inline }: IProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const handleApiError = useApiErrorHandler()

  const [isSaved, setIsSaved] = useState(saved)

  // Ro'yxat qayta yuklansa (masalan filtr o'zgardi) — serverdagi holatga qaytamiz.
  useEffect(() => setIsSaved(saved), [saved])

  const { mutate, isLoading } = useMutation(
    async () => {
      const response: any = await request({ url: `dashboard/user/saves/${type}/${id}`, method: 'POST' })
      return !!response?.data?.data?.saved
    },
    {
      onSuccess: value => {
        setIsSaved(value)
        queryClient.invalidateQueries(['saves'])
      },
      onError: error => {
        setIsSaved(prev => !prev) // orqaga qaytaramiz
        handleApiError(error)
      }
    }
  )

  const actionLabel = isSaved ? t('Remove from saved') : t('Save')

  return (
    <button
      type='button'
      className={`save-btn ${isSaved ? 'is-saved' : ''} ${compact ? 'is-compact' : ''} ${inline ? 'is-inline' : ''}`}
      aria-pressed={isSaved}
      /*
       * Yorliqsiz variantda tugmaning nomi o'zgarmas bo'lishi kerak — holatni
       * `aria-pressed` aytadi. Almashinuvchi nom bilan ekran o'quvchi
       * "Saqlanganlardan olib tashlash, bosilgan" degan qarama-qarshi gap
       * tuzardi.
       */
      aria-label={inline ? t('Save') : undefined}
      /*
       * Ixcham qatorda maslahat oynachasini CSS chizadi (`data-tip`) — u,
       * brauzerning `title` idan farqli o'laroq, klaviatura fokusida ham
       * chiqadi. Ikkalasi bir vaqtda chiqmasin.
       */
      title={inline ? undefined : actionLabel}
      data-tip={inline ? actionLabel : undefined}
      disabled={isLoading}
      onClick={event => {
        // Kartochka ichida bo'lsa — bosish materialni ochib yubormasin.
        event.preventDefault()
        event.stopPropagation()
        setIsSaved(prev => !prev)
        mutate()
      }}
    >
      <BookmarkIcon filled={isSaved} />
      {!compact && !inline && <span>{isSaved ? t('Saved') : t('Save')}</span>}
    </button>
  )
}

export default SaveButton
