import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQueries } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import { MainLayout } from '../../layouts/main'
import LibraryIcon from '../../img/icons/LibraryIcon'
import TestIcon from '../../img/icons/TestIcon'
import VediosIcon from '../../img/icons/VediosIcon'
import StudyIcon from '../../img/icons/StudyIcon'
import Article from '../../img/icons/Article'
import { AuthContext } from '../../providers/auth-provider'
import { MEDIA_URL, request } from '../../helpers/request'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import './dashboard.scss'

interface IQuizNode {
  total: number
  used: number
  children: IQuizNode[]
}

const MODULES = [
  { to: '/library', label: 'Library', icon: <LibraryIcon /> },
  { to: '/quizzes', label: 'Test your knowledge', icon: <TestIcon /> },
  { to: '/videos', label: 'Videos', icon: <VediosIcon /> },
  { to: '/study-plan', label: 'Educational program', icon: <StudyIcon /> }
]

const get = (url: string, params?: Record<string, unknown>) => async () => {
  const response: any = await request({ url, method: 'GET', params })
  return response?.data
}

export const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const { user } = useContext(AuthContext)
  const handleApiError = useApiErrorHandler()

  const [quizzes, saves, recent, news] = useQueries([
    { queryKey: ['dash-quiz-tree'], queryFn: get('dashboard/user/quizzes/tree'), onError: handleApiError },
    { queryKey: ['dash-saves'], queryFn: get('dashboard/user/saves', { perPage: 4 }), onError: handleApiError },
    { queryKey: ['dash-recent'], queryFn: get('dashboard/user/articles_recent', { limit: 4 }), onError: handleApiError },
    { queryKey: ['dash-news'], queryFn: get('dashboard/user/news', { perPage: 3 }), onError: handleApiError }
  ]) as any[]

  const firstName = user?.firstname || ''
  const tariff = (user?.tariff ?? [])[0]

  /* Test daraxti ildizlarda yig'ilgan — umumiy holat uchun ularni qo'shamiz. */
  const progress = useMemo(() => {
    const roots: IQuizNode[] = quizzes?.data?.data ?? []
    const total = roots.reduce((sum, node) => sum + (node.total || 0), 0)
    const used = roots.reduce((sum, node) => sum + (node.used || 0), 0)
    return { total, used, percent: total ? Math.round((used / total) * 100) : 0 }
  }, [quizzes?.data])

  const savedItems: any[] = saves?.data?.data?.data ?? []
  const savedTotal: number = saves?.data?.data?.meta?.total ?? savedItems.length
  const recentArticles: any[] = recent?.data?.data ?? []
  const newsItems: any[] = news?.data?.data ?? []

  return (
    <MainLayout>
      <section className='dash'>
        {/* ---------- Salomlashish ---------- */}
        <header className='dash-hello'>
          <h1 className='ui-title'>
            {firstName ? `${t('Hello')}, ${firstName}` : t('Hello')}
          </h1>
          <p className='dash-hello__sub'>{t('What are we learning today?')}</p>
        </header>

        {/* Tarif yo'q bo'lsa — bir marta ko'rinadigan taklif. */}
        {!tariff && (
          <div className='dash-banner'>
            <div className='dash-banner__text'>
              <b>{t('Active tariff not found')}</b>
              <span>{t('Purchase a tariff to access all materials')}</span>
            </div>
            <Link className='ui-btn ui-btn--primary' to='/account?type=tariffs'>
              {t('Manage tariffs')}
            </Link>
          </div>
        )}

        {/* ---------- Holat ---------- */}
        <div className='dash-stats'>
          <div className='dash-stat'>
            <span className='dash-stat__label'>{t('Test your knowledge')}</span>
            {quizzes?.isLoading ? (
              <Skeleton height={28} />
            ) : (
              <>
                <span className='dash-stat__value'>
                  {progress.used} <i>/ {progress.total}</i>
                </span>
                <span className='dash-stat__bar'>
                  <span style={{ width: `${progress.percent}%` }} />
                </span>
              </>
            )}
          </div>

          <div className='dash-stat'>
            <span className='dash-stat__label'>{t('Saved')}</span>
            {saves?.isLoading ? (
              <Skeleton height={28} />
            ) : (
              <>
                <span className='dash-stat__value'>{savedTotal}</span>
                <Link className='dash-stat__link' to='/saved'>
                  {t('Open')}
                </Link>
              </>
            )}
          </div>

          <div className='dash-stat'>
            <span className='dash-stat__label'>{t('My tariff')}</span>
            <span className={`dash-stat__value ${tariff ? '' : 'is-muted'}`}>
              {tariff ? tariff?.name?.[i18n.language] : '—'}
            </span>
          </div>
        </div>

        {/* ---------- Davom ettirish ---------- */}
        {(recent?.isLoading || recentArticles.length > 0) && (
          <section className='dash-block'>
            <div className='dash-block__head'>
              <h2 className='dash-block__title'>{t('Continue reading')}</h2>
              <Link className='dash-block__more' to='/library'>
                {t('Library')}
              </Link>
            </div>

            {recent?.isLoading ? (
              <div className='dash-cards'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height={64} borderRadius={12} />
                ))}
              </div>
            ) : (
              <ul className='dash-cards'>
                {recentArticles.map(article => (
                  <li key={article.id}>
                    <Link className='dash-card' to={'/article/' + article.slug}>
                      <span className='dash-card__icon'>
                        <Article />
                      </span>
                      <span className='dash-card__label'>{article?.name?.[i18n.language] || article.slug}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ---------- Modullar ---------- */}
        <section className='dash-block'>
          <div className='dash-block__head'>
            <h2 className='dash-block__title'>{t('Modules')}</h2>
          </div>
          <ul className='dash-modules'>
            {MODULES.map(module => (
              <li key={module.to}>
                <Link className='dash-module' to={module.to}>
                  <span className='dash-module__icon'>{module.icon}</span>
                  <span className='dash-module__label'>{t(module.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Saqlanganlar ---------- */}
        {savedItems.length > 0 && (
          <section className='dash-block'>
            <div className='dash-block__head'>
              <h2 className='dash-block__title'>{t('Saved')}</h2>
              <Link className='dash-block__more' to='/saved'>
                {t('Open')}
              </Link>
            </div>
            <ul className='dash-cards'>
              {savedItems.map(saved => (
                <li key={`${saved.type}-${saved.item?.id}`}>
                  <Link
                    className='dash-card'
                    to={saved.type === 'article' ? '/article/' + saved.item?.slug : '/saved'}
                  >
                    <span className='dash-card__icon'>
                      <Article />
                    </span>
                    <span className='dash-card__label'>
                      {saved.item?.name?.[i18n.language] || saved.item?.slug}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Yangiliklar ---------- */}
        {newsItems.length > 0 && (
          <section className='dash-block'>
            <div className='dash-block__head'>
              <h2 className='dash-block__title'>{t('News')}</h2>
              <Link className='dash-block__more' to='/news'>
                {t('Open')}
              </Link>
            </div>
            <ul className='dash-news'>
              {newsItems.map(item => (
                <li key={item.id}>
                  <Link className='dash-news__item' to={'/news/' + item.id}>
                    {!!item.photo && (
                      <span className='dash-news__photo'>
                        <img src={MEDIA_URL + item.photo} alt='' loading='lazy' />
                      </span>
                    )}
                    <span className='dash-news__body'>
                      <b>{item?.title?.[i18n.language]}</b>
                      {!!item.date && <span>{item.date}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </MainLayout>
  )
}
