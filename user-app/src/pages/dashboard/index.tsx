import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'

import { MainLayout } from '../../layouts/main'
import Article from '../../img/icons/Article'
import VideoCard from '../../components/vedio-card'
import TestIcon from '../../img/icons/TestIcon'
import { request } from '../../helpers/request'
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

export const Dashboard = () => {
  const { t, i18n } = useTranslation()

  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>(readHistory)
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

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
      </section>
    </MainLayout>
  )
}
