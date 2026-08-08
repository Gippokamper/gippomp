import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import Modal from '../../../components/modal'
import lightIcon from '../../../img/icons/exit-light.svg'
import darkIcon from '../../../img/icons/exit-dark.svg'
import { AuthContext } from '../../../providers/auth-provider'
import { MEDIA_URL, logout } from '../../../helpers/request'

interface IProps {
  /** Tariflar bo'limiga o'tish. */
  onManageTariffs: () => void
  /** Sozlamalar bo'limiga o'tish (ma'lumotlarni tahrirlash). */
  onEdit: () => void
}

const CopyIcon = () => (
  <svg width={16} height={16} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <rect x='9' y='9' width='11' height='11' rx='2' stroke='currentColor' strokeWidth='1.6' />
    <path
      d='M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
    />
  </svg>
)

const CheckIcon = () => (
  <svg width={16} height={16} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M5 12.5 10 17.5 19 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

/** 450000 -> "450 000" */
const formatAmount = (value: number | string | undefined) =>
  Math.round(Number(value) || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/**
 * "Akkaunt" bo'limi — profil ma'lumoti va amaldagi tarif.
 *
 * Shaxsiy hisob raqami sifatida foydalanuvchi `id` si ko'rsatiladi: to'lov
 * tizimlari aynan shuni kutadi (Payme `account.user_id`, Click
 * `merchant_trans_id`), shuning uchun nusxalash tugmasi bilan.
 */
function Overview({ onManageTariffs, onEdit }: IProps) {
  const { t, i18n } = useTranslation()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [copied, setCopied] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)

  const fullName = useMemo(
    () => [user?.firstname, user?.lastname].filter(Boolean).join(' '),
    [user?.firstname, user?.lastname]
  )

  const initials = useMemo(
    () =>
      [user?.firstname, user?.lastname]
        .filter(Boolean)
        .map((part: string) => part.trim().charAt(0).toUpperCase())
        .join('') || '?',
    [user]
  )

  const tariff = (user?.tariff ?? [])[0]

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(String(user?.id ?? ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // buferga ruxsat bo'lmasligi mumkin — jim o'tamiz
    }
  }

  return (
    <div className='acc-panel'>
      <div className='acc-panel__head'>
        <h2 className='acc-panel__title'>{t('Account')}</h2>
        <button type='button' className='acc-panel__action' onClick={onEdit}>
          {t('Edit profile')}
        </button>
      </div>

      <div className='acc-hero'>
        <span className='acc-hero__avatar'>
          {user?.image ? <img src={MEDIA_URL + user.image} alt='' /> : <span>{initials}</span>}
        </span>
        <span className='acc-hero__name'>{fullName || '—'}</span>
      </div>

      <dl className='acc-facts'>
        <div className='acc-facts__row'>
          <dt>{t('Personal account number')}</dt>
          <dd>
            <b className='acc-facts__num'>{user?.id ?? '—'}</b>
            <button
              type='button'
              className='acc-facts__copy'
              title={copied ? t('Copied') : t('Copy')}
              aria-label={copied ? t('Copied') : t('Copy')}
              onClick={copyAccount}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </dd>
        </div>

        <div className='acc-facts__row'>
          <dt>{t('Balance')}</dt>
          <dd>
            <b className='acc-facts__num'>
              {formatAmount(user?.wallet?.amount)} {t('UZS')}
            </b>
          </dd>
        </div>

        <div className='acc-facts__row'>
          <dt>{t('Phone number')}</dt>
          <dd>{user?.phone ? `+${user.phone}` : '—'}</dd>
        </div>

        {!!user?.email && (
          <div className='acc-facts__row'>
            <dt>{t('Email')}</dt>
            <dd className='acc-facts__ellipsis'>{user.email}</dd>
          </div>
        )}
      </dl>

      {/* Amaldagi tarif — referensdagi "Mening tarifim" kartasi */}
      <div className='acc-tariff'>
        <div className='acc-tariff__row'>
          <span className='acc-tariff__label'>{t('My tariff')}</span>
          <span className={`acc-tariff__value ${tariff ? '' : 'is-empty'}`}>
            {tariff ? tariff?.name?.[i18n.language] : t('Active tariff not found')}
          </span>
        </div>

        {!!tariff?.end_date && (
          <div className='acc-tariff__until'>
            {t('Valid until')} {moment(tariff.end_date).format('DD.MM.YYYY')}
          </div>
        )}

        {!tariff && <div className='acc-tariff__warn'>{t('Purchase a tariff to access all materials')}</div>}

        <button type='button' className='ui-btn ui-btn--primary acc-tariff__btn' onClick={onManageTariffs}>
          {t('Manage tariffs')}
        </button>
      </div>

      <button type='button' className='acc-logout' onClick={() => setExitOpen(true)}>
        <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
          <path
            d='M15 4.5h2.5A2.5 2.5 0 0 1 20 7v10a2.5 2.5 0 0 1-2.5 2.5H15'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11 15.5 14.5 12 11 8.5M14.5 12H4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <span>{t('Exit')}</span>
      </button>

      <Modal
        isOpen={exitOpen}
        lightIcon={lightIcon}
        darkIcon={darkIcon}
        close={() => setExitOpen(false)}
        onAccept={async () => {
          await logout()
          setExitOpen(false)
          navigate('/sign-in')
        }}
        acceptTitle={t('Yes')}
        cancelTitle={t('No')}
        onCancel={() => setExitOpen(false)}
        title={t('Do you want to log out?')}
        description={t("After you sign out, you'll need to enter your credentials again to sign in")}
      />
    </div>
  )
}

export default Overview
