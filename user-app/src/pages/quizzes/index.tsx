import React, { useMemo } from 'react'
import { MainLayout } from '../../layouts/main'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import GetContainer from '../../components/get-container'
import GoBackIcon from '../../img/icons/GoBackIcon'
import StudyPlanCard from '../../components/study-plan-card'
import StudyDetailCard from '../../components/study-detail-card'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import MinusIcon from '../../img/icons/MinusIcon'
import PlusIcon from '../../img/icons/PlusIcon'
import { useDispatch } from 'react-redux'
import { decrement, increment } from '../../store/slices/htmlSlice'

function Quizzes() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const lastSlug = useMemo(() => {
    const items = pathname.split('/')
    return items[items.length - 1] === 'quizzes' ? '' : items[items.length - 1]
  }, [pathname])

  const to = (slug: string) => {
    return pathname + '/' + slug
  }
  return (
    <MainLayout>
      <GetContainer url={'dashboard/user/quizzes/' + lastSlug}>
        {({ data, isLoading }) => (
          <section className='study'>
            {!!lastSlug && (
              <button className='section-back' onClick={() => navigate(-1)}>
                <GoBackIcon />
                <span>{t('Back')}</span>
              </button>
            )}
            <h1 className='study__title section-title'>
              {isLoading ? (
                <Skeleton count={1} width={100} />
              ) : lastSlug ? (
                data?.data?.name?.[i18n.language]
              ) : (
                t('Test your knowledge')
              )}
            </h1>
            <div className='study__text'>
              {isLoading ? (
                <Skeleton count={5} width={'100%'} />
              ) : lastSlug ? (
                data?.data?.info?.[i18n.language]
              ) : (
                t('Quiz description')
              )}
            </div>
            <div className='study-list'>
              {isLoading ? (
                <Skeleton count={1} width={120} height={40} />
              ) : !lastSlug ? (
                data?.data?.map((item: any) =>
                  item?.with_content ? <StudyDetailCard isQuiz item={item} /> : <StudyPlanCard item={item} to={to} />
                )
              ) : (
                data?.data?.child_quiz?.map((item: any) =>
                  item?.with_content ? <StudyDetailCard isQuiz item={item} /> : <StudyPlanCard item={item} to={to} />
                )
              )}
            </div>
          </section>
        )}
      </GetContainer>
    </MainLayout>
  )
}

export default Quizzes
