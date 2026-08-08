import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import { MainLayout } from '../../layouts/main'
import Article from '../../img/icons/Article'
import VideoCard from '../../components/vedio-card'
import SaveButton, { SavableType } from '../../components/save-button'
import VideoModal from '../../components/vedio-modal'
import { request } from '../../helpers/request'
import { youtubeThumb } from '../../helpers/youtube'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import './saved.scss'

interface ISavedItem {
  id: number
  type: SavableType
  saved_at: string
  item: {
    id: number
    slug: string
    name?: Record<string, string>
    link?: string
    paid?: boolean
  }
}

const FILTERS: { value: '' | SavableType; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'article', label: 'Library' },
  { value: 'video', label: 'Videos' },
  { value: 'news', label: 'News' }
]

export const Saved = () => {
  const { i18n, t } = useTranslation()
  const handleApiError = useApiErrorHandler()

  const [type, setType] = useState<'' | SavableType>('')
  const [playing, setPlaying] = useState('')

  const { data, isLoading, isError, refetch } = useQuery(
    ['saves', type],
    async () => {
      const response: any = await request({
        url: 'dashboard/user/saves',
        method: 'GET',
        params: { type, perPage: 50 }
      })
      return (response?.data?.data?.data ?? []) as ISavedItem[]
    },
    { onError: handleApiError }
  )

  const items = useMemo(() => data ?? [], [data])

  const renderItem = (saved: ISavedItem) => {
    const label = saved.item.name?.[i18n.language] || saved.item.slug
    const thumb = saved.type === 'video' ? youtubeThumb(saved.item.link) : ''

    const body = (
      <>
        <span className='saved-card__icon'>
          {saved.type === 'video' ? <VideoCard /> : <Article />}
        </span>
        <span className='saved-card__label'>{label}</span>
      </>
    )

    return (
      <li className='saved-item' key={`${saved.type}-${saved.item.id}`}>
        <SaveButton compact type={saved.type} id={saved.item.id} saved />

        {saved.type === 'video' ? (
          <button type='button' className='saved-card' onClick={() => setPlaying(saved.item.link ?? '')}>
            {!!thumb && (
              <span className='saved-card__poster'>
                <img src={thumb} alt='' loading='lazy' />
              </span>
            )}
            {body}
          </button>
        ) : (
          <Link
            className='saved-card'
            to={saved.type === 'news' ? `/news/${saved.item.id}` : `/article/${saved.item.slug}`}
          >
            {body}
          </Link>
        )}
      </li>
    )
  }

  const renderBody = () => {
    if (isLoading) {
      return (
        <ul className='saved-list'>
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <Skeleton className='ui-skeleton saved-skeleton' />
            </li>
          ))}
        </ul>
      )
    }

    if (isError) {
      return (
        <div className='ui-empty' role='alert'>
          <span className='ui-empty__title'>{t('Failed to load')}</span>
          <button type='button' className='ui-btn ui-btn--primary' onClick={() => refetch()}>
            {t('Try again')}
          </button>
        </div>
      )
    }

    if (!items.length) {
      return (
        <div className='ui-empty'>
          <span className='ui-empty__title'>{t('Nothing saved yet')}</span>
          <span className='ui-empty__hint'>{t('Save materials to find them here')}</span>
        </div>
      )
    }

    return <ul className='saved-list'>{items.map(renderItem)}</ul>
  }

  return (
    <MainLayout>
      <section className='saved'>
        <div className='ui-head'>
          <h1 className='ui-title'>{t('Saved')}</h1>
          {!isLoading && <span className='ui-count'>{items.length}</span>}
        </div>

        <div className='ui-chips'>
          {FILTERS.map(filter => (
            <button
              key={filter.value || 'all'}
              type='button'
              className={`ui-chip ${type === filter.value ? 'is-active' : ''}`}
              onClick={() => setType(filter.value)}
            >
              {t(filter.label)}
            </button>
          ))}
        </div>

        {renderBody()}
      </section>

      <VideoModal close={() => setPlaying('')} url={playing} />
    </MainLayout>
  )
}
