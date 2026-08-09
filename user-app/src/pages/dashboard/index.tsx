import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { MainLayout } from '../../layouts/main'
import Article from '../../img/icons/Article'
import VideoCard from '../../components/vedio-card'
import TestIcon from '../../img/icons/TestIcon'
import { AuthContext } from '../../providers/auth-provider'
import { request } from '../../helpers/request'
import './dashboard.scss'

/** Suhbatdagi bitta almashuv: talaba savoli va unga topilgan materiallar. */
interface IExchange {
  id: number
  question: string
  status: 'loading' | 'done' | 'error'
  result?: {
    articles: any[]
    chapters: any[]
    videos: any[]
    blocks: any[]
  }
}

const HISTORY_KEY = 'gippokamp:chat-history'
const HISTORY_LIMIT = 8

const readHistory = (): string[] => {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]).slice(0, HISTORY_LIMIT) : []
  } catch {
    return []
  }
}

const SendIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M5 12h13M13 6l6 6-6 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
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
  const { user } = useContext(AuthContext)

  const [term, setTerm] = useState('')
  const [exchanges, setExchanges] = useState<IExchange[]>([])
  const [history, setHistory] = useState<string[]>(readHistory)
  /** Klaviatura bilan tarixdan tanlash uchun joriy o'rin (-1 = tanlanmagan). */
  const [cursor, setCursor] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  const firstName = user?.firstname || ''

  /* Yangi javob kelganda suhbat oxiriga suriladi. */
  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [exchanges])

  /* Ctrl+K — yozish maydoniga o'tish. */
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

  const remember = (question: string) => {
    const next = [question, ...history.filter(h => h !== question)].slice(0, HISTORY_LIMIT)
    setHistory(next)
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    } catch {
      // xotira to'lgan yoki taqiqlangan bo'lishi mumkin — jim o'tamiz
    }
  }

  const ask = async (raw: string) => {
    const question = raw.trim()
    if (!question) return

    const id = Date.now()
    setExchanges(prev => [...prev, { id, question, status: 'loading' }])
    setTerm('')
    setCursor(-1)
    remember(question)

    try {
      const response: any = await request({
        url: 'dashboard/user/search',
        method: 'GET',
        params: { search: question }
      })
      const data = response?.data?.data ?? {}
      setExchanges(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                status: 'done',
                result: {
                  articles: data.articles ?? [],
                  chapters: data.chapters ?? [],
                  videos: data.videos ?? [],
                  blocks: data.blocks ?? []
                }
              }
            : item
        )
      )
    } catch {
      setExchanges(prev => prev.map(item => (item.id === id ? { ...item, status: 'error' } : item)))
    }
  }

  /* ↑/↓ — oldingi savollar bo'ylab yurish, Esc — tozalash. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      ask(term)
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

  const isEmpty = exchanges.length === 0

  const renderAnswer = (exchange: IExchange) => {
    if (exchange.status === 'loading') {
      return <div className='chat-answer__wait'>{t('Loading...')}</div>
    }

    if (exchange.status === 'error') {
      return <div className='chat-answer__wait'>{t('Failed to load')}</div>
    }

    const { articles = [], chapters = [], videos = [], blocks = [] } = exchange.result ?? {}
    const total = articles.length + chapters.length + videos.length + blocks.length

    if (!total) {
      return (
        <>
          <p className='chat-answer__text'>{t('Nothing found')}</p>
          <p className='chat-answer__hint'>{t('Try another word or check the spelling')}</p>
        </>
      )
    }

    return (
      <>
        <p className='chat-answer__text'>
          {t('Found materials')}: <b>{total}</b>
        </p>

        {articles.length > 0 && (
          <div className='chat-group'>
            <span className='chat-group__label'>{t('Library')}</span>
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
          <div className='chat-group'>
            <span className='chat-group__label'>{t('Topics')}</span>
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
          <div className='chat-group'>
            <span className='chat-group__label'>{t('Videos')}</span>
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
          <div className='chat-group'>
            <span className='chat-group__label'>{t('Test your knowledge')}</span>
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
    )
  }

  return (
    <MainLayout disablePadding>
      <section className={`chat ${isEmpty ? 'is-empty' : ''}`}>
        <div className='chat-feed' ref={feedRef}>
          {isEmpty ? (
            <div className='chat-intro'>
              <h1 className='chat-intro__title'>
                {firstName ? `${t('Hello')}, ${firstName}` : t('Hello')}
              </h1>
              <p className='chat-intro__sub'>{t('Ask about any topic — I will find the materials')}</p>

              {history.length > 0 && (
                <div className='chat-history'>
                  <span className='chat-history__label'>{t('Your recent questions')}</span>
                  <ul>
                    {history.map(item => (
                      <li key={item}>
                        <button type='button' onClick={() => ask(item)}>
                          <ClockIcon />
                          <span>{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className='chat-thread'>
              {exchanges.map(exchange => (
                <div className='chat-turn' key={exchange.id}>
                  <div className='chat-question'>{exchange.question}</div>
                  <div className='chat-answer'>{renderAnswer(exchange)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Yozish maydoni ---------- */}
        <div className='chat-composer'>
          <div className='chat-composer__box'>
            <input
              ref={inputRef}
              type='text'
              value={term}
              placeholder={t('Ask a question')}
              onChange={e => {
                setTerm(e.target.value)
                setCursor(-1)
              }}
              onKeyDown={onKeyDown}
            />
            <button
              type='button'
              className='chat-composer__send'
              aria-label={t('Search')}
              disabled={!term.trim()}
              onClick={() => ask(term)}
            >
              <SendIcon />
            </button>
          </div>

          {/* Referensdagi kabi klaviatura yorliqlari */}
          <div className='chat-composer__hints'>
            <span>
              <kbd>Ctrl</kbd> + <kbd>K</kbd> {t('Open')}
            </span>
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> {t('Recent questions')}
            </span>
            <span>
              <kbd>Enter</kbd> {t('Send')}
            </span>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
