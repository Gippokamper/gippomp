import React, { useState } from 'react'
import ToggleIcon from '../../img/icons/ToggleIcon'
import uz from '../../img/icons/uz.svg'
import ru from '../../img/icons/ru.svg'
import en from '../../img/icons/en.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GetContainer from '../../components/get-container'
import Modal from '../../components/modal'
import lightIcon from '../../img/icons/exit-light.svg'
import darkIcon from '../../img/icons/exit-dark.svg'
import { useMutation } from 'react-query'
import { request, logout } from '../../helpers/request'

interface IProps {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  openMobileMenu: () => void
}

const READ_NOTIFICATION = async (id: number) => {
  const response = await request({
    url: '/dashboard/user/notification/feedback/is_read/' + id,
    method: 'POST'
  })
  return response.data
}

function Navbar(props: IProps) {
  const { i18n , t } = useTranslation()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [visibleMenu, setVisibleMenu] = useState(false)
  const navigate = useNavigate()
  const [notsShow, setNotsShow] = useState(false)
  const { mutate } = useMutation(READ_NOTIFICATION, {
    onSuccess: () => {
      navigate('/account?type=messages')
      setNotsShow(false)
    }
  })
  const langButtons = [
    {
      value: 'uz',
      button: (
        <button key='uz' onClick={() => i18n.changeLanguage('uz')} className='header-lang__item'>
          <img src={uz} alt='lang' />
          <span>UZ</span>
        </button>
      )
    },
    {
      value: 'ru',
      button: (
        <button key='ru' onClick={() => i18n.changeLanguage('ru')} className='header-lang__item'>
          <img src={ru} alt='lang' />
          <span>RU</span>
        </button>
      )
    },
    {
      value: 'en',
      button: (
        <button key='en' onClick={() => i18n.changeLanguage('en')} className='header-lang__item'>
          <img src={en} alt='lang' />
          <span>EN</span>
        </button>
      )
    }
  ]
  return (
    <header className='header'>
      <a href='/' className='header__logo'>
        <ToggleIcon />
      </a>
      <div className='header-wrap'>
        <button className='header__side' onClick={() => props.setIsCollapsed(!props.isCollapsed)}>
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
              style={{
                paddingLeft: '2rem'
              }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              type='search'
              placeholder={t('Search')}
            />
            <svg
              onClick={() => setSearch('')}
              width={24}
              height={25}
              viewBox='0 0 24 25'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8 8.5L16 16.5'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16 8.5L8 16.5'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          {
            <GetContainer
              url={search?.length > 3 ? 'dashboard/user/search' : ''}
              params={{
                search: search
              }}
            >
              {({ data }) => (
                <div
                  className='header-search__result'
                  style={{
                    display: data?.data ? 'block' : 'none',
                    zIndex: 99
                  }}
                >
                  <ul>
                    {data?.data?.articles?.map((article: any) => (
                      <li>
                        <Link to={'/article/' + article?.slug} onClick={() => setSearch('')}>
                          <div>{article?.name?.[i18n.language]}</div>
                        </Link>
                      </li>
                    ))}
                    {data?.data?.chapters?.map((chapter: any) =>
                      chapter?.article_ids?.map((article: any) => (
                        <li>
                          <Link
                            to={`/article/${article?.slug}?chapter_id=${chapter?.id}`}
                            onClick={() => setSearch('')}
                          >
                            <div>{article?.title?.[i18n.language]}</div>
                            <p dangerouslySetInnerHTML={{ __html: chapter?.title?.[i18n.language] }}></p>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </GetContainer>
          }
        </div>
      </div>
      <div className='header-wrap'>
        <div className='header-lang'>
          {langButtons?.find(el => el.value === i18n.language)?.button}
          {langButtons?.filter(el => el.value !== i18n.language)?.map(item => item.button)}
        </div>
        <GetContainer url='/dashboard/user/notification/feedback'>
          {({ data, isLoading }) => (
            <>
              <button className='header__nots btn' onClick={() => setNotsShow(!notsShow)}>
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

              <ul className={`header-nots ${notsShow ? 'show' : 'hide'}`}>
                {data?.data?.length > 0 ? (
                  data?.data?.map((item: any) => (
                    <li key={item?.id} onClick={() => mutate(item?.feedback_id?.id)}>
                      <button className='header-nots__btn'>
                        <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M12.0626 3.7709C13.2016 4.90993 13.2016 6.75666 12.0626 7.89569C10.9235 9.03473 9.0768 9.03473 7.93777 7.89569C6.79874 6.75666 6.79874 4.90993 7.93777 3.7709C9.0768 2.63187 10.9235 2.63187 12.0626 3.7709'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M3.3335 15.4166V16.2499C3.3335 16.7099 3.70683 17.0833 4.16683 17.0833H15.8335C16.2935 17.0833 16.6668 16.7099 16.6668 16.2499V15.4166C16.6668 12.8949 13.3735 11.2566 10.0002 11.2566C6.62683 11.2566 3.3335 12.8949 3.3335 15.4166Z'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div>
                          <p>{item?.author}</p>
                          <span>{item?.message}</span>
                        </div>
                      </button>
                    </li>
                  ))
                ) : (
                  <li>
                    <span>{t('There are no new notifications')}</span>
                  </li>
                )}
              </ul>
            </>
          )}
        </GetContainer>
        <button className='header__user' onClick={() => setVisibleMenu(!visibleMenu)}>
          <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M14.4749 4.52513C15.8417 5.89197 15.8417 8.10804 14.4749 9.47488C13.108 10.8417 10.892 10.8417 9.52513 9.47488C8.15829 8.10804 8.15829 5.89197 9.52513 4.52513C10.892 3.15829 13.108 3.15829 14.4749 4.52513'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M4 18.5001V19.5001C4 20.0521 4.448 20.5001 5 20.5001H19C19.552 20.5001 20 20.0521 20 19.5001V18.5001C20 15.4741 16.048 13.5081 12 13.5081C7.952 13.5081 4 15.4741 4 18.5001Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <ul
          className='header-user'
          style={{
            display: visibleMenu ? 'block' : 'none'
          }}
        >
          <li>
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem'
              }}
              onClick={() => {
                setVisibleMenu(false)
                navigate('/account?type=payments')
              }}
            >
              <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12.0626 3.7709C13.2016 4.90993 13.2016 6.75666 12.0626 7.89569C10.9235 9.03473 9.0768 9.03473 7.93777 7.89569C6.79874 6.75666 6.79874 4.90993 7.93777 3.7709C9.0768 2.63187 10.9235 2.63187 12.0626 3.7709'
                  stroke='#121B2D'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.3335 15.4166V16.2499C3.3335 16.7099 3.70683 17.0833 4.16683 17.0833H15.8335C16.2935 17.0833 16.6668 16.7099 16.6668 16.2499V15.4166C16.6668 12.8949 13.3735 11.2566 10.0002 11.2566C6.62683 11.2566 3.3335 12.8949 3.3335 15.4166Z'
                  stroke='#121B2D'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{t('Profile')}</span>
            </button>
          </li>
          <li>
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem'
              }}
              onClick={() => {
                setModalOpen(true)
                setVisibleMenu(false)
              }}
            >
              <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9.16667 16.16V6.25249C9.16667 5.67749 8.87083 5.14332 8.38333 4.83915L5.05 2.75582C3.94 2.06248 2.5 2.85998 2.5 4.16915V14.0758C2.5 14.6508 2.79583 15.185 3.28333 15.4892L6.61667 17.5725C7.72667 18.2667 9.16667 17.4683 9.16667 16.16Z'
                  stroke='#323232'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12.5 9.16667H17.5'
                  stroke='#323232'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M15.8335 10.8333L17.5002 9.16667L15.8335 7.5'
                  stroke='#323232'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M9.1665 15.8334H12.4998C13.4207 15.8334 14.1665 15.0875 14.1665 14.1667V13.3334'
                  stroke='#323232'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M14.1665 5V4.16667C14.1665 3.24583 13.4207 2.5 12.4998 2.5H4.1665'
                  stroke='#323232'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{t('Exit')}</span>
            </button>
          </li>
        </ul>

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
