import React, { useContext, useMemo, useState } from 'react'
import { MainLayout } from '../../layouts/main'
import { useNavigate, useParams } from 'react-router-dom'
import GetContainer from '../../components/get-container'
import Article from '../../img/icons/Article'
import { useTranslation } from 'react-i18next'
import ArticleCard from '../../components/article-card'
import { AuthContext } from '../../providers/auth-provider'
import LockIcon from '../../img/icons/LockIcon'
import lightIcon from '../../img/icons/cash.svg'
import darkIcon from '../../img/icons/cash-dark.svg'
import Modal, { IModal } from '../../components/modal'

function StudyPlanSingle() {
  const { userPermissions } = useContext(AuthContext)
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const { studySlug, type } = useParams()
  const [modalOpen, setModalOpen] = useState(false)

  const modalProps: IModal = useMemo(() => {
    return {
      title: t('Make an additional payment'),
      description: t('Your previous payment is not enough to purchase the fare, so make an additional payment'),
      onAccept: () => {
        setModalOpen(false)
        navigate('/account?type=tariffs')
      },
      close: () => setModalOpen(false),
      acceptTitle: 'Sotib olish',
      lightIcon: lightIcon,
      darkIcon: darkIcon,
      isOpen: modalOpen
    }
  }, [modalOpen, navigate])

  const clickArticle = (item: any) => {
    if (!userPermissions?.some((e: string) => e === 'articles')) {
      setModalOpen(true)
    } else {
      !item?.solved
        ? navigate(`/detail/${type}/${studySlug}/${item?.id}`)
        : navigate(`/detail/${type}/${studySlug}/${item?.id}/stats`)
    }

    return
  }

  return (
    <MainLayout>
      <GetContainer url={`dashboard/user/${type === 'study' ? 'study_plan' : 'quizzes'}/${studySlug}`}>
        {({ data, refetch }) => (
          <section className='study'>
            <button onClick={() => navigate(-1)} className='section-back'>
              <svg width={16} height={17} viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12 1.5L5 8.5L12 15.5'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{t('Back')}</span>
            </button>
            <h1 className='study__title section-title'>{data?.data?.name?.[i18n.language]}</h1>
            {!!data?.data?.article_ids?.length && (
              <div className='study-themes'>
                <div className='study__name'>{t('Topics')}</div>
                <div className='study-themes__list'>
                  {data?.data?.article_ids?.map((article: any, i: number) => (
                    <ArticleCard article={article} key={article?.id + String(article?.is_read) + i} />
                  ))}
                </div>
              </div>
            )}
            {!!data?.data?.blocks?.length && (
              <div className='study-questions'>
                <div className='study__name'>{t('Questions')}</div>
                {data?.data?.blocks?.map((block: any) => (
                  <div className='study-questions__list'>
                    <div className='study-questions__item'>
                      <div className='study-questions__name'>{block?.name?.[i18n.language]}</div>
                      <div className='study-questions__wrap'>
                        <div className='study-item__info'>
                          <div className='study-item__ico'>
                            {/* current */}
                            {userPermissions?.some((e: string) => e === 'tests') ? <Article /> : <LockIcon />}
                          </div>
                          <div className='study-item__count'>
                            <div className='study-item__text'>
                              {block?.solved}/{block?.questions_count} {t('Questions')}
                            </div>
                            <div className='study-item__line'>
                              <span
                                style={{
                                  width: `${(block?.solved / block?.questions_count) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <button onClick={() => clickArticle(block)} className='study-questions__btn btn'>
                          {t('Start')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </GetContainer>
      <Modal {...modalProps} />
    </MainLayout>
  )
}

export default StudyPlanSingle
