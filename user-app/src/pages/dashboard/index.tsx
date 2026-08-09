import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueries, useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import { MainLayout } from '../../layouts/main'
import Article from '../../img/icons/Article'
import { AuthContext } from '../../providers/auth-provider'
import { request } from '../../helpers/request'
import './dashboard.scss'

interface IQuizNode {
  total: number
  used: number
  children: IQuizNode[]
}

interface IAttempt {
  id: number
  right_answer: number
  wrong_answer: number
  help_answer: number
}

const get = (url: string, params?: Record<string, unknown>) => async () => {
  const response: any = await request({ url, method: 'GET', params })
  return response?.data
}

const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0)

const SearchIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
    <path d='M20 20l-3.5-3.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

const ArrowIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M5 12h13M13 6l6 6-6 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

export const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [term, setTerm] = useState('')
  const [debounced, setDebounced] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 300)
    return () => clearTimeout(timer)
  }, [term])

  /* Ctrl+K — qidiruvga o'tish. AMBOSS'dagi kabi, maydon yonida ko'rsatilgan. */
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

  const { data: found, isFetching } = useQuery(
    ['dash-search', debounced],
    get('dashboard/user/search', { search: debounced }),
    { enabled: debounced.length > 2, retry: false }
  )

  /*
   * `user_test_attempt` tarif tekshiruvi ichida — tarifsiz foydalanuvchida
   * xato qaytaradi, shuning uchun `retry: false` va xato sahifani buzmaydi.
   */
  const [attempts, quizzes, recent] = useQueries([
    { queryKey: ['dash-attempts'], queryFn: get('dashboard/user/user_test_attempt'), retry: false },
    { queryKey: ['dash-quiz-tree'], queryFn: get('dashboard/user/quizzes/tree'), retry: false },
    { queryKey: ['dash-recent'], queryFn: get('dashboard/user/articles_recent', { limit: 5 }), retry: false }
  ]) as any[]

  const list: IAttempt[] = attempts?.data?.data ?? []
  const recentArticles: any[] = recent?.data?.data ?? []

  const totalQuestions = useMemo(() => {
    const roots: IQuizNode[] = quizzes?.data?.data ?? []
    return roots.reduce((sum, node) => sum + (node.total || 0), 0)
  }, [quizzes?.data])

  const summary = useMemo(() => {
    const answered = list.reduce((s, a) => s + a.right_answer + a.wrong_answer + a.help_answer, 0)
    const right = list.reduce((s, a) => s + a.right_answer, 0)
    return { answered, right, accuracy: percent(right, answered) }
  }, [list])

  const articles: any[] = found?.data?.articles ?? []
  const chapters: any[] = found?.data?.chapters ?? []
  const hasResults = articles.length > 0 || chapters.length > 0
  const showResults = debounced.length > 2

  return (
    <MainLayout disablePadding>
      <section className='dash'>
        {/* ---------- Qidiruv ---------- */}
        <div className='dash-hero'>
          <h1 className='dash-hero__title'>{t('What are you searching for?')}</h1>
          <p className='dash-hero__sub'>{t('The library is constantly updated and expanded')}</p>

          <div className='dash-search'>
            <label className='dash-search__box'>
              <span className='dash-search__icon'>
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type='search'
                value={term}
                placeholder={t('Find content')}
                onChange={e => setTerm(e.target.value)}
              />
              <kbd className='dash-search__kbd'>Ctrl + K</kbd>
              <button
                type='button'
                className='dash-search__go'
                aria-label={t('Search')}
                disabled={!articles.length}
                onClick={() => articles[0] && navigate('/article/' + articles[0].slug)}
              >
                <ArrowIcon />
              </button>
            </label>

            {/* Natijalar maydon ostida ochiladi — sahifa o'zgarmaydi. */}
            {showResults && (
              <div className='dash-results'>
                {isFetching && !hasResults ? (
                  <div className='dash-results__empty'>{t('Loading...')}</div>
                ) : hasResults ? (
                  <ul>
                    {articles.slice(0, 5).map(article => (
                      <li key={`a-${article.id}`}>
                        <Link to={'/article/' + article.slug} onClick={() => setTerm('')}>
                          <Article />
                          <span>{article?.name?.[i18n.language] || article.slug}</span>
                        </Link>
                      </li>
                    ))}
                    {chapters.slice(0, 3).map((chapter: any) =>
                      (chapter?.article_ids ?? []).slice(0, 1).map((article: any) => (
                        <li key={`c-${chapter.id}-${article.id}`}>
                          <Link
                            to={`/article/${article?.slug}?chapter_id=${chapter?.id}`}
                            onClick={() => setTerm('')}
                          >
                            <Article />
                            <span>{chapter?.title?.[i18n.language]}</span>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                ) : (
                  <div className='dash-results__empty'>{t('Nothing found')}</div>
                )}
              </div>
            )}
          </div>

          <a className='dash-hero__more' href='#dash-below'>
            {t('Explore more')} ↓
          </a>
        </div>

        {/* ---------- Pastdagi ikkita kartochka ---------- */}
        <div className='dash-below' id='dash-below'>
          <div className='dash-panel'>
            <h2 className='dash-panel__title'>{t('Recently viewed articles')}</h2>

            {recent?.isLoading ? (
              <div className='dash-list'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={40} />
                ))}
              </div>
            ) : recentArticles.length ? (
              <ul className='dash-list'>
                {recentArticles.map(article => (
                  <li key={article.id}>
                    <Link to={'/article/' + article.slug}>
                      <Article />
                      <span>{article?.name?.[i18n.language] || article.slug}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='dash-panel__empty'>{t('This section is empty')}</p>
            )}
          </div>

          {/* To'q fonli "o'quv" kartasi — referensdagi Learning bloki. */}
          <div className='dash-panel dash-panel--accent'>
            <h2 className='dash-panel__title'>{t('Learning')}</h2>

            {attempts?.isError || !summary.answered ? (
              <>
                <p className='dash-panel__lead'>{t('Solve your first test and your progress will appear here')}</p>
                <Link className='dash-panel__btn' to={attempts?.isError ? '/account?type=tariffs' : '/quizzes'}>
                  {attempts?.isError ? t('Manage tariffs') : t('Test your knowledge')}
                </Link>
              </>
            ) : (
              <>
                <div className='dash-metric'>
                  <span className='dash-metric__value'>{summary.accuracy}%</span>
                  <span className='dash-metric__label'>{t('Correct answers')}</span>
                </div>
                <div className='dash-metric__bar'>
                  <span style={{ width: `${summary.accuracy}%` }} />
                </div>
                <p className='dash-panel__lead'>
                  {summary.answered}
                  {totalQuestions > 0 && ` / ${totalQuestions}`} {t('Solved questions').toLowerCase()}
                </p>
                <Link className='dash-panel__btn' to='/quizzes'>
                  {t('Test your knowledge')}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
