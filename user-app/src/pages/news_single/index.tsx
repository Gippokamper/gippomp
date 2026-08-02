import { useNavigate, useParams } from 'react-router-dom'
import GetContainer from '../../components/get-container'
import { MainLayout } from '../../layouts/main'
import ClockIcon from '../../img/icons/ClockIcon'
import MarkIcon from '../../img/icons/MarkIcon'
import { MEDIA_URL } from '../../helpers/request'
import { useTranslation } from 'react-i18next'
import WithHtml from '../../components/with-html'
import { useMutation } from 'react-query'
import { SAVE_NEWS } from '../news'
import MarkSaved from '../../img/icons/MarkSaved'

export const NewsSingle = () => {
  const { i18n, t} = useTranslation()
  const navigate = useNavigate()
  const { news_id } = useParams()
  const { mutate } = useMutation(SAVE_NEWS)

  return (
    <MainLayout disablePadding>
      <GetContainer url={'/dashboard/user/news/' + news_id}>
        {({ data, refetch }) => (
          <section
            className='news'
            // style={{
            //   height: '100%',
            //   overflowY: 'scroll',
            //     paddingBottom:'6rem'
            // }}
          >
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
              <span>{t('News')}</span>
            </button>
            <h1 className='news__title section-title'>{data?.data?.title?.[i18n.language]}</h1>
            <div className='news-content'>
              <div className='news-single'>
                <div
                  className='news-item__bot'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'unset',
                    marginBottom: '1rem'
                  }}
                >
                  <div
                    className='news-item__date'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'unset'
                    }}
                  >
                    <ClockIcon />
                    <span>{data?.data?.date}</span>
                  </div>
                  <button
                    onClick={() =>
                      mutate(data?.data?.id, {
                        onSuccess: () => {
                          refetch()
                        }
                      })
                    }
                    className='news-item__mark'
                  >
                    {data?.data?.is_saved ? <MarkSaved /> : <MarkIcon />}
                  </button>
                </div>
                {/* <div className='news-single__desc'>
                  Qaysidur mavzuga nmadrulani topib shunaqa pod zagalovok yaratish kere chundilayu manimcha torimi
                </div> */}
                <div className='news-single__banner'>
                  <img
                    src={MEDIA_URL + data?.data?.photo}
                    alt='news'
                    style={{
                      width: '100%',
                      height: '20rem',
                      objectFit: 'cover'
                    }}
                  />
                  {/* <p>Photo by Nitru tsunanami “Tulki ovi”</p> */}
                </div>
                <div className='news-single__text'>{<WithHtml html={data?.data?.description?.[i18n.language]} />}</div>
              </div>
            </div>
          </section>
        )}
      </GetContainer>
    </MainLayout>
  )
}
