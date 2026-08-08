import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import { MainLayout } from '../../layouts/main'
import { request } from '../../helpers/request'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import './quiz-tree.scss'

/** Daraxtning bitta tuguni — bo'lim, fan yoki mavzu. Chuqurlik cheklanmagan. */
interface IQuizNode {
  id: number
  slug: string
  name?: Record<string, string>
  info?: Record<string, string>
  /** O'zida savol bloklari bor — bosilganda testga o'tadi. */
  testable: boolean
  /** Ostki daraxt bilan birga savollar soni. */
  total: number
  /** Shundan yechilgani (belgilangan bo'limda — hammasi). */
  used: number
  /** Foydalanuvchi "bajardim" deb belgilaganmi. */
  done: boolean
  children: IQuizNode[]
}

const QUERY_KEY = 'quiz-tree'

const Caret = () => (
  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M9 6l6 6-6 6' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

/**
 * Tugun to'liq belgilanmagan, lekin ichida belgilangani bor — checkbox
 * oraliq holatda turadi. Server faqat `done` ni biladi, oraliq holat
 * bolalardan hisoblanadi.
 */
const hasDoneDescendant = (node: IQuizNode): boolean =>
  node.children.some(child => child.done || hasDoneDescendant(child))

function Quizzes() {
  const { i18n, t } = useTranslation()
  const queryClient = useQueryClient()
  const handleApiError = useApiErrorHandler()

  const [expanded, setExpanded] = useState<number[]>([])

  const { data, isLoading, isError, refetch } = useQuery(
    [QUERY_KEY],
    async () => {
      const response: any = await request({ url: 'dashboard/user/quizzes/tree', method: 'GET' })
      return (response?.data?.data ?? []) as IQuizNode[]
    },
    { onError: handleApiError }
  )

  /*
   * Endpoint javob sifatida yangilangan daraxtni qaytaradi, shuning uchun
   * qayta so'rov kerak emas — kelgan daraxtni to'g'ridan-to'g'ri qo'yamiz.
   */
  const { mutate: toggleDone, isLoading: isSaving } = useMutation(
    async ({ slug, done }: { slug: string; done: boolean }) => {
      const response: any = await request({
        url: `dashboard/user/quizzes/${slug}/complete`,
        method: done ? 'DELETE' : 'POST'
      })
      return (response?.data?.data ?? []) as IQuizNode[]
    },
    {
      onSuccess: tree => {
        queryClient.setQueryData([QUERY_KEY], tree)
      },
      onError: handleApiError
    }
  )

  const tree = useMemo(() => data ?? [], [data])

  const toggleExpanded = useCallback(
    (id: number) => setExpanded(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])),
    []
  )

  const renderRow = (node: IQuizNode, depth: number) => {
    const isOpen = expanded.includes(node.id)
    const hasChildren = node.children.length > 0
    const percent = node.total > 0 ? Math.round((node.used / node.total) * 100) : 0
    const partial = !node.done && hasDoneDescendant(node)
    const label = node.name?.[i18n.language] || node.slug

    return (
      <div className='qt-branch' key={node.id}>
        <div
          className={`qt-row ${node.done ? 'is-done' : ''} ${depth === 0 ? 'is-root' : ''}`}
          style={{ ['--qt-depth' as any]: depth }}
        >
          <div className='qt-row__main'>
            {hasChildren ? (
              <button
                type='button'
                className='qt-row__caret'
                aria-expanded={isOpen}
                aria-label={isOpen ? t('Collapse') : t('Expand')}
                onClick={() => toggleExpanded(node.id)}
              >
                <Caret />
              </button>
            ) : (
              <span className='qt-row__caret is-empty' aria-hidden='true' />
            )}

            {/*
              Belgi — talabaning o'zi uchun. Serverda saqlanadi, shuning uchun
              boshqa qurilmada ham ko'rinadi. Ota-bo'lim belgilansa, ichidagi
              hamma bo'lim ham belgilanadi (buni backend qiladi).
            */}
            <label className='qt-check' title={t('Mark as done')}>
              <input
                type='checkbox'
                checked={node.done}
                disabled={isSaving}
                ref={el => {
                  if (el) el.indeterminate = partial
                }}
                onChange={() => toggleDone({ slug: node.slug, done: node.done })}
              />
              <span className='qt-check__box' aria-hidden='true' />
            </label>

            {node.testable ? (
              <Link className='qt-row__name is-link' to={`/detail/quiz/${node.slug}`}>
                {label}
              </Link>
            ) : hasChildren ? (
              <button type='button' className='qt-row__name' onClick={() => toggleExpanded(node.id)}>
                {label}
              </button>
            ) : (
              <span className='qt-row__name is-plain'>{label}</span>
            )}
          </div>

          <div className='qt-row__progress'>
            <div className='qt-count'>
              <b>{node.used}</b>
              <span>/</span>
              <span>{node.total}</span>
            </div>
            <div className='qt-bar' role='progressbar' aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>

        {hasChildren && isOpen && (
          <div className='qt-children'>{node.children.map(child => renderRow(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className='qt-skeletons'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={48} />
          ))}
        </div>
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

    if (!tree.length) {
      return (
        <div className='ui-empty'>
          <span className='ui-empty__title'>{t('This section is empty')}</span>
        </div>
      )
    }

    return tree.map(node => renderRow(node, 0))
  }

  return (
    <MainLayout>
      <section className='qt'>
        <h1 className='ui-title'>{t('Test your knowledge')}</h1>
        <p className='ui-lead'>{t('Quiz description')}</p>

        <div className='qt-table'>
          <div className='qt-head'>
            <span>{t('Subject')}</span>
            <span>{t('Used')}</span>
          </div>
          <div className='qt-body'>{renderBody()}</div>
        </div>
      </section>
    </MainLayout>
  )
}

export default Quizzes
