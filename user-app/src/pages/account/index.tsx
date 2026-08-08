import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import MessagesIcon from '../../img/icons/MessagesIcon'
import SettingsIcon from '../../img/icons/SettingsIcon'
import TariffsIcon from '../../img/icons/TariffsIcon'
import WalletIcon from '../../img/icons/WalletIcon'
import AccountIcon from '../../img/icons/AccountIcon'
import { MainLayout } from '../../layouts/main'
import Overview from './components/Overview'
import Devices from './components/Devices'
import Payments from './components/Payments'
import Settings from './components/Settings'
import Tariffs from './components/Tariffs'
import Messages from './components/Messages'
import { useContext } from 'react'
import { AuthContext } from '../../providers/auth-provider'
import './account.scss'

type TabKey = 'account' | 'devices' | 'tariffs' | 'payments' | 'messages' | 'settings'

const DeviceIcon = () => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='2.5' y='5' width='13' height='10' rx='2' stroke='currentColor' strokeWidth='1.5' />
    <rect x='16.5' y='9' width='5' height='10' rx='1.5' stroke='currentColor' strokeWidth='1.5' />
    <path d='M6 19h5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
)

/*
 * Bo'limlar — referensdagidek chapda ro'yxat, o'ngda tanlangani.
 * `payments`, `tariffs`, `messages` kalitlari o'zgarmadi: ilovaning boshqa
 * joyidagi `/account?type=...` havolalari ishlashda davom etsin.
 */
const TABS: { key: TabKey; icon: JSX.Element; label: string }[] = [
  { key: 'account', icon: <AccountIcon />, label: 'Account' },
  { key: 'devices', icon: <DeviceIcon />, label: 'Devices' },
  { key: 'tariffs', icon: <TariffsIcon />, label: 'Tariffs' },
  { key: 'payments', icon: <WalletIcon />, label: 'Payments' },
  { key: 'messages', icon: <MessagesIcon />, label: 'Messages' },
  { key: 'settings', icon: <SettingsIcon />, label: 'Settings' }
]

const Caret = () => (
  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M9 6l6 6-6 6' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

export const Account = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useContext(AuthContext)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!searchParams.has('type')) {
      setSearchParams({ type: 'account' }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const requested = searchParams.get('type') as TabKey | null
  const activeTab: TabKey = TABS.some(tab => tab.key === requested) ? (requested as TabKey) : 'account'

  const go = (key: TabKey) => setSearchParams({ type: key })

  return (
    <MainLayout>
      <section className='account'>
        <h1 className='ui-title account__title'>{t('Personal cabinet')}</h1>

        <div className='account-grid'>
          {/* ---------- Chap: bo'limlar ---------- */}
          <nav className='acc-nav' aria-label={t('Personal cabinet')}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                type='button'
                className={`acc-nav__item ${activeTab === tab.key ? 'is-active' : ''}`}
                aria-current={activeTab === tab.key ? 'page' : undefined}
                onClick={() => go(tab.key)}
              >
                <span className='acc-nav__icon'>{tab.icon}</span>
                <span className='acc-nav__label'>{t(tab.label)}</span>
                <span className='acc-nav__caret'>
                  <Caret />
                </span>
              </button>
            ))}
          </nav>

          {/* ---------- O'ng: tanlangan bo'lim ---------- */}
          <div className='account-main'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
              >
                {activeTab === 'account' && (
                  <Overview onManageTariffs={() => go('tariffs')} onEdit={() => go('settings')} />
                )}
                {activeTab === 'devices' && <Devices />}
                {activeTab === 'tariffs' && <Tariffs />}
                {activeTab === 'payments' && <Payments />}
                {activeTab === 'messages' && <Messages />}
                {activeTab === 'settings' && <Settings userData={user} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
