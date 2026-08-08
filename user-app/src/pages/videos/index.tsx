import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import { MainLayout } from '../../layouts/main'
import VideoModal from '../../components/vedio-modal'
import Modal, { IModal } from '../../components/modal'
import LockIcon from '../../img/icons/LockIcon'
import SaveButton from '../../components/save-button'
import lightIcon from '../../img/icons/cash.svg'
import darkIcon from '../../img/icons/cash-dark.svg'
import { AuthContext } from '../../providers/auth-provider'
import { request } from '../../helpers/request'
import { youtubeThumb } from '../../helpers/youtube'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import './videos.scss'

interface IVideo {
  id: number
  slug: string
  name?: Record<string, string>
  link?: string
  paid?: boolean
  is_saved?: boolean
  /** Resursda shunday nomlangan — aslida to'liq kategoriyalar ro'yxati. */
  category_ids?: { id: number; slug: string; name?: Record<string, string> }[]
}

interface IGenre {
  id: number
  slug: string
  name?: Record<string, string>
}

type Sort = 'new' | 'old' | 'name'

const PER_PAGE = 12

const SearchIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
    <path d='M20 20l-3.5-3.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

const PlayIcon = () => (
  <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M8 5.14v13.72a1 1 0 0 0 1.54.84l10.5-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z' />
  </svg>
)

export const Videos = () => {
  const { i18n, t } = useTranslation()
  const { userPermissions } = useContext(AuthContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const handleApiError = useApiErrorHandler()

  const [playing, setPlaying] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort>('new')

  /* Eski `/videos/anatomiya` ko'rinishidagi havolalar ishlashda davom etsin —
     yo'ldagi slug shunchaki tanlangan janrga aylanadi. */
  const initialGenre = useMemo(() => pathname.split('/').filter(Boolean).slice(1)[0] ?? '', [pathname])
  const [genres, setGenres] = useState<string[]>(initialGenre ? [initialGenre] : [])

  // Yozilayotgan paytda har harfga so'rov ketmasin.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data: genreData } = useQuery(
    ['video-genres'],
    async () => {
      const response: any = await request({
        url: 'dashboard/user/video_categories',
        method: 'GET',
        params: { perPage: 100 }
      })
      return (response?.data?.data ?? []) as IGenre[]
    },
    { onError: handleApiError }
  )

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['videos', search, sort, genres.join(',')],
    async ({ pageParam = 1 }) => {
      const response: any = await request({
        url: 'dashboard/user/videos',
        method: 'GET',
        params: { page: pageParam, perPage: PER_PAGE, search, sort, categories: genres }
      })
      return response?.data
    },
    {
      getNextPageParam: (last: any) => {
        const meta = last?.meta
        return meta && meta.current_page < meta.last_page ? meta.current_page + 1 : undefined
      },
      onError: handleApiError
    }
  )

  const videos: IVideo[] = useMemo(
    () => (data?.pages ?? []).flatMap((page: any) => page?.data ?? []),
    [data]
  )

  const total = data?.pages?.[0]?.meta?.total ?? videos.length

  const canWatch = !!userPermissions?.includes('videos')

  const openVideo = (video: IVideo) => {
    if (video.paid && !canWatch) {
      setModalOpen(true)
      return
    }
    setPlaying(video.link ?? '')
  }

  const toggleGenre = (slug: string) =>
    setGenres(prev => (prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]))

  const modalProps: IModal = useMemo(
    () => ({
      title: t('Make an additional payment'),
      description: t('Your previous payment is not enough to purchase the tariff, so make an additional payment'),
      onAccept: () => {
        setModalOpen(false)
        navigate('/account?type=tariffs')
      },
      close: () => setModalOpen(false),
      acceptTitle: t('Purchase'),
      lightIcon: lightIcon,
      darkIcon: darkIcon,
      isOpen: modalOpen
    }),
    [modalOpen, navigate, t]
  )

  const renderCard = (video: IVideo) => {
    const locked = !!video.paid && !canWatch
    const thumb = youtubeThumb(video.link)
    const label = video.name?.[i18n.language] || video.slug
    const tags = (video.category_ids ?? []).map(c => c.name?.[i18n.language] || c.slug).join(' · ')

    // Saqlash tugmasi kartochkaning YONIDA — tugma ichiga tugma joylash
    // yaroqsiz HTML bo'lardi. Ustida ko'rinishini stil hal qiladi.
    return (
      <li key={video.id} className='vid-item'>
        <SaveButton compact type='video' id={video.id} saved={video.is_saved} />
        <button type='button' className={`vid-card ${locked ? 'is-locked' : ''}`} onClick={() => openVideo(video)}>
          <span className='vid-card__poster'>
            {thumb ? (
              <img src={thumb} alt='' loading='lazy' />
            ) : (
              <span className='vid-card__blank' aria-hidden='true' />
            )}
            <span className='vid-card__badge'>{locked ? <LockIcon /> : <PlayIcon />}</span>
          </span>
          <span className='vid-card__title'>{label}</span>
          {!!tags && <span className='vid-card__tags'>{tags}</span>}
        </button>
      </li>
    )
  }

  const renderGrid = () => {
    if (isLoading) {
      return (
        <ul className='vid-grid'>
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <Skeleton className='ui-skeleton vid-skeleton' />
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

    if (!videos.length) {
      return (
        <div className='ui-empty'>
          <span className='ui-empty__title'>{t('Nothing found')}</span>
        </div>
      )
    }

    return (
      <>
        <ul className='vid-grid'>{videos.map(renderCard)}</ul>
        {hasNextPage && (
          <div className='vid-more'>
            <button
              type='button'
              className='ui-btn ui-btn--ghost'
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {t('Load more')}
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <MainLayout>
      <section className='vid'>
        <div className='ui-head'>
          <h1 className='ui-title'>{t('Videos')}</h1>
          {!isLoading && <span className='ui-count'>{total}</span>}
        </div>

        <div className='vid-bar'>
          <label className='vid-search'>
            <SearchIcon />
            <input
              type='search'
              value={searchInput}
              placeholder={t('Search')}
              onChange={e => setSearchInput(e.target.value)}
            />
          </label>

          <select className='vid-sort' value={sort} onChange={e => setSort(e.target.value as Sort)}>
            <option value='new'>{t('Newest')}</option>
            <option value='old'>{t('Oldest')}</option>
            <option value='name'>{t('By name')}</option>
          </select>
        </div>

        {/* Janrlar — bir nechtasini birga tanlash mumkin. */}
        {!!genreData?.length && (
          <div className='ui-chips'>
            <button
              type='button'
              className={`ui-chip ${genres.length === 0 ? 'is-active' : ''}`}
              onClick={() => setGenres([])}
            >
              {t('All')}
            </button>
            {genreData.map(genre => (
              <button
                key={genre.id}
                type='button'
                className={`ui-chip ${genres.includes(genre.slug) ? 'is-active' : ''}`}
                onClick={() => toggleGenre(genre.slug)}
              >
                {genre.name?.[i18n.language] || genre.slug}
              </button>
            ))}
          </div>
        )}

        {renderGrid()}
      </section>

      <VideoModal close={() => setPlaying('')} url={playing} />
      <Modal {...modalProps} />
    </MainLayout>
  )
}
