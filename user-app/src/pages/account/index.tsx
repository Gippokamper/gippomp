import { useContext, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import MessagesIcon from '../../img/icons/MessagesIcon'
import SettingsIcon from '../../img/icons/SettingsIcon'
import TariffsIcon from '../../img/icons/TariffsIcon'
import WalletIcon from '../../img/icons/WalletIcon'
import { MainLayout } from '../../layouts/main'
import Payments from './components/Payments'
import Settings from './components/Settings'
import Tariffs from './components/Tariffs'
import Messages from './components/Messages'
import { MEDIA_URL } from '../../helpers/request'
import { AuthContext } from '../../providers/auth-provider'
import './account.scss'

type TabKey = 'payments' | 'tariffs' | 'settings' | 'messages'

const TABS: { key: TabKey; icon: JSX.Element; label: string }[] = [
  { key: 'payments', icon: <WalletIcon />, label: 'Payments' },
  { key: 'tariffs', icon: <TariffsIcon />, label: 'Tariffs' },
  { key: 'settings', icon: <SettingsIcon />, label: 'Settings' },
  { key: 'messages', icon: <MessagesIcon />, label: 'Messages' }
]

/** 450000 -> "450 000" */
const formatAmount = (value: number | string | undefined) =>
  Math.round(Number(value) || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

export const Account = () => {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useContext(AuthContext)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!searchParams.has('type')) {
      setSearchParams({ type: 'payments' }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const activeTab = (searchParams.get('type') as TabKey) ?? 'payments'

  const fullName = useMemo(
    () => [user?.firstname, user?.lastname].filter(Boolean).join(' '),
    [user?.firstname, user?.lastname]
  )

  const activeTariffs: any[] = user?.tariff ?? []

  return (
    <MainLayout>
      <section className='account'>
        <h1 className='account__title section-title'>{t('Personal cabinet')}</h1>

        <div className='account-content'>
          {/* ---------- Chap ustun: profil kartochkasi ---------- */}
          <aside className='acc-profile'>
            <div className='acc-profile__top'>
              <img
                className='acc-profile__avatar'
                src={user?.image ? MEDIA_URL + user.image : '/image.png'}
                alt=''
              />
              <div className='acc-profile__ident'>
                <div className='acc-profile__name'>{fullName || '—'}</div>
                {user?.profession && <div className='acc-profile__role'>{t(user.profession)}</div>}
              </div>
            </div>

            {/* Hamyon — ilgari shunchaki raqam edi, endi to'ldirish tugmasi bilan */}
            <div className='acc-profile__wallet'>
              <div className='acc-profile__wallet-label'>{t('Your balance')}</div>
              <div className='acc-profile__wallet-value'>
                {formatAmount(user?.wallet?.amount)} <span>{t('UZS')}</span>
              </div>
              <button
                type='button'
                className='acc-profile__topup'
                onClick={() => setSearchParams({ type: 'tariffs' })}
              >
                {t('Tariffs')}
              </button>
            </div>

            <dl className='acc-profile__facts'>
              <div className='acc-profile__fact'>
                <dt>{t('Tariff')}</dt>
                <dd>
                  {activeTariffs.length ? (
                    activeTariffs.map((tariff: any) => (
                      <span key={tariff.id} className='acc-profile__tariff'>
                        {tariff?.name?.[i18n.language]} ({tariff?.term_id?.name?.[i18n.language]})
                      </span>
                    ))
                  ) : (
                    <span className='acc-profile__muted'>{t('Active tariff not found')}</span>
                  )}
                </dd>
              </div>

              <div className='acc-profile__fact'>
                <dt>{t('Phone number')}</dt>
                <dd>+{user?.phone}</dd>
              </div>

              {user?.email && (
                <div className='acc-profile__fact'>
                  <dt>{t('Email')}</dt>
                  <dd className='acc-profile__ellipsis'>{user.email}</dd>
                </div>
              )}

              {user?.gender && (
                <div className='acc-profile__fact'>
                  <dt>{t('Sex')}</dt>
                  <dd>{t(user.gender)}</dd>
                </div>
              )}

              <div className='acc-profile__fact'>
                <dt>{t('user id:')}</dt>
                <dd>{user?.wallet?.user_id ?? user?.id}</dd>
              </div>
            </dl>
          </aside>

          {/* ---------- O'ng ustun: tablar ---------- */}
          <div className='account-main'>
            {/*
              Ilgari bu <li onClick> edi: Tab bilan fokus olmasdi va Enter
              bilan ochilmasdi. Endi haqiqiy tugmalar + tab semantikasi.
            */}
            <div className='acc-tabs' role='tablist' aria-label={t('Personal cabinet')}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  type='button'
                  role='tab'
                  id={`acc-tab-${tab.key}`}
                  aria-selected={activeTab === tab.key}
                  aria-controls={`acc-panel-${tab.key}`}
                  className={`acc-tabs__btn ${activeTab === tab.key ? 'is-active' : ''}`}
                  onClick={() => setSearchParams({ type: tab.key })}
                >
                  {tab.icon}
                  <span>{t(tab.label)}</span>
                  {activeTab === tab.key && (
                    <motion.span layoutId='acc-tab-underline' className='acc-tabs__underline' />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                id={`acc-panel-${activeTab}`}
                role='tabpanel'
                aria-labelledby={`acc-tab-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
              >
                {activeTab === 'payments' && <Payments />}
                {activeTab === 'tariffs' && <Tariffs />}
                {activeTab === 'settings' && <Settings userData={user} />}
                {activeTab === 'messages' && <Messages />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
