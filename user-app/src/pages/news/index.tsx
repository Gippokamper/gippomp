import { MainLayout } from '../../layouts/main'
import background from '../../img/news-slider.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import NewsSliderItem from '../../components/news-slider-item'
import MarkerIcon from '../../img/icons/MarkerIcon'
import MarkIcon from '../../img/icons/MarkIcon'
import GetContainer from '../../components/get-container'
import { MEDIA_URL, request } from '../../helpers/request'
import ClockIcon from '../../img/icons/ClockIcon'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import MarkSaved from '../../img/icons/MarkSaved'
import { useState } from 'react'
import PaginatedItems from '../../components/pagination'

export const SAVE_NEWS = async (id: number | string) => {
  const response = await request({
    url: 'dashboard/user/news/' + id + '/save',
    method: 'POST'
  })

  return response.data
}

export const News = () => {
  const { i18n, t } = useTranslation()
  const { mutate } = useMutation(SAVE_NEWS)
  const [save, setSave] = useState(false)
  const navigate = useNavigate()
  const [pageNumber, setPageNumber] = useState(1)
  return (
    <MainLayout >
      <section className='news'>
        <div className='news-head'>
          <h1 className={`news__title section-title`}>{t('News')}</h1>
          <button onClick={() => setSave(!save)} className={`news-head__btn btn ${save ? 'active' : ''}`}>
            <MarkIcon />
          </button>
        </div>
        <div className='news-content'>
          <GetContainer url='/dashboard/user/news?actual=true'>
            {({ data, isLoading }) => (
              <>
                {isLoading && <Skeleton count={1} height={100} width={'100%'} className='news-slider' />}
                <Carousel className='news-slider' axis='horizontal'>
                  {data?.data?.map((item: any) => (
                    <NewsSliderItem item={item} />
                  ))}
                </Carousel>
              </>
            )}
          </GetContainer>

          <div className='news-list'>
            <GetContainer
              url='/dashboard/user/news'
              params={
                save
                  ? {
                      saved: save,
                      perPage: 10,
                      page: pageNumber
                    }
                  : {
                      perPage: 10,
                      page: pageNumber
                    }
              }
            >
              {({ data, refetch, isLoading }) => (
                <>
                  {isLoading && (
                    <div className='news-item'>
                      <div className='news-item__img'>
                        <Skeleton count={1} width={'100%'} height={'100%'} />
                      </div>
                      <div className='news-item__wrap'>
                        <div className='news-item__title'>
                          <Skeleton count={1} width={'100%'} />
                        </div>
                        <div className='news-item__desc'>
                          <Skeleton count={1} width={'100%'} />
                        </div>
                        <div className='news-item__bot'>
                          <div className='news-item__date'>
                            <Skeleton count={1} width={'100%'} />
                            <span>
                              <Skeleton count={1} width={'100%'} />
                            </span>
                          </div>
                          <button className='news-item__mark'>
                            <Skeleton count={1} width={'100%'} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {data?.data?.map((item: any) => (
                    <>
                      <div className='news-item' onClick={() => navigate('/news/' + item?.slug)}>
                        <div className='news-item__img'>
                          <Link to={'/news/' + item?.slug}>
                            <img src={MEDIA_URL + item?.photo} alt='news' />
                          </Link>
                        </div>
                        <div className='news-item__wrap'>
                          <div className='news-item__title'>{item.title?.[i18n.language]}</div>
                          <div className='news-item__desc'>{item.title?.[i18n.language]}</div>
                          <div className='news-item__bot'>
                            <div className='news-item__date'>
                              <ClockIcon />
                              <span>{item?.date}</span>
                            </div>
                            <button
                              className='news-item__mark'
                              onClick={e => {
                                e.stopPropagation()
                                mutate(item?.id, {
                                  onSuccess: () => refetch()
                                })
                              }}
                            >
                              {item?.is_saved ? <MarkSaved /> : <MarkIcon />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                  {data && <PaginatedItems total={data?.meta?.total} itemsPerPage={10} setPageNumber={setPageNumber} />}
                </>
              )}
            </GetContainer>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
