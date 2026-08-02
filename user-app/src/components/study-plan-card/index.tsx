import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface IProps {
  item: any
  to: (slug: string) => string
  isQuiz?: boolean
}

function StudyPlanCard(props: IProps) {
  const { i18n } = useTranslation()
  return (
    <Link
      to={
        props?.item?.with_content
          ? props.isQuiz
            ? `/quiz-detail/${props?.item?.slug}`
            : `/detail/${props?.item?.slug}`
          : props.to(props?.item?.slug)
      }
      className='study-list__item'
    >
      <div className='study-list__name'>{props.item?.name?.[i18n.language]}</div>
      <div className='study-list__type'>{props?.item?.info?.[i18n.language]}</div>
    </Link>
  )
}

export default StudyPlanCard
