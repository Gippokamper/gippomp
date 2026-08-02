import { MainLayout } from '../../layouts/main'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useMemo, useState } from 'react'
import GetContainer from '../../components/get-container'
import Folder from '../../img/icons/Folder'
import VideoCard from '../../components/vedio-card'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import VideoModal from '../../components/vedio-modal'
import Modal, { IModal } from '../../components/modal'
import lightIcon from '../../img/icons/cash.svg'
import darkIcon from '../../img/icons/cash-dark.svg'
import { AuthContext } from '../../providers/auth-provider'
import LockIcon from '../../img/icons/LockIcon'

export const Videos = () => {
  const { i18n, t } = useTranslation()
  const [url, setUrl] = useState('')
  const { userPermissions } = useContext(AuthContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const slugs = useMemo(() => {
    return pathname
      .split('/')
      ?.filter(path => !!path)
      ?.map(path => {
        if (path === 'videos') {
          return ''
        } else {
          return path
        }
      })
  }, [pathname])

  const to = (index: number, slug: string) => {
    if (index === slugs.length - 1) {
      return pathname + '/' + slug
    } else {
      let arr = [...slugs]

      arr.splice(index + 1, 1, slug)

      const arr2 = arr.filter((_, i) => i <= index + 1)
      const arr3 = arr2.filter(item => !!item)

      return arr3.reduce((accumulator, currentValue) => accumulator + '/' + currentValue, '/videos')
    }
  }

  const [modalOpen, setModalOpen] = useState(false)

  const modalProps: IModal = useMemo(() => {
    return {
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
    }
  }, [modalOpen, navigate])

  const clickArticle = (item: any) => {
    if (item.paid) {
      // .some() callback talab qiladi; ruxsatlar ro'yxatida 'videos' bor-yo'qligini tekshiramiz.
      if (!userPermissions?.includes('videos')) {
        setModalOpen(true)
      }
    } else {
      setUrl(item.link)
    }
    return
  }
  return (
    <MainLayout>
      <section className='library'>
        {slugs.map((slug, index) => (
          <GetContainer url={'dashboard/user/video_categories/' + slug}>
            {({ data, isLoading }) => (
              <>
                <h1 className='library__title section-title'>
                  {isLoading ? (
                    <Skeleton count={1} className='section-title' width={100} />
                  ) : slug ? (
                    data?.data?.name?.[i18n.language]
                  ) : (
                    t('Videos')
                  )}
                </h1>
                <ul className='library-list'>
                  {isLoading && <Skeleton count={1} width={130} height={25} />}
                  {slug ? (
                    <>
                      {data?.data?.child_category?.map((item: any) => (
                        <li key={item.id}>
                          <Link
                            to={to(index, item.slug)}
                            className={`library-item ${
                              slugs?.some((el, i) => el === item?.slug && i === index + 1) ? 'current' : ''
                            }`}
                          >
                            {/* current */}
                            <Folder />
                            <span>{item.name?.[i18n.language]}</span>
                          </Link>
                        </li>
                      ))}
                      {data?.data?.videos?.map((item: any) => (
                        <li>
                          <div onClick={() => clickArticle(item)} className='library-article'>
                            {/* current */}
                            {!item?.paid ? (
                              <VideoCard />
                            ) : userPermissions?.includes('videos') ? (
                              <VideoCard />
                            ) : (
                              <LockIcon />
                            )}
                            <span>{item.name?.[i18n.language]}</span>
                          </div>
                        </li>
                      ))}
                    </>
                  ) : (
                    data?.data?.map((item: any) => (
                      <li>
                        <Link
                          to={item.slug}
                          className={`library-item ${slugs?.some(el => el === item?.slug) ? 'current' : ''}`}
                        >
                          {/* current */}
                          <Folder />
                          <span>{item.name?.[i18n.language]}</span>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </>
            )}
          </GetContainer>
        ))}
      </section>
      <VideoModal close={() => setUrl('')} url={url} />
      <Modal {...modalProps} />
    </MainLayout>
  )
}
