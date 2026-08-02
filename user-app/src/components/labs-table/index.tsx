import React, { useState } from 'react'
import GetContainer from '../get-container'
import WithHtml from '../with-html'
import { findAll } from 'highlight-words-core'
import DOMPurify from 'dompurify'
import { useTranslation } from 'react-i18next'

interface IProps {
  close: () => void
  isOpen: boolean
}

function LabsTable(props: IProps) {
  const { i18n, t } = useTranslation()
  const [selected, setSelected] = useState(1)
  const [data, setData] = useState<any>(null)
  const [index, setIndex] = useState(1)
  const [search, setSearch] = useState('')
  const chunks = findAll({
    // caseSensitive: false,
    autoEscape: true,
    searchWords: [search?.length > 3 ? search : ''],
    textToHighlight: DOMPurify.sanitize(data?.find((item: any) => item.id === selected)?.description?.[i18n.language])
  })

  const formattedHTML = chunks
    .map((chunk, i) => {
      const { end, highlight, start } = chunk
      const text = DOMPurify.sanitize(
        data?.find((item: any) => item.id === selected)?.description?.[i18n.language]
      ).substr(start, end - start)
      if (highlight) {
        // setIndexes(prev => [...prev, i])
        return i === index
          ? `<mark id="${i}" style="background-color: orange" class="textHighlight">${text}</mark>`
          : `<mark id="${i}" class="textHighlight">${text}</mark>`
      } else {
        return text
      }
    })
    .join('')

  const prev = () => {
    if (index !== 1) {
      const container = document.getElementById('scrollContainer')
      const element = document.getElementById(String(index - 2))

      if (container && element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
      setIndex(prev => prev - 2)
    }
  }
  const next = () => {
    const current = (chunks.length - 1) / 2
    const indexCurrent = (index + 1) / 2
    if (indexCurrent < current) {
      const container = document.getElementById('scrollContainer')
      const element = document.getElementById(String(index + 2))

      if (container && element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
      setIndex(prev => prev + 2)
    }
  }

  return (
    <GetContainer
      url='dashboard/user/laboratory'
      onSuccess={data => {
        setData(data?.data)
        setSelected(data?.data?.[0]?.id)
      }}
    >
      {() => (
        <div
          className={props.isOpen ? 'study-test__side_wrapper' : 'study-test__side_wrapper_close'}
          //   style={{
          //     width: props.isOpen ? '35%' : 0,
          //     maxWidth: props.isOpen ? '35%' : 0,
          //     overflow: 'hidden',
          //     display: props.isOpen ? 'block' : 'none',
          //     position: 'fixed',
          //     right: '1.5rem'
          //   }}
        >
          <div className={`study-test__side`}>
            <div className='study-test__search'>
              <div className='header-search'>
                <div className='header-search__input'>
                  <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <g clipPath='url(#clip0_2522_8521)'>
                      <path
                        d='M19.6334 17.871L15.7624 13.9984C18.6588 10.1278 17.8691 4.64195 13.9984 1.74551C10.1278 -1.15092 4.64195 -0.361157 1.74551 3.50949C-1.15092 7.38013 -0.361157 12.866 3.50949 15.7624C6.61871 18.0891 10.8892 18.0891 13.9984 15.7624L17.871 19.635C18.3577 20.1216 19.1467 20.1216 19.6333 19.635C20.12 19.1483 20.12 18.3593 19.6333 17.8727L19.6334 17.871ZM8.78623 15.015C5.34618 15.015 2.55751 12.2263 2.55751 8.78623C2.55751 5.34618 5.34618 2.55751 8.78623 2.55751C12.2263 2.55751 15.015 5.34618 15.015 8.78623C15.0113 12.2247 12.2248 15.0113 8.78623 15.015Z'
                        fill='currentColor'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_2522_8521'>
                        <rect width={20} height={20} fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                  <input
                    type='text'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('Search')}
                  />
                  <span className='study-test__side-result'>
                    {index === 1 ? 1 : (index + 1) / 2}/{(chunks.length - 1) / 2}
                  </span>
                </div>
              </div>
              {search?.length > 3 && (
                <div className='study-test__side-buttons'>
                  <button onClick={next}>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M5 8L12 15L19 8'
                        stroke='currentColor'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </button>
                  <button onClick={prev}>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M19 16L12 9L5 16'
                        stroke='currentColor'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </button>
                  <button onClick={() => setSearch('')}>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <g clip-path='url(#clip0_2862_682)'>
                        <path
                          d='M7.01961 7.02141L16.9191 16.9209'
                          stroke='currentColor'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M16.9191 7.0205L7.01961 16.92'
                          stroke='currentColor'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_2862_682'>
                          <rect width='24' height='24' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className='study-test__head'>
              {data?.map((el: any) => (
                <li onClick={() => setSelected(el.id)} className={el.id === selected ? 'current' : ''}>
                  {el?.name?.[i18n.language]}
                </li>
              ))}
            </div>
            <div className='study-test__table' id='scrollContainer'>
              <WithHtml html={formattedHTML} />
            </div>
            <button className='study-test__side-close' onClick={props.close}>
              {t('Shut down')}
            </button>
          </div>
        </div>
      )}
    </GetContainer>
  )
}

export default LabsTable
