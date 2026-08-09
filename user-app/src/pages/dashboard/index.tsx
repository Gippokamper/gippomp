import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQueries } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import moment from 'moment'

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
  no_answer: number
  question_count?: number
  created_at?: string
  block_id?: { id: number; slug: string; name?: Record<string, string> }
}

const get = (url: string, params?: Record<string, unknown>) => async () => {
  const response: any = await request({ url, method: 'GET', params })
  return response?.data
}

/** Foizni butun songa yaxlitlaydi, bo'luvchi nol bo'lsa 0 qaytaradi. */
const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0)

export const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const { user } = useContext(AuthContext)

  /*
   * `user_test_attempt` tarif tekshiruvi ichida — tarifsiz foydalanuvchida
   * xato qaytaradi. Shuning uchun bu yerda `onError` bilan to'xtatilmaydi:
   * xato bo'lsa tahlil bloklari o'rniga "boshlash" holati ko'rsatiladi.
   */
  const [attempts, quizzes, recent] = useQueries([
    { queryKey: ['dash-attempts'], queryFn: get('dashboard/user/user_test_attempt'), retry: false },
    { queryKey: ['dash-quiz-tree'], queryFn: get('dashboard/user/quizzes/tree'), retry: false },
    { queryKey: ['dash-recent'], queryFn: get('dashboard/user/articles_recent', { limit: 4 }), retry: false }
  ]) as any[]

  const firstName = user?.firstname || ''
  const tariff = (user?.tariff ?? [])[0]

  const list: IAttempt[] = useMemo(() => attempts?.data?.data ?? [], [attempts?.data])

  /** Bazadagi jami savollar — test daraxti ildizlaridan yig'iladi. */
  const totalQuestions = useMemo(() => {
    const roots: IQuizNode[] = quizzes?.data?.data ?? []
    return roots.reduce((sum, node) => sum + (node.total || 0), 0)
  }, [quizzes?.data])

  /** Umumiy holat: nechta savol yechilgan va ulardan qanchasi to'g'ri. */
  const summary = useMemo(() => {
    const answered = list.reduce((s, a) => s + a.right_answer + a.wrong_answer + a.help_answer, 0)
    const right = list.reduce((s, a) => s + a.right_answer, 0)
    // Sessiya deb faqat javob berilgan urinish sanaladi — bo'sh boshlanganlari emas.
    const sessions = list.filter(a => a.right_answer + a.wrong_answer + a.help_answer > 0).length
    return { answered, right, sessions, accuracy: percent(right, answered) }
  }, [list])

  /**
   * Zaif mavzular — blok bo'yicha to'g'ri javob ulushi. Bir blok bir necha
   * marta yechilgan bo'lishi mumkin, shuning uchun urinishlar qo'shiladi.
   */
  const weakTopics = useMemo(() => {
    const byBlock = new Map<number, { name: string; right: number; answered: number }>()

    list.forEach(attempt => {
      const block = attempt.block_id
      if (!block) return

      const answered = attempt.right_answer + attempt.wrong_answer + attempt.help_answer
      if (!answered) return

      const current = byBlock.get(block.id) ?? {
        name: block.name?.[i18n.language] || block.slug,
        right: 0,
        answered: 0
      }
      current.right += attempt.right_answer
      current.answered += answered
      byBlock.set(block.id, current)
    })

    return Array.from(byBlock.values())
      .map(item => ({ ...item, accuracy: percent(item.right, item.answered) }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
  }, [list, i18n.language])

  /*
   * Oxirgi sessiyalar — API o'sish tartibida qaytaradi, teskarilaymiz.
   *
   * Javob berilmagan urinishlar tashlab yuboriladi: bazada boshlangan, lekin
   * bironta savolga javob berilmagan yozuvlar ko'p (21 tadan aksariyati), ular
   * ro'yxatni ma'nosiz "0/0 — 0%" qatorlar bilan to'ldirardi.
   */
  const recentSessions = useMemo(
    () =>
      [...list]
        .filter(a => a.right_answer + a.wrong_answer + a.help_answer > 0)
        .reverse()
        .slice(0, 5),
    [list]
  )

  const recentArticles: any[] = recent?.data?.data ?? []
  const hasAttempts = list.length > 0
  const attemptsBlocked = attempts?.isError

  return (
    <MainLayout>
      <section className='dash'>
        <header className='dash-hello'>
          <h1 className='ui-title'>{firstName ? `${t('Hello')}, ${firstName}` : t('Hello')}</h1>
          <p className='dash-hello__sub'>{t('What are we learning today?')}</p>
        </header>

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

        {/* ---------- O'quv xulosasi ---------- */}
        <section className='dash-block'>
          <div className='dash-block__head'>
            <h2 className='dash-block__title'>{t('Study summary')}</h2>
          </div>

          {attempts?.isLoading ? (
            <Skeleton height={120} borderRadius={14} />
          ) : hasAttempts ? (
            <div className='dash-summary'>
              <div className='dash-summary__main'>
                <span className='dash-summary__label'>{t('Correct answers')}</span>
                <span className='dash-summary__accuracy'>{summary.accuracy}%</span>
                <span className='dash-summary__bar'>
                  <span style={{ width: `${summary.accuracy}%` }} />
                </span>
                <span className='dash-summary__note'>
                  {summary.right} / {summary.answered}
                </span>
              </div>

              <dl className='dash-summary__side'>
                <div>
                  <dt>{t('Solved questions')}</dt>
                  <dd>
                    {summary.answered}
                    {totalQuestions > 0 && <i> / {totalQuestions}</i>}
                  </dd>
                </div>
                <div>
                  <dt>{t('Sessions')}</dt>
                  <dd>{summary.sessions}</dd>
                </div>
                <div>
                  <dt>{t('My tariff')}</dt>
                  <dd className={tariff ? '' : 'is-muted'}>{tariff ? tariff?.name?.[i18n.language] : '—'}</dd>
                </div>
              </dl>
            </div>
          ) : (
            /* Hali test yechilmagan yoki tarif yo'q — nima qilish kerakligi aytiladi. */
            <div className='dash-start'>
              <b>{attemptsBlocked ? t('Active tariff not found') : t('You have not solved any tests yet')}</b>
              <span>
                {attemptsBlocked
                  ? t('Purchase a tariff to access all materials')
                  : t('Solve your first test and your progress will appear here')}
              </span>
              <Link className='ui-btn ui-btn--primary' to={attemptsBlocked ? '/account?type=tariffs' : '/quizzes'}>
                {attemptsBlocked ? t('Manage tariffs') : t('Test your knowledge')}
              </Link>
            </div>
          )}
        </section>

        {/* ---------- Zaif mavzular ---------- */}
        {weakTopics.length > 0 && (
          <section className='dash-block'>
            <div className='dash-block__head'>
              <h2 className='dash-block__title'>{t('Focus on these')}</h2>
              <Link className='dash-block__more' to='/quizzes'>
                {t('Test your knowledge')}
              </Link>
            </div>
            <ul className='dash-rows'>
              {weakTopics.map(topic => (
                <li className='dash-row' key={topic.name}>
                  <span className='dash-row__name'>{topic.name}</span>
                  <span className='dash-row__bar'>
                    <span style={{ width: `${topic.accuracy}%` }} />
                  </span>
                  <span className={`dash-row__value ${topic.accuracy < 50 ? 'is-low' : ''}`}>
                    {topic.accuracy}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Oxirgi sessiyalar ---------- */}
        {recentSessions.length > 0 && (
          <section className='dash-block'>
            <div className='dash-block__head'>
              <h2 className='dash-block__title'>{t('Recent sessions')}</h2>
            </div>
            <ul className='dash-rows'>
              {recentSessions.map(session => {
                const answered = session.right_answer + session.wrong_answer + session.help_answer
                const accuracy = percent(session.right_answer, answered)

                return (
                  <li className='dash-row' key={session.id}>
                    <span className='dash-row__name'>
                      {session.block_id?.name?.[i18n.language] || session.block_id?.slug || '—'}
                      {!!session.created_at && (
                        <i>{moment(session.created_at).format('DD.MM.YYYY')}</i>
                      )}
                    </span>
                    <span className='dash-row__score'>
                      {session.right_answer} / {answered}
                    </span>
                    <span className={`dash-row__value ${accuracy < 50 ? 'is-low' : ''}`}>{accuracy}%</span>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

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
      </section>
    </MainLayout>
  )
}
