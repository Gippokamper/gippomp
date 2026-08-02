import React, { useMemo } from 'react'
import ArticleIcon from '../../img/icons/ArticleIcon'
import QuestionsIcon from '../../img/icons/QuestionsIcon'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface IProps {
  item: any
  isQuiz?: boolean
}

function StudyDetailCard(props: IProps) {
  const { i18n , t} = useTranslation()
  const readedArticles = useMemo(() => {
    return props?.item?.article_ids?.filter((item: any) => item.is_read)?.length
  }, [props.item])
  const solvedQuizes = useMemo(() => {
    return props?.item?.blocks?.reduce((acc: number, item: any) => acc + item.solved, 0)
  }, [props.item])
  const countQuizes = useMemo(() => {
    return props?.item?.blocks?.reduce((acc: number, item: any) => acc + item.questions_count, 0)
  }, [props.item])
  return (
    <Link to={`/detail/${props?.isQuiz ? 'quiz' : 'study'}/${props?.item?.slug}`} className='study-item'>
      <div className='study-item__head'>
        <b>{props?.item?.name?.[i18n?.language]}</b>
        <br />
        <br />
        {props?.item?.info?.[i18n?.language]}
      </div>
      <div className='study-item__wrap'>
        {!props?.isQuiz && (
          <div className='study-item__info'>
            <div className='study-item__ico'>
              <ArticleIcon />
            </div>
            <div className='study-item__count'>
              <div className='study-item__text'>
                {readedArticles}/{props?.item?.article_ids?.length} {t('Topics')}
              </div>
              <div className='study-item__line'>
                <span style={{ width: `${(readedArticles / props?.item?.article_ids?.length) * 100}%` }} />
              </div>
            </div>
          </div>
        )}
        <div className='study-item__info'>
          <div className='study-item__ico'>
            <QuestionsIcon />
          </div>
          <div className='study-item__count'>
            <div className='study-item__text'>
              {solvedQuizes}/{countQuizes} {t('Questions')}
            </div>
            <div className='study-item__line'>
              <span style={{ width: `${(solvedQuizes / countQuizes) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StudyDetailCard
