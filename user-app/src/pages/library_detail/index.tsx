import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import LibraryLayout from '../../layouts/library'
import uz from '../../img/icons/uz.svg'
import MarkerIcon from '../../img/icons/MarkerIcon'
import MinusIcon from '../../img/icons/MinusIcon'
import PlusIcon from '../../img/icons/PlusIcon'
import DropDownIcon from '../../img/icons/DropDownIcon'
import Play from '../../img/icons/Play'
import FeedbackModal from '../../components/feedback-modal'
import Success from '../../components/notifications/Success'
import WithTooltip from '../../components/with-html/WithTooltip'
import { request } from '../../helpers/request'
import { rememberArticle } from '../../helpers/recent-articles'
import SaveButton from '../../components/save-button'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import { RootState } from '../../store'
import {
  decrement,
  increment,
  openChapter,
  setChapters,
  toggleAddInfo,
  toggleAllChapter,
  toggleChapter,
  toggleShowMarker
} from '../../store/slices/htmlSlice'
import './article.scss'

/** LibraryLayout'dagi scroll konteyneri. */
const SCROLL_CONTAINER_ID = 'nestedRelativeContainerElement'

const CopyIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='9' y='9' width='11' height='11' rx='2' stroke='currentColor' strokeWidth='2' />
    <path d='M5 15V5a2 2 0 0 1 2-2h10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

const ArrowUpIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M12 19V5M5 12l7-7 7 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

export const LibraryDetail = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useDispatch()
  const handleApiError = useApiErrorHandler()
  const { chapters, showAddInfo, showMarker, lang } = useSelector((state: RootState) => state.html)

  const [openFeedback, setOpenFeedback] = useState(false)
  const [chapterId, setChapterId] = useState(0)
  const [searchParams] = useSearchParams()
  const [progress, setProgress] = useState(0)
  /**
   * Ochilgan bo'limlar. Bo'lim matni faqat birinchi marta ochilgandan keyin
   * render qilinadi — ilgari hamma bo'lim HTML'i darhol parse qilinib DOM'ga
   * qo'yilardi va faqat CSS bilan yashirilardi, bu uzun maqolada birinchi
   * ochilishni sezilarli sekinlashtirardi.
   */
  const openedOnce = useRef<Set<number>>(new Set())

  const { data, isLoading } = useQuery(
    ['article', id],
    async () => {
      const response: any = await request({ url: `dashboard/user/articles/${id}`, method: 'GET' })
      return response.data
    },
    { onError: handleApiError, enabled: !!id }
  )

  /*
   * Bosh sahifadagi "Davom ettirish" bloki shu tarixdan o'qiydi.
   * Havolalar `/article/<slug>` ko'rinishida, ya'ni URL'dagi `id` — slug.
   */
  useEffect(() => {
    const name = data?.data?.name
    if (id && name) rememberArticle({ slug: id, name })
  }, [id, data])

  // Sahifadan chiqilganda chap mundarija eski maqolaniki bo'lib qolmasin.
  useEffect(() => {
    return () => {
      dispatch(setChapters([]))
    }
  }, [dispatch])

  // Bo'limlarni Redux'ga ko'chiramiz (chap mundarija ham shu manbadan o'qiydi).
  // Ilgari bu GetContainer'ning onSuccess'ida `articleSlug !== id` tekshiruvi
  // bilan qilinardi — endi so'rov kaliti o'zgarishi o'zi yetarli.
  useEffect(() => {
    const loaded = data?.data?.chapters
    if (!loaded) {
      return
    }
    dispatch(setChapters(loaded))

    const requested = Number(searchParams.get('chapter_id'))
    if (requested) {
      openedOnce.current.add(requested)
      dispatch(openChapter(requested))
    }
  }, [data, dispatch, searchParams])

  const handleToggleChapter = useCallback(
    (index: number, targetId: number) => {
      openedOnce.current.add(targetId)
      dispatch(toggleChapter(index))
    },
    [dispatch]
  )

  const copyChapterLink = useCallback(
    (targetId: number) => {
      const url = `${window.location.origin}${window.location.pathname}?chapter_id=${targetId}`
      navigator.clipboard
        ?.writeText(url)
        .then(() => toast.custom(tr => <Success text={t('Link copied')} onClose={() => toast.dismiss(tr.id)} />))
        .catch(() => {})
    },
    [t]
  )

  // O'qish progressi — sticky panel ostidagi ingichka chiziq.
  useEffect(() => {
    const container = document.getElementById(SCROLL_CONTAINER_ID)
    if (!container) {
      return
    }

    const onScroll = () => {
      const max = container.scrollHeight - container.clientHeight
      setProgress(max > 0 ? Math.min(100, (container.scrollTop / max) * 100) : 0)
    }

    onScroll()
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [chapters])

  const scrollToTop = useCallback(() => {
    document.getElementById(SCROLL_CONTAINER_ID)?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const allOpen = useMemo(() => !chapters?.some(el => !el.isOpen), [chapters])

  const article = data?.data

  return (
    <LibraryLayout>
      <div className='library'>
        <div className='library-head'>
          <h1 className='library__title section-title'>{article?.name?.[lang]}</h1>
          <div className='library-head__wrap'>
            {/* Maqolani "Saqlanganlar"ga qo'shish. */}
            {!!article?.id && <SaveButton type='article' id={article.id} saved={article.is_saved} />}
            {/*
              Faqat o'zbek tili qoldirildi. RU/EN tugmalari olib tashlandi;
              setLang mexanizmi va Redux'dagi `lang` o'z joyida — kerak bo'lsa
              tugmalarni qaytarish oson.
            */}
            <div className='library-head__lang'>
              <button type='button' className='current' aria-current='true'>
                <img src={uz} alt='lang' />
                <span>UZ</span>
              </button>
            </div>
            <button
              className='library-head__btn'
              onClick={() => {
                if (showAddInfo && showMarker) {
                  dispatch(toggleAddInfo())
                  dispatch(toggleShowMarker())
                } else {
                  dispatch(toggleAddInfo())
                }
              }}
            >
              <span>{t('Additional Information')}</span>
              <input checked={showAddInfo} readOnly type='checkbox' className='checkbox' />
            </button>
            <button className='library-head__btn' onClick={() => dispatch(toggleShowMarker())}>
              <span>{t('Marker')}</span>
              <input checked={showMarker} readOnly type='checkbox' className='checkbox' />
            </button>
            <button className='library-head__btn' onClick={() => dispatch(toggleAllChapter(!allOpen))}>
              <span>{allOpen ? t('Close text') : t('Open text')}</span>
              <input checked={allOpen} readOnly type='checkbox' className='checkbox' />
            </button>
            <div className='library-head__btn'>
              <MinusIcon onClick={() => dispatch(decrement())} />
              <span>{t('Tt')}</span>
              <PlusIcon onClick={() => dispatch(increment())} />
            </div>
          </div>

          {/* O'qish progressi — panelning pastki chekkasida. */}
          <div className='reading-progress' aria-hidden='true'>
            <div className='reading-progress__bar' style={{ width: `${progress}%` }} />
          </div>
        </div>

        {article?.blocks?.length ? (
          <div className='library-btn'>
            <button
              className='btn btn-grey'
              onClick={() => navigate(`/detail/article/${article?.slug}/${article?.blocks?.[0]?.id}`)}
            >
              <Play width={'1rem'} height={'1rem'} />
              <span>{t('Qbank mini test')}</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className='library-accordion'>
          {!isLoading &&
            chapters?.map((chapter: any, index: number) => {
              const isActive = !!chapter.isOpen
              const shouldRender = isActive || openedOnce.current.has(chapter.id)

              return (
                <div id={chapter?.id} className={`library-accordion__item ${isActive ? 'active' : ''}`} key={chapter.id}>
                  {/*
                    Ilgari bu <div onClick> edi: Tab bilan fokus olmasdi va
                    Enter/Space bilan ochilmasdi.
                  */}
                  <button
                    type='button'
                    className='library-accordion__head'
                    aria-expanded={isActive}
                    onClick={() => handleToggleChapter(index, chapter.id)}
                  >
                    <span>{chapter.title?.[lang]}</span>
                    <DropDownIcon />
                  </button>

                  <div className='library-accordion__content'>
                    {shouldRender && <WithTooltip html={chapter?.description?.[lang]} />}

                    <div className='chapter-actions'>
                      <button
                        type='button'
                        className='chapter-actions__btn'
                        onClick={() => copyChapterLink(chapter.id)}
                        title={t('Copy link to this section')}
                      >
                        <CopyIcon />
                        <span>{t('Copy link')}</span>
                      </button>

                      <button
                        type='button'
                        className='chapter-actions__btn'
                        onClick={() => {
                          setOpenFeedback(true)
                          setChapterId(chapter?.id)
                        }}
                      >
                        <MarkerIcon width={'1rem'} height={'1rem'} />
                        <span>{t('Feedback')}</span>
                      </button>

                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Uzun maqolada tepaga qaytish. */}
        {progress > 5 && (
          <button type='button' className='scroll-top' onClick={scrollToTop} title={t('Back to top')}>
            <ArrowUpIcon />
          </button>
        )}

        <FeedbackModal
          type='chapter'
          article_slug={id}
          chapter_id={chapterId}
          zIndex={100}
          isVisible={openFeedback}
          hide={() => {
            setOpenFeedback(false)
          }}
        />
      </div>
    </LibraryLayout>
  )
}
