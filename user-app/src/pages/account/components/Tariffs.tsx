import { useContext, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import toast from 'react-hot-toast'
import moment from 'moment'

import { MEDIA_URL, request } from '../../../helpers/request'
import { useApiErrorHandler } from '../../../hooks/use-api-error-handler'
import { AuthContext } from '../../../providers/auth-provider'
import Success from '../../../components/notifications/Success'
import Error from '../../../components/notifications/Error'
import './tariffs.scss'

const BUY_TARIFF = async (id: number) => {
  const response = await request({ url: 'dashboard/user/tariffs/' + id, method: 'GET' })
  return response?.data
}

/** 450000 -> "450 000" */
const formatPrice = (value: number | string) =>
  Math.round(Number(value) || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const CheckIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M5 13l4 4L19 7' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

const DashIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M6 12h12' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
  </svg>
)

function Tariffs() {
  const { t, i18n } = useTranslation()
  const { user, refetchToken } = useContext(AuthContext)
  const handleApiError = useApiErrorHandler()
  const queryClient = useQueryClient()
  const reduceMotion = useReducedMotion()
  const [termId, setTermId] = useState<number | null>(null)

  const { data: termsData } = useQuery(
    ['tariff-terms'],
    async () => (await request({ url: 'dashboard/user/terms', method: 'GET' })).data,
    { onError: handleApiError }
  )

  const { data: tariffsData, isLoading } = useQuery(
    ['tariffs'],
    async () => (await request({ url: 'dashboard/user/tariffs', method: 'GET' })).data,
    { onError: handleApiError }
  )

  // Tarix jadvali olib tashlandi (To'lovlar tabi uni takrorlardi), lekin
  // so'rovning o'zi kerak: joriy tarifning tugash sanasi shu yerdan olinadi.
  const { data: historyData } = useQuery(
    ['tariff-history'],
    async () => (await request({ url: 'dashboard/user/tariffs/history', params: { perPage: 50 }, method: 'GET' })).data,
    { onError: handleApiError }
  )

  // `?? []` har render'da yangi massiv yaratadi — quyidagi useMemo'lar hech
  // qachon keshlanmasdi. Shuning uchun ular ham memolangan.
  const terms = useMemo(() => termsData?.data ?? [], [termsData])
  const tariffs = useMemo(() => tariffsData?.data ?? [], [tariffsData])
  const activeTerm = termId ?? terms[0]?.id ?? null

  /** Foydalanuvchining hozir faol tariflari (UserResource -> actualTariffs). */
  const activeTariffs: any[] = user?.tariff ?? []
  /** 0 — tarif yo'q, 1 — Standart, 2 — Premium (tariffs.sort ustuni). */
  const currentLevel = activeTariffs.length ? Math.max(...activeTariffs.map((el: any) => Number(el?.sort) || 0)) : 0

  /** Faol obunalarning eng kech tugash sanasi. */
  const activeUntil = useMemo(() => {
    const rows = (historyData?.data ?? []).filter((row: any) => row?.additional_info)
    if (!rows.length) {
      return null
    }
    return rows
      .map((row: any) => moment(row.end_date))
      .sort((a: any, b: any) => b.valueOf() - a.valueOf())[0]
  }, [historyData])

  /** Har bir muddat uchun oylik narxdagi tejamkorlik (1 oylik narxga nisbatan). */
  const savingsByTerm = useMemo(() => {
    const result: Record<number, number> = {}
    terms.forEach((term: any) => {
      const months = Number(term?.month_count) || 1
      if (months <= 1) {
        return
      }
      const forTerm = tariffs.filter((el: any) => el?.term_id?.id === term.id)
      const discounts = forTerm
        .map((el: any) => {
          const base = tariffs.find(
            (b: any) => b?.sort === el?.sort && Number(b?.term_id?.month_count) === 1
          )
          if (!base?.price) {
            return 0
          }
          const perMonth = Number(el.price) / months
          return 1 - perMonth / Number(base.price)
        })
        .filter((value: number) => value > 0)

      if (discounts.length) {
        result[term.id] = Math.round(Math.max(...discounts) * 100)
      }
    })
    return result
  }, [terms, tariffs])

  const visibleTariffs = useMemo(
    () =>
      tariffs
        .filter((el: any) => el?.term_id?.id === activeTerm)
        // `sort` ustuni tartibni beradi: Standart (1) chapda, Premium (2) o'ngda.
        .sort((a: any, b: any) => (Number(a?.sort) || 0) - (Number(b?.sort) || 0)),
    [tariffs, activeTerm]
  )

  const balance = Number(user?.wallet?.amount) || 0

  const { mutate: buy, isLoading: isBuying } = useMutation(BUY_TARIFF, {
    onSuccess: async res => {
      toast.custom(tr => <Success text={t(res?.message)} onClose={() => toast.dismiss(tr.id)} />)
      await refetchToken?.()
      await queryClient.invalidateQueries(['tariff-history'])
      await queryClient.invalidateQueries(['payments'])
    },
    onError: (e: any) => {
      toast.custom(tr => (
        <Error text={t(e?.response?.data?.message || e?.message)} onClose={() => toast.dismiss(tr.id)} />
      ))
    }
  })

  const cardVariants = reduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  return (
    <div className='account-tab'>
      <div className='acc-plans'>
        <header className='acc-plans__head'>
          <div>
            <h2 className='acc-plans__title'>{t('Tariffs')}</h2>
            <p className='acc-plans__balance'>
              {t('Your balance')}: <strong>{formatPrice(balance)} {t('UZS')}</strong>
            </p>
          </div>

          {/* Muddat tanlash — segment ko'rinishida */}
          <div className='acc-terms' role='tablist' aria-label={t('Tariffs')}>
            {terms.map((term: any) => (
              <button
                key={term.id}
                type='button'
                role='tab'
                aria-selected={activeTerm === term.id}
                className={`acc-terms__btn ${activeTerm === term.id ? 'is-active' : ''}`}
                onClick={() => setTermId(term.id)}
              >
                <span>{term?.name?.[i18n.language]}</span>
                {!!savingsByTerm[term.id] && <em className='acc-terms__save'>−{savingsByTerm[term.id]}%</em>}
              </button>
            ))}
          </div>
        </header>

        {isLoading ? (
          <div className='acc-plans__grid'>
            <div className='acc-plan acc-plan--skeleton' />
            <div className='acc-plan acc-plan--skeleton' />
          </div>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTerm ?? 'none'}
              className='acc-plans__grid'
              initial='hidden'
              animate='show'
              variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}
            >
              {visibleTariffs.map((el: any) => {
                const level = Number(el?.sort) || 0
                const price = Number(el.price) || 0
                const isCurrent = activeTariffs.some((active: any) => active?.id === el?.id)
                const isCoveredByHigher = !isCurrent && currentLevel > level
                const isUpgrade = currentLevel > 0 && level > currentLevel
                const notEnough = balance < price
                const isPremium = level >= 2

                let label = t('Purchase')
                if (isCurrent) {
                  label = t('Current tariff')
                } else if (isCoveredByHigher) {
                  label = t('A higher tariff is active')
                } else if (isUpgrade) {
                  label = t('Upgrade')
                }

                return (
                  <motion.article
                    key={el.id}
                    variants={cardVariants}
                    className={`acc-plan ${isPremium ? 'acc-plan--premium' : ''} ${isCurrent ? 'is-current' : ''}`}
                  >
                    {isCurrent && <div className='acc-plan__badge'>{t('Current tariff')}</div>}

                    <div className='acc-plan__head'>
                      <div>
                        <h3 className='acc-plan__name'>{el?.name?.[i18n.language]}</h3>
                        <p className='acc-plan__term'>{el?.term_id?.name?.[i18n.language]}</p>
                      </div>
                      {el?.photo && <img className='acc-plan__ico' src={MEDIA_URL + el.photo} alt='' />}
                    </div>

                    <div className='acc-plan__price'>
                      <span className='acc-plan__amount'>{formatPrice(price)}</span>
                      <span className='acc-plan__currency'>{t('UZS')}</span>
                    </div>

                    <ul className='acc-plan__list'>
                      {el?.advantages?.map((val: any, index: number) => (
                        <li key={`${el.id}-${index}`} className={val?.status ? 'is-on' : 'is-off'}>
                          <span className='acc-plan__check'>{val?.status ? <CheckIcon /> : <DashIcon />}</span>
                          <span>{val?.name?.[i18n.language]}</span>
                        </li>
                      ))}
                    </ul>

                    <div className='acc-plan__footer'>
                      {/*
                        "Bekor qilish" tugmasi ataylab yo'q: backend'da tarifni
                        bekor qiladigan endpoint yo'q va bu modelda bekor
                        qiladigan narsa ham yo'q — avtoto'lov mavjud emas, tarif
                        o'z sanasida tugaydi. O'rniga muddati ko'rsatiladi.
                      */}
                      {isCurrent && activeUntil && (
                        <p className='acc-plan__until'>
                          {t('Valid until')}: <strong>{activeUntil.format('DD.MM.YYYY')}</strong>
                        </p>
                      )}

                      {!isCurrent && !isCoveredByHigher && notEnough && (
                        <p className='acc-plan__hint'>
                          {t('Not enough money!')} — {formatPrice(price - balance)} {t('UZS')}
                        </p>
                      )}

                      <button
                        type='button'
                        className={`acc-plan__btn ${isUpgrade || isPremium ? 'acc-plan__btn--primary' : ''}`}
                        disabled={isCurrent || isCoveredByHigher || isBuying}
                        onClick={() => buy(el.id)}
                      >
                        {label}
                      </button>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Tariffs
