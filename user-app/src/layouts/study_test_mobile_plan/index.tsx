import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { request } from '../../helpers/request'
import { setResetBlockId } from '../../store/quizSlice/quizSlice'
import Play from '../../img/icons/Play'
import pause from '../../img/icons/pause.svg'
import { useTranslation } from 'react-i18next'
import { removeTags } from '../../helpers/formatter'

interface IProps {
  stopWatch: any
  close: () => void
  open: boolean
}

function StudyTestMobilePlan(props: IProps) {
  const { i18n, t } = useTranslation()
  const { data } = useSelector((state: RootState) => state.quiz)
  const { test_id, type, studySlug } = useParams()
  const [searchParams] = useSearchParams({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { mutate } = useMutation(
    async (data: any) => {
      await request({
        url: `/dashboard/user/user_test_attempt/${test_id}/finish`,
        method: 'POST',
        data: data
      })
    },
    {
      onSuccess: data => {
        dispatch(setResetBlockId())
        navigate(`/detail/${type}/${studySlug}/${test_id}/stats`)
      }
    }
  )

  const exitSeans = () => {
    mutate({
      time: props.stopWatch.totalSeconds,
      attempt_questions: data?.map(x => {
        return {
          question_id: x?.id,
          status: x?.status
        }
      })
    })
    props.stopWatch.reset()
  }
  return (
    <div
      className='library-mobile__plan'
      style={{
        display: props.open ? 'block' : 'none'
      }}
      onClick={props.close}
    >
      <div className='side-plan' onClick={e => e.stopPropagation()}>
        <div className='side-plan__title'>
          {Number(data?.findIndex(el => el?.question?.id === Number(searchParams.get('quiz_id')))) + 1 || 1}/
          {data?.length}
        </div>
        <ul className='side-plan__test'>
          {data?.map((item, i) => (
            <li
              className={
                item?.status === 1 ? 'true' : item?.status === 0 ? 'false' : item?.status === -1 ? 'advice' : ''
              }
              onClick={() => {
                navigate(
                  {
                    pathname: location.pathname,
                    search: createSearchParams({ quiz_id: String(item?.question?.id) }).toString()
                  },
                  {
                    replace: true
                  }
                )
              }}
            >
              <div className='side-plan__check'></div>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <strong style={{ marginRight: '0.5rem' }}>{i + 1}</strong>
                <span style={{ display: 'inline-block', minWidth: '10rem' }}>
                  {/* @ts-ignore */}
                  {removeTags(item?.question?.name?.[i18n.language])}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className='side-time'>
          <div className='side-time__wrap'>
            <div className='side-time__left'>
              <button className='side-time__close' onClick={() => props.stopWatch?.reset()}>
                <svg width={24} height={25} viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
              </button>
              <div className='side-time__time'>
                <div>
                  {props.stopWatch?.hours} {t('s')} {props.stopWatch?.minutes} {t('min')} {props.stopWatch?.seconds}
                </div>
                <div>t('Session Question')</div>
              </div>
            </div>
            <div className='side-time__pause'>
              <button
                onClick={() => (props.stopWatch?.isRunning ? props.stopWatch?.pause() : props?.stopWatch?.start())}
              >
                {props.stopWatch?.isRunning ? <img src={pause} alt='ico' /> : <Play />}
              </button>
            </div>
          </div>
          <button onClick={exitSeans} className='side-time__end'>
            {t('Exist session')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyTestMobilePlan
