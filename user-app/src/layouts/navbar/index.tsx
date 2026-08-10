import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import ToggleIcon from '../../img/icons/ToggleIcon'
import uz from '../../img/icons/uz.svg'
import ru from '../../img/icons/ru.svg'
import en from '../../img/icons/en.svg'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GetContainer from '../../components/get-container'
import Modal from '../../components/modal'
import lightIcon from '../../img/icons/exit-light.svg'
import darkIcon from '../../img/icons/exit-dark.svg'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { request, logout, MEDIA_URL } from '../../helpers/request'
import { RootState } from '../../store'
import { setSidebarCollapsed, setTheme } from '../../store/siteSlice/siteSlice'
import { THEME_OPTIONS } from '../../data/theme_options'
import Segmented from '../../components/segmented'
import type { Theme } from '../../store/siteSlice/siteSlice'
import { AuthContext } from '../../providers/auth-provider'
import AccountIcon from '../../img/icons/AccountIcon'
import SearchPalette from '../../components/search-palette'

/*
 * Menyuning yig'ilgan holati ilgari prop orqali kelardi va har layout uni o'z
 * `useState` ida saqlardi. Endi u Redux'da (`site.sidebarCollapsed`) —
 * sarlavha panelini to'rt layout ham bir xil chaqiradi.
 */
interface IProps {
  openMobileMenu: () => void
}

const LANGUAGES = [
  { value: 'uz', flag: uz },
  { value: 'ru', flag: ru },
  { value: 'en', flag: en }
]

const READ_NOTIFICATION = async (id: number) => {
  const response = await request({
    url: '/dashboard/user/notification/feedback/is_read/' + id,
    method: 'POST'
  })
  return response.data
}

/*
 * Menyudagi belgilar bir uslubda bo'lsin. Umumiy `HelpIcon` to'rtburchak
 * ramkali — yonidagi ingichka chiziqli odam/oy/chiqish belgilaridan
 * og'irroq ko'rinardi, shuning uchun bu yerda dumaloq varianti.
 */
const HelpCircleIcon = () => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.5' />
    <path
      d='M9.75 9.5a2.25 2.25 0 1 1 3.2 2.04c-.6.29-.95.9-.95 1.57v.24'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle cx='12' cy='16.6' r='.85' fill='currentColor' />
  </svg>
)

/*
 * Sarlavhaning chap tomoni — qayerdaligingiz. To'liq yo'l emas, faqat bo'lim
 * nomi: kutubxona va maqola sahifalari to'liq mundarijani o'zi chizadi, uni
 * ikki marta ko'rsatish ortiqcha edi.
 */
const SECTIONS: Array<[string, string]> = [
  ['/library', 'Library'],
  ['/article', 'Library'],
  ['/quizzes', 'Test your knowledge'],
  ['/detail', 'Test your knowledge'],
  ['/videos', 'Videos'],
  ['/news', 'News'],
  ['/study-plan', 'Educational program'],
  ['/saved', 'Saved'],
  ['/account', 'Personal cabinet'],
  ['/help', 'Help center']
]

const SearchIcon = () => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='1.9' />
    <path d='M20 20l-3.6-3.6' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' />
  </svg>
)

const ExitIcon = () => (
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
)

function Navbar(props: IProps) {
  const { i18n , t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [visibleMenu, setVisibleMenu] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [notsShow, setNotsShow] = useState(false)

  /*
   * Bosh sahifaning o'zi qidiruv ekrani — sarlavhada ikkinchi kirish nuqtasi
   * ortiqcha, qaysi biriga yozish kerakligi ham tushunarsiz edi. Ctrl+K ni
   * ham o'sha sahifaning o'zi ushlaydi.
   */
  const isHome = pathname === '/home'
  const showSearch = !isHome

  /** Qaysi bo'limdamiz — sarlavhaning chap tomonidagi yozuv. */
  const section = useMemo(() => {
    const found = SECTIONS.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'))
    return found ? t(found[1]) : ''
  }, [pathname, t])
  const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notsRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  /* Raqamni almashish buferiga nusxalaydi va bir zumga tasdiq belgisini ko'rsatadi. */
  const copyAccount = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // buferga ruxsat berilmagan bo'lishi mumkin — jim o'tamiz
    }
  }
  const { user } = useContext(AuthContext)

  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(' ')

  /*
   * Ism ostidagi izoh. Tarif eng foydalisi ("Premium"), u yo'q bo'lsa kasb,
   * u ham bo'lmasa rol ("user" -> Talaba). Bazada ko'p foydalanuvchida kasb
   * ham, amaldagi tarif ham bo'lmaydi — shuning uchun rol oxirgi tayanch.
   */
  const subtitle = useMemo(() => {
    const tariff = user?.tariff?.[0]?.name?.[i18n.language]
    if (tariff) return tariff
    if (user?.profession) return user.profession
    return user?.role ? t(user.role === 'user' ? 'Student' : 'Administrator') : ''
  }, [user, i18n.language, t])
  // Rasm bo'lmasa — ism va familiya bosh harflari.
  const initials = useMemo(
    () =>
      [user?.firstname, user?.lastname]
        .filter(Boolean)
        .map((part: string) => part.trim().charAt(0).toUpperCase())
        .join('') || '?',
    [user]
  )

  /* Ctrl+K — qidiruv palitrasi. Bosh sahifada bu birikmani sahifaning o'zi
     ushlaydi, shuning uchun u yerda tinglamaymiz. */
  useEffect(() => {
    if (!showSearch) return

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showSearch])

  /* Menyu tashqariga bosilganda yoki Esc bosilganda yopilsin — aks holda
     boshqa joyni bosgandan keyin ham ochiq turib qolardi. */
  useEffect(() => {
    if (!visibleMenu) return

    const onPointerDown = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setVisibleMenu(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisibleMenu(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [visibleMenu])
  /* Bildirishnoma oynasi ham tashqariga bosilganda yopilsin. */
  useEffect(() => {
    if (!notsShow) return

    const onPointerDown = (e: MouseEvent) => {
      if (!notsRef.current?.contains(e.target as Node)) setNotsShow(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotsShow(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [notsShow])

  const { mutate } = useMutation(READ_NOTIFICATION, {
    onSuccess: () => {
      navigate('/account?type=messages')
      setNotsShow(false)
    }
  })
  return (
    <header className='header'>
      <a href='/' className='header__logo'>
        <ToggleIcon />
      </a>
      <div className='header-wrap'>
        <button
          className='header__side'
          aria-expanded={!sidebarCollapsed}
          aria-label={t('Main menu', 'Asosiy menyu')}
          onClick={() => dispatch(setSidebarCollapsed())}
        >
          <svg width={30} height={36} viewBox='0 0 30 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_2522_2651)'>
              <path
                d='M23.125 0.5H6.875C5.05225 0.502316 3.30472 1.34811 2.01583 2.85181C0.726951 4.3555 0.00198521 6.39429 0 8.52083L0 27.4792C0.00198521 29.6057 0.726951 31.6445 2.01583 33.1482C3.30472 34.6519 5.05225 35.4977 6.875 35.5H23.125C24.9478 35.4977 26.6953 34.6519 27.9842 33.1482C29.273 31.6445 29.998 29.6057 30 27.4792V8.52083C29.998 6.39429 29.273 4.3555 27.9842 2.85181C26.6953 1.34811 24.9478 0.502316 23.125 0.5V0.5ZM26.25 27.4792C26.25 28.4461 25.9208 29.3734 25.3347 30.0572C24.7487 30.7409 23.9538 31.125 23.125 31.125H6.875C6.0462 31.125 5.25134 30.7409 4.66529 30.0572C4.07924 29.3734 3.75 28.4461 3.75 27.4792V8.52083C3.75 7.5539 4.07924 6.62657 4.66529 5.94284C5.25134 5.25911 6.0462 4.875 6.875 4.875H23.125C23.9538 4.875 24.7487 5.25911 25.3347 5.94284C25.9208 6.62657 26.25 7.5539 26.25 8.52083V27.4792Z'
                fill='currentColor'
              />
              <rect x={15} y='2.25' width={12} height='29.75' fill='currentColor' />
            </g>
            <defs>
              <clipPath id='clip0_2522_2651'>
                <rect width={30} height={35} fill='white' transform='translate(0 0.5)' />
              </clipPath>
            </defs>
          </svg>
        </button>
        {/*
          Keng qidiruv maydoni o'rniga — qayerdaligingiz. Maydonning o'zi
          Ctrl+K palitrasiga ko'chdi (o'ngdagi lupa tugmasi).
        */}
        <span className='header__where'>
          {isHome ? [t('Hello', 'Salom'), user?.firstname].filter(Boolean).join(', ') : section}
        </span>
      </div>
      <div className='header-wrap'>
        {/* Qidiruv — endi maydon emas, tugma: bosilsa markazda palitra ochiladi. */}
        {showSearch && (
          <button
            type='button'
            className='header__icon-btn'
            title={`${t('Search')} · Ctrl + K`}
            aria-label={t('Search')}
            onClick={() => setPaletteOpen(true)}
          >
            <SearchIcon />
          </button>
        )}

        {/* Saqlanganlar — bildirishnomaning chapida. */}
        <NavLink
          className={({ isActive }) => `header__icon-btn ${isActive ? 'is-current' : ''}`}
          to='/saved'
          title={t('Saved')}
          aria-label={t('Saved')}
        >
          <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path
              d='M6.5 4.5h11a1 1 0 0 1 1 1v14.2a.6.6 0 0 1-.94.5L12 16.4l-5.56 3.8a.6.6 0 0 1-.94-.5V5.5a1 1 0 0 1 1-1Z'
              stroke='currentColor'
              strokeWidth='1.9'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </NavLink>

        <GetContainer url='/dashboard/user/notification/feedback'>
          {({ data, isLoading }) => (
            <div className='header-nots__wrap' ref={notsRef}>
              {/* `btn` sinfi olib tashlandi — u to'la yashil doira berardi. */}
              <button className='header__nots' aria-expanded={notsShow} onClick={() => setNotsShow(!notsShow)}>
                <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M18.7951 11.0096L17.3351 5.76457C16.8641 4.07453 15.8419 2.59034 14.4308 1.54781C13.0197 0.505282 11.3007 -0.0357892 9.54683 0.0105607C7.793 0.0569106 6.10497 0.688023 4.75091 1.80363C3.39685 2.91923 2.45443 4.45534 2.07339 6.1679L0.945058 11.2421C0.796203 11.912 0.799683 12.6068 0.955243 13.2752C1.1108 13.9436 1.41447 14.5685 1.84384 15.1038C2.2732 15.6392 2.8173 16.0713 3.43598 16.3682C4.05467 16.6652 4.73213 16.8194 5.41839 16.8196H5.75173C6.01692 17.7367 6.57292 18.5428 7.336 19.1164C8.09907 19.6901 9.02789 20.0003 9.98256 20.0003C10.9372 20.0003 11.866 19.6901 12.6291 19.1164C13.3922 18.5428 13.9482 17.7367 14.2134 16.8196H14.3742C15.0808 16.8196 15.7779 16.6564 16.4109 16.3424C17.044 16.0285 17.5959 15.5725 18.0235 15.01C18.4511 14.4474 18.7429 13.7937 18.876 13.0997C19.0091 12.4057 18.98 11.6904 18.7909 11.0096H18.7951ZM16.0376 13.4962C15.8441 13.7531 15.5934 13.9613 15.3054 14.1042C15.0173 14.2471 14.6999 14.3209 14.3784 14.3196H5.41839C5.10648 14.3195 4.79856 14.2494 4.51737 14.1144C4.23617 13.9795 3.98886 13.7831 3.7937 13.5398C3.59854 13.2965 3.4605 13.0124 3.38978 12.7086C3.31905 12.4049 3.31744 12.0891 3.38506 11.7846L4.51339 6.70124C4.77249 5.53129 5.41551 4.48165 6.3401 3.71939C7.26468 2.95713 8.41768 2.52607 9.61557 2.49483C10.8134 2.46359 11.9874 2.83397 12.9504 3.54699C13.9135 4.26002 14.6103 5.27472 14.9301 6.42957L16.3867 11.6746C16.4746 11.9844 16.4888 12.3105 16.4282 12.6268C16.3676 12.9431 16.2338 13.2409 16.0376 13.4962V13.4962Z'
                    fill='currentColor'
                  />
                </svg>
                {data?.data?.length ? (
                  <div className='count'>
                    <span>{data?.data?.length}</span>
                  </div>
                ) : (
                  <div />
                )}
              </button>

              <div className={`header-nots ${notsShow ? 'show' : 'hide'}`}>
                <div className='header-nots__head'>
                  <span>{t('Notifications')}</span>
                  {!!data?.data?.length && <span className='ui-count'>{data.data.length}</span>}
                </div>

                {data?.data?.length > 0 ? (
                  <ul className='header-nots__list'>
                    {data.data.map((item: any) => (
                      <li key={item?.id}>
                        <button className='header-nots__btn' onClick={() => mutate(item?.feedback_id?.id)}>
                          <span className='header-nots__avatar'>{(item?.author ?? '?').charAt(0).toUpperCase()}</span>
                          <span className='header-nots__text'>
                            <b>{item?.author}</b>
                            <span>{item?.message}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className='header-nots__empty'>
                    <svg width={28} height={28} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                      <path
                        d='M18 8.5a6 6 0 1 0-12 0c0 6-2 7.5-2 7.5h16s-2-1.5-2-7.5Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path d='M13.7 19.5a2 2 0 0 1-3.4 0' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                    </svg>
                    <span>{t('There are no new notifications')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </GetContainer>
        {/* Tugma va menyu bitta o'ramda — menyu shu tugmaga nisbatan joylashadi
            va tashqariga bosilganini shu o'ram orqali aniqlaymiz. */}
        <div className='header-user__wrap' ref={userMenuRef}>
        {/*
          Yalang'och doira emas, qator: kichik avatar + ism + strelka.
          Ismi yonida turgani uchun kim kirgani bir qarashda ko'rinadi.
        */}
        <button className='header__user' aria-expanded={visibleMenu} onClick={() => setVisibleMenu(!visibleMenu)}>
          <span className='header__user-avatar'>
            {user?.image ? (
              <img src={MEDIA_URL + user.image} alt='' />
            ) : (
              <span className='header__user-initials'>{initials}</span>
            )}
          </span>
          {!!fullName && (
            <span className='header__user-who'>
              <b>{fullName}</b>
              {!!subtitle && <span>{subtitle}</span>}
            </span>
          )}
          <svg className='header__user-caret' width='12' height='12' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </button>

        <ul
          className='header-user'
          style={{
            display: visibleMenu ? 'block' : 'none'
          }}
        >
          {/* Kim tizimga kirgani darrov ko'rinib tursin. */}
          <li className='header-user__card'>
            <span className='header-user__avatar'>
              {user?.image ? <img src={MEDIA_URL + user.image} alt='' /> : <span>{initials}</span>}
            </span>
            <span className='header-user__who'>
              <b>{fullName || t('Personal cabinet')}</b>
              {!!user?.phone && <span>+{user.phone}</span>}
            </span>
          </li>

          {/*
            Shaxsiy hisob raqami — to'lov qilayotganda kiritiladigan raqam.
            Payme `account.user_id`, Click esa `merchant_trans_id` sifatida
            aynan shu `id` ni kutadi, shuning uchun boshqa maydon emas.
          */}
          {!!user?.id && (
            <li className='header-user__account'>
              <span className='header-user__account-label'>{t('Personal account number')}</span>
              <span className='header-user__account-row'>
                <b>{user.id}</b>
                <button
                  type='button'
                  className='header-user__copy'
                  title={t('Copy')}
                  aria-label={t('Copy')}
                  onClick={() => copyAccount(String(user.id))}
                >
                  {copied ? (
                    <svg width={16} height={16} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                      <path d='M5 12.5 10 17.5 19 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  ) : (
                    <svg width={16} height={16} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                      <rect x='9' y='9' width='11' height='11' rx='2' stroke='currentColor' strokeWidth='1.6' />
                      <path d='M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
                    </svg>
                  )}
                </button>
              </span>
            </li>
          )}
          <li className='header-user__sep' aria-hidden='true' />

          {/*
            Shaxsiy kabinet, yordam markazi va tungi rejim ilgari chap menyuda
            edi — bu yerga ko'chirildi, chap menyuda faqat o'quv modullari qoldi.
          */}
          <li>
            <button
              onClick={() => {
                setVisibleMenu(false)
                navigate('/account')
              }}
            >
              <AccountIcon />
              <span>{t('Personal cabinet')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setVisibleMenu(false)
                navigate('/help')
              }}
            >
              <HelpCircleIcon />
              <span>{t('Help center')}</span>
            </button>
          </li>
          {/*
            Uchta ko'rinish: kunduzgi, o'qish (iliq qog'oz) va tungi.
            Bitta almashtirgich o'rniga segment — qaysi rejim yoqilgani ko'rinib
            tursin va bir bosishda istalganiga o'tilsin.
          */}
          <li className='header-user__sep' aria-hidden='true' />
          <li className='header-user__label'>{t('Appearance')}</li>
          <li>
            <Segmented
              ariaLabel={t('Appearance')}
              value={theme}
              onChange={next => dispatch(setTheme(next as Theme))}
              options={THEME_OPTIONS.map(option => ({
                value: option.value,
                label: t(option.label),
                icon: option.icon
              }))}
            />
          </li>

          {/* Til ilgari sarlavhada alohida turardi — bu yerga ko'chirildi. */}
          <li className='header-user__sep' aria-hidden='true' />
          <li className='header-user__label'>{t('Language')}</li>
          <li>
            <Segmented
              ariaLabel={t('Language')}
              value={i18n.language}
              onChange={next => i18n.changeLanguage(next)}
              options={LANGUAGES.map(lang => ({
                value: lang.value,
                label: lang.value.toUpperCase(),
                icon: <img src={lang.flag} alt='' />
              }))}
            />
          </li>

          {/* Chiqish qolganlaridan ajratib turadi — tasodifan bosilmasin. */}
          <li className='header-user__sep' aria-hidden='true' />
          <li>
            <button
              className='is-danger'
              onClick={() => {
                setModalOpen(true)
                setVisibleMenu(false)
              }}
            >
              <ExitIcon />
              <span>{t('Exit')}</span>
            </button>
          </li>
        </ul>
        </div>

        <div className='header-mobile' onClick={props.openMobileMenu}>
          <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M22.5 10.5H1.5C0.671578 10.5 0 11.1716 0 12C0 12.8284 0.671578 13.5 1.5 13.5H22.5C23.3284 13.5 24 12.8284 24 12C24 11.1716 23.3284 10.5 22.5 10.5Z'
              fill='currentColor'
            />
            <path
              d='M1.5 6.50001H22.5C23.3284 6.50001 24 5.82843 24 5C24 4.17158 23.3284 3.5 22.5 3.5H1.5C0.671578 3.5 0 4.17158 0 5C0 5.82843 0.671578 6.50001 1.5 6.50001Z'
              fill='currentColor'
            />
            <path
              d='M22.5 17.5H1.5C0.671578 17.5 0 18.1716 0 19C0 19.8284 0.671578 20.5 1.5 20.5H22.5C23.3284 20.5 24 19.8284 24 19C24 18.1716 23.3284 17.5 22.5 17.5Z'
              fill='currentColor'
            />
          </svg>
        </div>
      </div>
      <SearchPalette isOpen={paletteOpen} close={() => setPaletteOpen(false)} />
      <Modal
        isOpen={modalOpen}
        lightIcon={lightIcon}
        darkIcon={darkIcon}
        close={() => setModalOpen(false)}
        onAccept={async () => {
          await logout()
          setModalOpen(false)
          navigate('/sign-in')
        }}
        acceptTitle={t('Yes')}
        cancelTitle={t('No')}
        onCancel={() => setModalOpen(false)}
        title={t('Do you want to log out?')}
        description={t("After you sign out, you'll need to enter your credentials again to sign in")}
      />
    </header>
  )
}

export default Navbar
