import React from 'react'
import { Link } from 'react-router-dom'
import WithHtml from '../with-html'
import { MEDIA_URL } from '../../helpers/request'
import { useTranslation } from 'react-i18next'

interface IProps {
  item: any
}

function NewsSliderItem(props: IProps) {
  const { i18n , t } = useTranslation()
  return (
    <div
      className='news-slider__item'
      //   style={{
      //     backgroundImage: 'url(' + MEDIA_URL + props.item?.photo + ')',
      //     backgroundPosition: 'center',
      //     backgroundRepeat: 'no-repeat'
      //   }}
    >
      <div className='news-slider__wrap'>
        <div className='news-slider__category'>{props?.item?.actual ? t('Actual') : ''}</div>
        <div className='news-slider__title'>{props.item?.title?.[i18n.language]}</div>
        {/* <div className='news-slider__desc' >
          <WithHtml html={props.item?.description?.[i18n.language]} />
        </div> */}
        <Link to={props?.item?.slug} className='news-slider__btn'>
          {t('More')}
        </Link>
      </div>
      <div className='news-slider__img'>
        <img src={MEDIA_URL + props?.item?.photo} alt='news' />
      </div>
    </div>
  )
}

export default NewsSliderItem
