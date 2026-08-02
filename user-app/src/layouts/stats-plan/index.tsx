import DOMPurify from 'dompurify'
import GetContainer from '../../components/get-container'
import StatsIcon from '../../img/icons/StatsIcon'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface IProps {
  sideCollapsed: boolean
}

export const StatsPlan = (props: IProps) => {
  const { i18n, t } = useTranslation()
  const { test_id, type, studySlug } = useParams()
  const navigate = useNavigate()
  return (
    <GetContainer url='/dashboard/user/user_test_attempt/'>
      {({ data }) => (
        <div
          className='side-plan'
          style={{
            display: props.sideCollapsed ? 'none' : 'block'
          }}
        >
          <div className='side-plan__title'>{t('Last sessions')}</div>
          <ul className='side-stat'>
            {data?.data?.map((item: any) => (
              <li
                className={`side-stat__item ${Number(test_id) === item?.block_id?.id ? 'current' : ''}`}
                onClick={() => navigate(`/detail/${type}/${studySlug}/${item.block_id.id}/stats`)}
              >
                <div
                  className='side-stat__name'
                  style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                >
                  <strong>{t('Study type:')}</strong>
                  <span
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.block_id?.name?.[i18n.language]) }}
                  ></span>
                </div>
                <div
                  className='side-stat__text'
                  style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.block_id?.name?.[i18n.language]) }}
                ></div>
                <div className='study-item__info'>
                  <div className='study-item__ico'>
                    <StatsIcon />
                  </div>
                  <div className='study-item__count'>
                    <div className='study-item__text'>
                      {item?.block_id?.solved}/{item?.question_count} {t('Questions')}
                    </div>
                    <div className='study-item__line'>
                      <span
                        style={{
                          width: `${(item?.block_id?.solved / item?.question_count) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GetContainer>
  )
}
