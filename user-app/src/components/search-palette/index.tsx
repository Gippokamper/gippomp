import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'

import Article from '../../img/icons/Article'
import TestIcon from '../../img/icons/TestIcon'
import VideoCard from '../vedio-card'
import { request } from '../../helpers/request'
import './search-palette.scss'

/*
 * Qidiruv palitrasi — sarlavhadagi keng maydon o'rniga.
 *
 * Nega: maydon panelning yarmini egallardi va har sahifada ko'z oldida
 * turardi, lekin kuniga bir-ikki marta ishlatilardi. Endi u ikkita belgi —
 * sarlavhadagi lupa va Ctrl+K. Ochilganda ekran markazida, natijalar
 * to'g'ridan-to'g'ri ostida: klaviaturadan chiqmasdan maqolaga o'tiladi.
 */

interface IProps {
  isOpen: boolean
  close: () => void
}

/** Palitradagi bitta qator — guruhidan qat'i nazar bir xil shakl. */
interface IRow {
  key: string
  to: string
  label: string
  group: string
  icon: JSX.Element
}

const SearchIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
    <path d='M20 20l-3.5-3.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

export const SearchPalette = ({ isOpen, close }: IProps) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  /* Har harfga so'rov ketmasin. */
  useEffect(() => {
    const timer = setTimeout(() => setQuery(term.trim()), 250)
    return () => clearTimeout(timer)
  }, [term])

  /* Ochilganda maydonga fokus, yopilganda matn tozalanadi. */
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      return
    }
    setTerm('')
    setQuery('')
    setCursor(0)
  }, [isOpen])

  const { data, isFetching } = useQuery(
    ['palette-search', query],
    async () => {
      const response: any = await request({
        url: 'dashboard/user/search',
        method: 'GET',
        params: { search: query }
      })
      return response?.data?.data ?? {}
    },
    { enabled: isOpen && query.length > 2, retry: false }
  )

  /*
   * Server javobi to'rt guruhga bo'lingan. Klaviatura bilan yurish uchun
   * ular bitta tekis ro'yxatga yig'iladi — ko'rinishda guruh sarlavhalari
   * qoladi, lekin ↑/↓ hammasi bo'ylab uzluksiz harakat qiladi.
   */
  const rows: IRow[] = useMemo(() => {
    if (!data) return []
    const lang = i18n.language

    const articles = (data.articles ?? []).map((item: any) => ({
      key: `a-${item.id}`,
      to: '/article/' + item.slug,
      label: item?.name?.[lang] || item.slug,
      group: t('Library'),
      icon: <Article />
    }))

    const chapters = (data.chapters ?? []).flatMap((chapter: any) =>
      (chapter?.article_ids ?? []).slice(0, 1).map((article: any) => ({
        key: `c-${chapter.id}`,
        to: `/article/${article?.slug}?chapter_id=${chapter?.id}`,
        label: chapter?.title?.[lang] || '',
        group: t('Topics'),
        icon: <Article />
      }))
    )

    const videos = (data.videos ?? []).map((item: any) => ({
      key: `v-${item.id}`,
      to: '/videos',
      label: item?.name?.[lang] || item.slug,
      group: t('Videos'),
      icon: <VideoCard />
    }))

    const blocks = (data.blocks ?? []).map((item: any) => ({
      key: `b-${item.id}`,
      to: '/quizzes',
      label: item?.name?.[lang] || item.slug,
      group: t('Test your knowledge'),
      icon: <TestIcon />
    }))

    return [...articles, ...chapters, ...videos, ...blocks].filter(row => row.label)
  }, [data, i18n.language, t])

  /* Yangi natijalar kelganda tanlov birinchi qatorga qaytsin. */
  useEffect(() => setCursor(0), [rows.length])

  /* Tanlangan qator ro'yxatdan chiqib ketmasin. */
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const open = (row?: IRow) => {
    if (!row) return
    close()
    navigate(row.to)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (!rows.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(prev => (prev + 1) % rows.length)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(prev => (prev - 1 + rows.length) % rows.length)
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      open(rows[cursor])
    }
  }

  if (!isOpen) return null

  const showHint = query.length <= 2

  return (
    // Fon bosilganda yopiladi; ichkariga bosilgani yuqoriga ko'tarilmasin.
    <div className='palette' role='presentation' onMouseDown={close}>
      <div
        className='palette__box'
        role='dialog'
        aria-modal='true'
        aria-label={t('Search')}
        onMouseDown={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className='palette__field'>
          <span className='palette__icon'>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type='text'
            value={term}
            placeholder={t('Find content')}
            onChange={e => setTerm(e.target.value)}
          />
          <kbd className='palette__kbd'>Esc</kbd>
        </div>

        <div className='palette__body'>
          {showHint ? (
            <p className='palette__note'>{t('Enter at least 3 characters', 'Kamida 3 ta harf kiriting')}</p>
          ) : isFetching && !rows.length ? (
            <p className='palette__note'>{t('Loading...')}</p>
          ) : !rows.length ? (
            <p className='palette__note'>{t('Nothing found')}</p>
          ) : (
            <ul className='palette__list' ref={listRef}>
              {rows.map((row, index) => {
                // Guruh sarlavhasi faqat guruh almashganda chiziladi.
                const isFirstOfGroup = index === 0 || rows[index - 1].group !== row.group

                return (
                  <li key={row.key}>
                    {isFirstOfGroup && <span className='palette__group'>{row.group}</span>}
                    <button
                      type='button'
                      className='palette__row'
                      data-active={index === cursor}
                      onMouseEnter={() => setCursor(index)}
                      onClick={() => open(row)}
                    >
                      {row.icon}
                      <span>{row.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className='palette__foot'>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> {t('Move', 'Yurish')}
          </span>
          <span>
            <kbd>Enter</kbd> {t('Open', 'Ochish')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchPalette
