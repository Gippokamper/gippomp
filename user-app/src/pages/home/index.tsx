import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueries } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Skeleton from 'react-loading-skeleton'

import Article from '../../img/icons/Article'
import Folder from '../../img/icons/Folder'
import LockIcon from '../../img/icons/LockIcon'
import { MainLayout } from '../../layouts/main'
import Modal, { IModal } from '../../components/modal'
import lightIcon from '../../img/icons/cash.svg'
import darkIcon from '../../img/icons/cash-dark.svg'
import { AuthContext } from '../../providers/auth-provider'
import { request } from '../../helpers/request'
import { useApiErrorHandler } from '../../hooks/use-api-error-handler'
import './library.scss'

interface INode {
  id: number
  slug: string
  name?: Record<string, string>
  paid?: boolean
}

/**
 * Bir daraja — ya'ni bitta kategoriyaning bolalari (0-daraja = ildiz ro'yxati).
 * Ekranda har bir daraja alohida ustun bo'lib chiqadi.
 */
interface ILevel {
  key: string
  index: number
  title: string
  href: string
  folders: INode[]
  articles: INode[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export const Home = () => {
  const { userPermissions } = useContext(AuthContext)
  const { i18n, t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const handleApiError = useApiErrorHandler()
  const reduceMotion = useReducedMotion()

  const [modalOpen, setModalOpen] = useState(false)
  const colsRef = useRef<HTMLDivElement>(null)

  /** '/library/klinik/gastroenterologiya' -> ['klinik', 'gastroenterologiya'] */
  const slugs = useMemo(() => pathname.split('/').filter(Boolean).slice(1), [pathname])

  /** Har bir daraja uchun bitta so'rov; '' — ildiz ro'yxati. */
  const levelSlugs = useMemo(() => ['', ...slugs], [slugs])

  const results = useQueries(
    levelSlugs.map(slug => ({
      queryKey: ['library-categories', slug],
      queryFn: async () => {
        const response: any = await request({
          url: slug ? `dashboard/user/categories/${slug}` : 'dashboard/user/categories',
          method: 'GET'
        })
        return response.data
      },
      onError: handleApiError
    }))
  ) as any[]

  /** i-darajani ko'rsatuvchi URL: 0 -> /library, 1 -> /library/klinik, ... */
  const hrefForLevel = (index: number) => ['/library', ...slugs.slice(0, index)].join('/')

  const levels: ILevel[] = levelSlugs.map((slug, index) => {
    const result = results[index] ?? {}
    const payload = result?.data?.data
    const isRoot = index === 0

    return {
      key: slug || '__root__',
      index,
      title: isRoot ? t('Library') : payload?.name?.[i18n.language] ?? '',
      href: hrefForLevel(index),
      // Ildiz javobi — massivning o'zi, ichki darajalarda esa child_category.
      folders: (isRoot ? payload : payload?.child_category) ?? [],
      articles: (isRoot ? [] : payload?.articles) ?? [],
      isLoading: !!result?.isLoading,
      isError: !!result?.isError,
      refetch: result?.refetch ?? (() => {})
    }
  })

  const current = levels[levels.length - 1]

  /*
   * Yangi ustun qo'shilganda konteynerni o'ng chekkaga suramiz — aks holda
   * ochilgan bo'lim ekrandan tashqarida qolib ketadi. Ustun eni qat'iy
   * bo'lgani uchun scrollWidth kontent yuklanishini kutmaydi.
   */
  useEffect(() => {
    const el = colsRef.current
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [levels.length, reduceMotion])

  const canReadArticles = !!userPermissions?.some((e: string) => e === 'articles')

  const openArticle = (item: INode) => {
    if (item.paid && !canReadArticles) {
      setModalOpen(true)
      return
    }
    navigate('/article/' + item.slug)
  }

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

  const cardVariants = reduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.03 } }
  }

  /** Bitta ustunning ichi: papkalar, so'ng maqolalar. */
  const renderList = (level: ILevel) => {
    if (level.isLoading) {
      return (
        <ul className='lib-list'>
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <Skeleton className='lib-skeleton' />
            </li>
          ))}
        </ul>
      )
    }

    if (level.isError) {
      return (
        <div className='lib-note' role='alert'>
          <span className='lib-note__title'>{t('Failed to load')}</span>
          <button type='button' className='lib-note__retry' onClick={() => level.refetch()}>
            {t('Try again')}
          </button>
        </div>
      )
    }

    if (!level.folders.length && !level.articles.length) {
      return (
        <div className='lib-note'>
          <span className='lib-note__title'>{t('This section is empty')}</span>
        </div>
      )
    }

    return (
      <motion.ul className='lib-list' variants={listVariants} initial='hidden' animate='show'>
        {level.folders.map(item => (
          <motion.li key={`folder-${item.id}`} variants={cardVariants}>
            <Link
              to={[level.href, item.slug].join('/')}
              className={`lib-card ${slugs[level.index] === item.slug ? 'is-current' : ''}`}
            >
              <span className='lib-card__icon'>
                <Folder />
              </span>
              <span className='lib-card__label'>{item.name?.[i18n.language]}</span>
            </Link>
          </motion.li>
        ))}

        {level.articles.map(item => {
          const locked = !!item.paid && !canReadArticles
          return (
            <motion.li key={`article-${item.id}`} variants={cardVariants}>
              {/*
                Ilgari bu <a href> siz edi: Tab bilan fokus olmasdi, Enter bilan
                ochilmasdi va kursor ham o'zgarmasdi. Yopiq maqola — tugma
                (to'lov oynasini ochadi), ochiq maqola — haqiqiy havola.
              */}
              {locked ? (
                <button type='button' className='lib-card is-locked' onClick={() => openArticle(item)}>
                  <span className='lib-card__icon'>
                    <LockIcon />
                  </span>
                  <span className='lib-card__label'>{item.name?.[i18n.language]}</span>
                </button>
              ) : (
                <Link to={'/article/' + item.slug} className='lib-card'>
                  <span className='lib-card__icon'>
                    <Article />
                  </span>
                  <span className='lib-card__label'>{item.name?.[i18n.language]}</span>
                </Link>
              )}
            </motion.li>
          )
        })}
      </motion.ul>
    )
  }

  return (
    <MainLayout>
      <section className='lib'>
        {/* Yo'l — istalgan yuqori darajaga bir bosishda qaytish uchun. */}
        <nav className='lib-crumbs' aria-label={t('Library')}>
          {levels.map((level, index) => {
            const isLast = index === levels.length - 1
            const label = level.title || (level.isLoading ? '…' : level.key)

            return (
              <span key={level.key} className='lib-crumbs__part'>
                {index > 0 && (
                  <span className='lib-crumbs__sep' aria-hidden='true'>
                    ›
                  </span>
                )}
                {isLast ? (
                  <span className='lib-crumbs__current' aria-current='page'>
                    {label}
                  </span>
                ) : (
                  <Link className='lib-crumbs__link' to={level.href}>
                    {label}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>

        {/* Ekran o'quvchilari uchun — ustunlar o'z sarlavhalarini o'zi ko'rsatadi. */}
        <h1 className='lib-sr-only'>{current.title || t('Library')}</h1>

        {/*
          Har bir daraja — alohida ustun, ierarxiya tartibida chapdan o'ngga:
          Kutubxona | Klinik | Endokrinologiya | ...  Ustunlar soni yo'l
          chuqurligiga qarab o'zi o'zgaradi, qat'iy chegara yo'q.
        */}
        <div className='lib-cols' ref={colsRef}>
          <AnimatePresence initial={false}>
            {levels.map(level => {
              const count = level.folders.length + level.articles.length
              const isLast = level.index === levels.length - 1

              return (
                <motion.section
                  key={level.key}
                  className={`lib-col ${isLast ? 'is-last' : ''}`}
                  aria-label={level.title || level.key}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                >
                  <header className='lib-col__head'>
                    <span className='lib-col__title'>
                      {level.isLoading && !level.title ? <Skeleton width={110} /> : level.title || level.key}
                    </span>
                    {!!count && <span className='lib-col__count'>{count}</span>}
                  </header>

                  <div className='lib-col__body'>{renderList(level)}</div>
                </motion.section>
              )
            })}
          </AnimatePresence>
        </div>
      </section>

      <Modal {...modalProps} />
    </MainLayout>
  )
}
