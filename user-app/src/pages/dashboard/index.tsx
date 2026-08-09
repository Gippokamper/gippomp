import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import { MainLayout } from '../../layouts/main'
import Article from '../../img/icons/Article'
import Folder from '../../img/icons/Folder'
import VideoCard from '../../components/vedio-card'
import TestIcon from '../../img/icons/TestIcon'
import LibraryIcon from '../../img/icons/LibraryIcon'
import VediosIcon from '../../img/icons/VediosIcon'
import NewsIcon from '../../img/icons/NewsIcon'
import StudyIcon from '../../img/icons/StudyIcon'
import { request, MEDIA_URL } from '../../helpers/request'
import { readRecentArticles } from '../../helpers/recent-articles'
import './dashboard.scss'

const HISTORY_KEY = 'gippokamp:search-history'
const HISTORY_LIMIT = 6

const readHistory = (): string[] => {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]).slice(0, HISTORY_LIMIT) : []
  } catch {
    return []
  }
}

const SearchIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
    <path d='M20 20l-3.5-3.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

const ClockIcon = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.6' />
    <path d='M12 7.5V12l3 1.8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

/*
 * Tezkor o'tish kartalari — chap menyudagi modullar, lekin izohli.
 * Bosh sahifaga birinchi kirgan foydalanuvchi platformada nima borligini
 * shu yerdan ko'radi; ilgari faqat bo'sh qidiruv maydoni turardi.
 */
const MODULES = [
  { to: '/library', icon: <LibraryIcon />, title: 'Library', hint: 'Maqolalar va klinik bo‘limlar' },
  { to: '/quizzes', icon: <TestIcon />, title: 'Test your knowledge', hint: 'Mavzular bo‘yicha savollar' },
  { to: '/videos', icon: <VediosIcon />, title: 'Videos', hint: 'Video darslar to‘plami' },
  { to: '/study-plan', icon: <StudyIcon />, title: 'Educational program', hint: 'Bosqichma-bosqich o‘quv reja' }
]

export const Dashboard = () => {
  const { t, i18n } = useTranslation()

  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>(readHistory)
  const [cursor, setCursor] = useState(-1)
  /** Yuklanmagan yangilik suratlari — o'rniga belgi chiziladi. */
  const [brokenPhotos, setBrokenPhotos] = useState<number[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  /* Oxirgi ochilgan maqolalar — brauzer xotirasidan, bir marta o'qiladi. */
  const recent = useMemo(() => readRecentArticles(), [])

  /* Yozilayotgan paytda har harfga so'rov ketmasin. */
  useEffect(() => {
    const timer = setTimeout(() => setQuery(term.trim()), 300)
    return () => clearTimeout(timer)
  }, [term])

  /* Ctrl+K — qidiruvga o'tish. */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const { data, isFetching } = useQuery(
    ['home-search', query],
    async () => {
      const response: any = await request({
        url: 'dashboard/user/search',
        method: 'GET',
        params: { search: query }
      })
      return response?.data?.data ?? {}
    },
    { enabled: query.length > 2, retry: false }
  )

  /* Kutubxonaning ildiz bo'limlari — qidiruvsiz ham kirish yo'li bo'lsin. */
  const { data: sections, isLoading: sectionsLoading } = useQuery(
    ['home-sections'],
    async () => {
      const response: any = await request({ url: 'dashboard/user/categories', method: 'GET' })
      return (response?.data?.data ?? []) as any[]
    },
    { retry: false, staleTime: 5 * 60 * 1000 }
  )

  /* Dolzarb yangiliklar — eng so'nggi uchtasi. */
  const { data: news } = useQuery(
    ['home-news'],
    async () => {
      const response: any = await request({ url: 'dashboard/user/news', method: 'GET', params: { actual: true } })
      return (response?.data?.data ?? []) as any[]
    },
    { retry: false, staleTime: 5 * 60 * 1000 }
  )

  const remember = (value: string) => {
    const q = value.trim()
    if (q.length < 3) return
    const next = [q, ...history.filter(h => h !== q)].slice(0, HISTORY_LIMIT)
    setHistory(next)
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    } catch {
      // xotira taqiqlangan bo'lishi mumkin — jim o'tamiz
    }
  }

  /* ↑/↓ — oldingi so'rovlar bo'ylab yurish, Esc — tozalash. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      remember(term)
      return
    }
    if (e.key === 'Escape') {
      setTerm('')
      setCursor(-1)
      return
    }
    if (!history.length) return

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setTerm(history[next])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setTerm(next < 0 ? '' : history[next])
    }
  }

  const articles: any[] = data?.articles ?? []
  const chapters: any[] = data?.chapters ?? []
  const videos: any[] = data?.videos ?? []
  const blocks: any[] = data?.blocks ?? []
  const total = articles.length + chapters.length + videos.length + blocks.length

  const showResults = query.length > 2

  return (
    <MainLayout>
      <section className='find'>
        <div className='find-hero'>
          <h1 className='find-hero__title'>{t('What are you searching for?')}</h1>
          <p className='find-hero__sub'>{t('The library is constantly updated and expanded')}</p>

          <div className='find-box'>
            <span className='find-box__icon'>
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type='text'
              value={term}
              placeholder={t('Find content')}
              onChange={e => {
                setTerm(e.target.value)
                setCursor(-1)
              }}
              onKeyDown={onKeyDown}
              onBlur={() => remember(term)}
            />
            <kbd className='find-box__kbd'>Ctrl + K</kbd>
          </div>

          {/* Oxirgi so'rovlar — faqat qidiruv boshlanmagan bo'lsa */}
          {!showResults && history.length > 0 && (
            <div className='find-history'>
              <span className='find-history__label'>{t('Recent questions')}</span>
              <ul>
                {history.map(item => (
                  <li key={item}>
                    <button type='button' onClick={() => setTerm(item)}>
                      <ClockIcon />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ---------- Natijalar ---------- */}
        {showResults && (
          <div className='find-results'>
            {isFetching && !total ? (
              <p className='find-results__note'>{t('Loading...')}</p>
            ) : !total ? (
              <p className='find-results__note'>{t('Nothing found')}</p>
            ) : (
              <>
                <p className='find-results__note'>
                  {t('Found materials')}: <b>{total}</b>
                </p>

                {articles.length > 0 && (
                  <div className='find-group'>
                    <span className='find-group__label'>{t('Library')}</span>
                    <ul>
                      {articles.map((article: any) => (
                        <li key={`a-${article.id}`}>
                          <Link to={'/article/' + article.slug}>
                            <Article />
                            <span>{article?.name?.[i18n.language] || article.slug}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {chapters.length > 0 && (
                  <div className='find-group'>
                    <span className='find-group__label'>{t('Topics')}</span>
                    <ul>
                      {chapters.map((chapter: any) =>
                        (chapter?.article_ids ?? []).slice(0, 1).map((article: any) => (
                          <li key={`c-${chapter.id}`}>
                            <Link to={`/article/${article?.slug}?chapter_id=${chapter?.id}`}>
                              <Article />
                              <span>{chapter?.title?.[i18n.language]}</span>
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}

                {videos.length > 0 && (
                  <div className='find-group'>
                    <span className='find-group__label'>{t('Videos')}</span>
                    <ul>
                      {videos.map((video: any) => (
                        <li key={`v-${video.id}`}>
                          <Link to='/videos'>
                            <VideoCard />
                            <span>{video?.name?.[i18n.language] || video.slug}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {blocks.length > 0 && (
                  <div className='find-group'>
                    <span className='find-group__label'>{t('Test your knowledge')}</span>
                    <ul>
                      {blocks.map((block: any) => (
                        <li key={`b-${block.id}`}>
                          <Link to='/quizzes'>
                            <TestIcon />
                            <span>
                              {block?.name?.[i18n.language] || block.slug}
                              {!!block.count && <i> · {block.count}</i>}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ---------- Qidiruvsiz ko'rinish: sahifaning asosiy qismi ---------- */}
        {!showResults && (
          <div className='home'>
            {/* Davom ettirish — oxirgi ochilgan maqolalar */}
            {recent.length > 0 && (
              <section className='home-block'>
                <div className='home-block__head'>
                  <h2 className='home-block__title'>{t('Continue reading', "Davom ettirish")}</h2>
                </div>
                <ul className='home-recent'>
                  {recent.slice(0, 4).map(item => (
                    <li key={item.slug}>
                      <Link to={'/article/' + item.slug}>
                        <Article />
                        <span>{item.name?.[i18n.language] || item.slug}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Bo'limlar — kutubxonaning ildiz kategoriyalari */}
            <section className='home-block'>
              <div className='home-block__head'>
                <h2 className='home-block__title'>{t('Sections', "Bo‘limlar")}</h2>
                <Link className='home-block__more' to='/library'>
                  {t('See all', 'Hammasi')} →
                </Link>
              </div>

              {sectionsLoading ? (
                <ul className='home-grid'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                      <Skeleton height={62} borderRadius={10} />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className='home-grid'>
                  {(sections ?? []).slice(0, 8).map((section: any) => (
                    <li key={section.id}>
                      <Link className='home-card' to={'/library/' + section.slug}>
                        <span className='home-card__icon'>
                          <Folder />
                        </span>
                        <span className='home-card__label'>{section?.name?.[i18n.language] || section.slug}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Modullar — platformada yana nima borligi */}
            <section className='home-block'>
              <div className='home-block__head'>
                <h2 className='home-block__title'>{t('Quick access', 'Tezkor o‘tish')}</h2>
              </div>
              <ul className='home-grid home-grid--wide'>
                {MODULES.map(module => (
                  <li key={module.to}>
                    <Link className='home-card home-card--module' to={module.to}>
                      <span className='home-card__icon'>{module.icon}</span>
                      <span className='home-card__text'>
                        <b>{t(module.title)}</b>
                        <small>{module.hint}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Yangiliklar — eng so'nggi uchtasi */}
            {!!news?.length && (
              <section className='home-block'>
                <div className='home-block__head'>
                  <h2 className='home-block__title'>{t('News')}</h2>
                  <Link className='home-block__more' to='/news'>
                    {t('See all', 'Hammasi')} →
                  </Link>
                </div>
                <ul className='home-news'>
                  {news.slice(0, 3).map((item: any) => (
                    <li key={item.id}>
                      <Link to={'/news/' + item.slug}>
                        {/*
                          Surat yo'q yoki yuklanmadi — o'rniga belgi. Ilgari
                          buzilgan rasm bo'sh kulrang to'rtburchak bo'lib
                          qolardi va nima bo'lgani tushunarsiz edi.
                        */}
                        {item.photo && !brokenPhotos.includes(item.id) ? (
                          <img
                            src={MEDIA_URL + item.photo}
                            alt=''
                            onError={() => setBrokenPhotos(prev => [...prev, item.id])}
                          />
                        ) : (
                          <span className='home-news__ph'>
                            <NewsIcon />
                          </span>
                        )}
                        <span>{item?.title?.[i18n.language] || item.slug}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </section>
    </MainLayout>
  )
}
