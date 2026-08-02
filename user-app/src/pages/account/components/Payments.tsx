import React, { useEffect, useState } from 'react'
import GetContainer from '../../../components/get-container'
import PaginatedItems from '../../../components/pagination'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import './payments.scss'

/** 450000 -> "450 000" */
const formatAmount = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** message ba'zan ko'p tilli JSON, ba'zan oddiy matn bo'ladi. */
const readMessage = (raw: unknown, lang: string): string => {
  if (typeof raw !== 'string') {
    return ''
  }
  try {
    const parsed = JSON.parse(raw)
    return parsed?.[lang] ?? parsed?.uz ?? raw
  } catch {
    return raw
  }
}

function Payments() {
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const { i18n, t } = useTranslation()

  // Ilgari har bosilgan harfga so'rov ketardi. Endi yozib bo'lingandan
  // keyin — 400ms jimlikdan so'ng.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPageNumber(1)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [search])

  return (
    <GetContainer
      url='dashboard/user/payments'
      params={{
        perPage: 10,
        page: pageNumber,
        search: debouncedSearch
      }}
    >
      {({ data, isLoading }) => (
        <div className='account-tab'>
          <div className='account-search acc-pay-search'>
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
                {/*
                  Ilgari `paddingLeft: 30` (px) edi. Loyihada ildiz shrifti
                  o'zgaruvchan (30px dan 10px gacha), shuning uchun rem'da
                  berilgan ikonka px'dagi padding'ni bosib ketardi — matn
                  lupa ustiga chiqib qolardi.
                */}
                <input
                  className='acc-pay-search__input'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type='text'
                  placeholder={t('Search')}
                />
              </div>
            </div>
          </div>

          <ul className='acc-pay'>
            {data?.data?.map((payment: any) => {
              // Eski yozuvlarning 95% ida `amount` bo'sh (NULL) — summa
              // ustuni faqat qiymat bor bo'lganda ko'rsatiladi.
              const amount = payment?.amount != null ? Number(payment.amount) : null

              return (
                <li key={payment?.id ?? payment?.date} className='acc-pay__item'>
                  <div className='acc-pay__body'>
                    <span className='acc-pay__status'>{t('Passed')}</span>
                    <p className='acc-pay__text'>{readMessage(payment?.message, i18n.language)}</p>
                    <time className='acc-pay__date'>{moment(payment?.date).format('DD.MM.YYYY, HH:mm')}</time>
                  </div>
                  {amount !== null && (
                    <div className='acc-pay__amount'>
                      −{formatAmount(amount)} <span>{t('UZS')}</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {!isLoading && !data?.data?.length && <p className='acc-pay__empty'>{t('No payments yet')}</p>}

          {data && <PaginatedItems total={data?.meta?.total} itemsPerPage={10} setPageNumber={setPageNumber} />}
        </div>
      )}
    </GetContainer>
  )
}

export default Payments
