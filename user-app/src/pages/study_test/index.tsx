import React, { useEffect, useMemo, useState } from 'react'
import StudyTestLayout from '../../layouts/study_test'
import advice from '../../img/icons/advice.svg'
import GetContainer from '../../components/get-container'
import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  quizState,
  selectAnswer,
  setBlockId,
  setData,
  setOpenAnswers,
  setOpenInfo,
  setOpenLab,
  setOpenMarker,
  setResetBlockId,
  setRestartQuiz
} from '../../store/quizSlice/quizSlice'
import { request } from '../../helpers/request'
import KeyIcon from '../../img/icons/KeyIcon'
import InfoIcon2 from '../../img/icons/InfoIcon2'
import LabIcon from '../../img/icons/LabIcon'
import ShareIcon from '../../img/icons/ShareIcon'
import FedBackIcon from '../../img/icons/FidbackIcon'
import { RWebShare } from 'react-web-share'
import { useMutation } from 'react-query'
import FeedbackModal from '../../components/feedback-modal'
import { setPhoto } from '../../store/slices/htmlSlice'
import LabsTable from '../../components/labs-table'
import { useTranslation } from 'react-i18next'
import WithTooltip from '../../components/with-html/WithTooltip'

const VARIANTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

function StudyTest() {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const { test_id, type, studySlug } = useParams()
  const dispatch = useDispatch()
  const { blockId, data } = useSelector((state: RootState) => state.quiz)
  const [searchParams, setSearchParams] = useSearchParams({})
  const navigate = useNavigate()
  const [openFeedback, setOpenFeedback] = useState(false)
  const href = window.location.href

  const quiz = useMemo(() => {
    const quiz_id = searchParams.has('quiz_id') ? Number(searchParams.get('quiz_id')) : data?.[0]?.question?.id
    return data?.find((x: any) => x?.question?.id === quiz_id)
  }, [data, searchParams])

  const params = useMemo(() => {
    //@ts-ignore
    const searchAsObject = Object.fromEntries(new URLSearchParams(searchParams))
    return searchAsObject
  }, [searchParams])

  useEffect(() => {
    return () => {
      dispatch(setData(null))
      dispatch(setResetBlockId())
    }
  }, [dispatch])

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
        navigate(`/detail/${type}/${studySlug}/${test_id}/stats`, { replace: true })
      }
    }
  )

  const isLastQuiz = useMemo(() => {
    const quiz_id = searchParams.has('quiz_id') ? Number(searchParams.get('quiz_id')) : data?.[0]?.question?.id
    const quizIndex = data?.findIndex(x => x?.question?.id === quiz_id)
    const isLastQuiz = Number(data?.length) - 1 === quizIndex
    return isLastQuiz
  }, [searchParams, data])

  const isFirstQuiz = useMemo(() => {
    const quiz_id = searchParams.has('quiz_id') ? Number(searchParams.get('quiz_id')) : data?.[0]?.question?.id
    const quizIndex = data?.findIndex(x => x?.question?.id === quiz_id)
    const isFirst = quizIndex === 0
    return isFirst
  }, [searchParams, data])

  const onNext = (stopWatch: any) => {
    const quiz_id = searchParams.has('quiz_id') ? Number(searchParams.get('quiz_id')) : data?.[0]?.question?.id
    const quizIndex = data?.findIndex(x => x?.question?.id === quiz_id)
    if (data?.length) {
      if (isLastQuiz) {
        mutate({
          time: stopWatch.totalSeconds,
          attempt_questions: data?.map(x => {
            return {
              question_id: x.id,
              status: x.status
            }
          })
        })
        stopWatch.reset()
      } else {
        //@ts-ignore
        navigate(
          {
            pathname: location.pathname,
            search: createSearchParams({ quiz_id: String(data[Number(quizIndex) + 1].question?.id) }).toString()
          },
          { replace: true }
        )
        stopWatch.start()
      }
    }
  }
  const onPrev = () => {
    const quiz_id = searchParams.has('quiz_id') ? Number(searchParams.get('quiz_id')) : data?.[0]?.question?.id
    const quizIndex = data?.findIndex(x => x?.question?.id === quiz_id)
    // Birinchi savolda (quizIndex 0) "orqaga" bosilsa data[-1] qulardi — chegarani tekshiramiz.
    if (data?.length && typeof quizIndex === 'number' && quizIndex > 0) {
      //@ts-ignore
      setSearchParams({ quiz_id: data[quizIndex - 1].question?.id })
    }
  }

  const ShareButton = useMemo(() => {
    return (
      <RWebShare
        data={{
          text: t('Click on the link to read'),
          url: href,
          title: t('Test')
        }}
        onClick={() => console.log('shared successfully!')}
      >
        <button>
          <ShareIcon />
          <span>{t('Sharing')}</span>
        </button>
      </RWebShare>
    )
  }, [href, t])

  return (
    <GetContainer
      url={'/dashboard/user/user_test_attempt/' + test_id + '/start'}
      params={params}
      onSuccess={data => {
        if (blockId !== Number(test_id) && data?.data) {
          dispatch(setBlockId(Number(test_id)))
          dispatch(
            setData(
              data?.data?.attempt_question?.map((el: quizState) => {
                return {
                  ...el,
                  status: 2,
                  openMarker: false,
                  openLab: false,
                  openInfo: false,
                  openImage: false,
                  helpType: []
                }
              })
            )
          )
        }
      }}
    >
      {() => (
        <StudyTestLayout>
          {({ stopWatch }: any) => (
            <section
              className={`study study-test__edited`} //
            >
              {quiz && (
                <div className={`study-test__container ${quiz.openLab ? 'sliced' : ''}`}>
                  <div className={`study-test `}>
                    <div className='study-test__main' style={{}}>
                      <div className='study-test__card'>
                        <div className='study-test__text'>
                          {quiz.helpType?.some(e => e === 'marker') && quiz.status === -1 && (
                            <div className='study-advice'>
                              <img src={advice} alt='ico' />
                              <span>{t('Help used')}</span>
                            </div>
                          )}
                          <div className='study-test__flex'>
                            {/* @ts-ignore */}
                            <WithTooltip key={'name'} html={quiz.question?.name?.[i18n.language]} isQuiz={true} />
                            {quiz.question?.photo?.info && quiz.question?.photo?.photo && (
                              <button
                                style={{
                                  position: 'relative'
                                }}
                                onClick={() => {
                                  dispatch(
                                    setPhoto({
                                      type: 'quiz',
                                      url: quiz?.question?.photo?.info
                                    })
                                  )
                                }}
                              >
                                {quiz.helpType?.some(e => e === 'img') && quiz.status === -1 && (
                                  <div
                                    className='study-advice'
                                    style={{
                                      position: 'absolute',
                                      top: '1rem',
                                      left: '1rem',
                                      width: '9rem',
                                      height: '2rem'
                                    }}
                                  >
                                    <img
                                      width={30}
                                      height={30}
                                      style={{
                                        width: '1.3rem',
                                        height: '1.3rem'
                                      }}
                                      src={advice}
                                      alt='ico'
                                    />
                                    <span>{t('Help used')}</span>
                                  </div>
                                )}
                                <img width={'100%'} height={'100%'} src={quiz.question?.photo?.photo} alt='test' />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className='study-test__buttons'>
                          <div className='study-test__wrap'>
                            <button
                              className={quiz.openMarker ? 'active' : ''}
                              onClick={() => {
                                dispatch(setOpenMarker({ id: quiz.id }))
                              }}
                            >
                              <KeyIcon />
                              <span>{t('Key words')}</span>
                            </button>
                            <button
                              className={quiz.openInfo ? 'active' : ''}
                              onClick={() => dispatch(setOpenInfo({ id: quiz.id }))}
                            >
                              <InfoIcon2 />
                              <span>{t('Advice')}</span>
                            </button>
                            <button
                              className={quiz.openLab ? 'active' : ''}
                              onClick={() => dispatch(setOpenLab({ id: quiz.id }))}
                            >
                              <LabIcon />
                              <span>{t('Laboratory')}</span>
                            </button>
                          </div>
                          <div className='study-test__wrap'>
                            {ShareButton}

                            <button onClick={() => setOpenFeedback(true)}>
                              <FedBackIcon />
                              <span>{t('Feedback')}</span>
                            </button>
                          </div>
                        </div>
                        <div className='study-test__advice'>
                          {quiz.helpType?.some(e => e === 'info') && quiz.status === -1 && (
                            <div
                              className='study-advice'
                              style={{
                                marginBottom: 0
                              }}
                            >
                              <img src={advice} alt='ico' />
                              <span>{t('Help used')}</span>
                            </div>
                          )}
                          {quiz.openInfo && (
                            <WithTooltip
                              key={'info'}
                              //@ts-ignore
                              html={quiz?.question?.additional_info?.[i18n.language]}
                              isQuiz={true}
                              openMarker={quiz.openMarker}
                            />
                          )}
                        </div>
                        <div className='study-quest'>
                          {quiz?.question?.answers?.map((ans, i) => (
                            <div
                              key={i + String(ans.isOpened)}
                              className={`study-quest__item ${
                                ans.isOpened ? (Number(ans.status) === 1 ? 'true' : 'false') : 'choosen'
                              }`}
                              onClick={() => dispatch(selectAnswer({ id: quiz.id, answerId: ans.id }))}
                            >
                              <label htmlFor='quest1' className='study-quest__head'>
                                <input type='radio' name='quest' id='quest1' />
                                <span>{VARIANTS[i]}</span>
                                {/* @ts-ignore */}
                                <p>{ans.name?.[i18n.language]}</p>
                              </label>
                              <div className='study-quest__answer'>
                                <WithTooltip
                                  //@ts-ignore
                                  html={ans.description?.[i18n.language] || ''}
                                  isQuiz={true}
                                  openMarker={quiz.openMarker}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='study-test__more'>
                        <button
                          onClick={() =>
                            dispatch(
                              setOpenAnswers({
                                id: Number(quiz.id),
                                isOpen: quiz?.question?.answers?.some(el => !el.isOpened)
                              })
                            )
                          }
                        >
                          <span>
                            {' '}
                            {quiz?.question?.answers?.some(el => !el.isOpened) ? t('Open text') : t('Close text')}
                          </span>
                          {quiz?.question?.answers?.some(el => !el.isOpened) ? (
                            <svg
                              width={24}
                              height={24}
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M12 4V20'
                                stroke='currentColor'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M8 8L12.001 4L16.002 8'
                                stroke='currentColor'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M16.002 16L12.001 20.001L8 16'
                                stroke='currentColor'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='16'
                              height='18'
                              viewBox='0 0 16 18'
                              fill='none'
                            >
                              <path
                                d='M1.33333 8.16663C1.11232 8.16663 0.900358 8.25442 0.744078 8.4107C0.587797 8.56698 0.5 8.77894 0.5 8.99996C0.5 9.22097 0.587797 9.43293 0.744078 9.58921C0.900358 9.74549 1.11232 9.83329 1.33333 9.83329H2.16667C2.38768 9.83329 2.59964 9.74549 2.75592 9.58921C2.9122 9.43293 3 9.22097 3 8.99996C3 8.77894 2.9122 8.56698 2.75592 8.4107C2.59964 8.25442 2.38768 8.16663 2.16667 8.16663H1.33333ZM5.5 8.16663C5.27899 8.16663 5.06702 8.25442 4.91074 8.4107C4.75446 8.56698 4.66667 8.77894 4.66667 8.99996C4.66667 9.22097 4.75446 9.43293 4.91074 9.58921C5.06702 9.74549 5.27899 9.83329 5.5 9.83329H6.33333C6.55435 9.83329 6.76631 9.74549 6.92259 9.58921C7.07887 9.43293 7.16667 9.22097 7.16667 8.99996C7.16667 8.77894 7.07887 8.56698 6.92259 8.4107C6.76631 8.25442 6.55435 8.16663 6.33333 8.16663H5.5ZM8.83333 8.99996C8.83333 8.77894 8.92113 8.56698 9.07741 8.4107C9.23369 8.25442 9.44565 8.16663 9.66667 8.16663H10.5C10.721 8.16663 10.933 8.25442 11.0893 8.4107C11.2455 8.56698 11.3333 8.77894 11.3333 8.99996C11.3333 9.22097 11.2455 9.43293 11.0893 9.58921C10.933 9.74549 10.721 9.83329 10.5 9.83329H9.66667C9.44565 9.83329 9.23369 9.74549 9.07741 9.58921C8.92113 9.43293 8.83333 9.22097 8.83333 8.99996ZM13.8333 8.16663C13.6123 8.16663 13.4004 8.25442 13.2441 8.4107C13.0878 8.56698 13 8.77894 13 8.99996C13 9.22097 13.0878 9.43293 13.2441 9.58921C13.4004 9.74549 13.6123 9.83329 13.8333 9.83329H14.6667C14.8877 9.83329 15.0996 9.74549 15.2559 9.58921C15.4122 9.43293 15.5 9.22097 15.5 8.99996C15.5 8.77894 15.4122 8.56698 15.2559 8.4107C15.0996 8.25442 14.8877 8.16663 14.6667 8.16663H13.8333ZM7.16667 4.34496L6.2325 3.41079C6.07533 3.25899 5.86483 3.175 5.64633 3.1769C5.42783 3.1788 5.21882 3.26644 5.06432 3.42094C4.90981 3.57545 4.82217 3.78446 4.82027 4.00296C4.81837 4.22146 4.90237 4.43196 5.05417 4.58913L7.41083 6.94663C7.56711 7.10285 7.77903 7.19061 8 7.19061C8.22097 7.19061 8.43289 7.10285 8.58917 6.94663L10.9467 4.58913C11.1029 4.43276 11.1907 4.22072 11.1906 3.99966C11.1905 3.77861 11.1026 3.56663 10.9462 3.41038C10.7899 3.25412 10.5778 3.16638 10.3568 3.16646C10.1357 3.16654 9.92376 3.25443 9.7675 3.41079L8.83333 4.34496V1.49996C8.83333 1.27895 8.74554 1.06698 8.58926 0.910704C8.43297 0.754423 8.22101 0.666626 8 0.666626C7.77899 0.666626 7.56702 0.754423 7.41074 0.910704C7.25446 1.06698 7.16667 1.27895 7.16667 1.49996V4.34496ZM8 17.3333C7.77899 17.3333 7.56702 17.2455 7.41074 17.0892C7.25446 16.9329 7.16667 16.721 7.16667 16.5V13.655L6.2325 14.5891C6.07533 14.7409 5.86483 14.8249 5.64633 14.823C5.42783 14.8211 5.21882 14.7335 5.06432 14.579C4.90981 14.4245 4.82217 14.2155 4.82027 13.997C4.81837 13.7785 4.90237 13.568 5.05417 13.4108L7.41083 11.0533C7.56711 10.8971 7.77903 10.8093 8 10.8093C8.22097 10.8093 8.43289 10.8971 8.58917 11.0533L10.9467 13.4108C11.1029 13.5672 11.1907 13.7792 11.1906 14.0003C11.1905 14.2213 11.1026 14.4333 10.9462 14.5895C10.7899 14.7458 10.5778 14.8335 10.3568 14.8335C10.1357 14.8334 9.92376 14.7455 9.7675 14.5891L8.83333 13.655V16.5C8.83333 16.721 8.74554 16.9329 8.58926 17.0892C8.43297 17.2455 8.22101 17.3333 8 17.3333Z'
                                fill='currentColor'
                              />
                            </svg>
                          )}
                        </button>
                        <button onClick={() => dispatch(setRestartQuiz(Number(quiz.id)))}>
                          <svg
                            width={24}
                            height={24}
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M2.99219 9.99469L6.84679 6.14008C8.22221 4.76461 10.0878 3.99197 12.033 3.99219V3.99219C15.0316 3.9924 17.728 5.81803 18.8418 8.60211L18.9989 8.99427'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M6.99385 9.99385H2.99219V5.99219'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M20.9989 14L17.1442 17.8546C15.7688 19.2301 13.9033 20.0027 11.9581 20.0025V20.0025C8.95948 20.0023 6.26304 18.1767 5.14925 15.3926L4.99219 15.0004'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M17 14H21.0017V18.0017'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <span>{t('Discuss the question')}</span>
                        </button>
                      </div>
                    </div>

                    <FeedbackModal
                      type='question'
                      block_id={Number(test_id)}
                      question_id={quiz?.question?.id}
                      isVisible={openFeedback}
                      hide={() => {
                        setOpenFeedback(false)
                      }}
                    />
                  </div>
                  <div className={`study-test__nav ${quiz?.openLab ? 'sliced' : ''}`}>
                    <button
                      style={{
                        maxWidth: '50%'
                      }}
                      className={`left ${isFirstQuiz ? 'disabled' : ''}`}
                      onClick={() => onPrev()}
                    >
                      <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M16 5L9 12L16 19'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <span>{t('Planting')}</span>
                    </button>
                    <button
                      style={{
                        maxWidth: '50%'
                      }}
                      className='right'
                      onClick={() => onNext(stopWatch)}
                    >
                      <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M8 19L15 12L8 5'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <span>{t('The next one')}</span>
                    </button>
                  </div>
                </div>
              )}
              {/* <StudyTestSide /> */}
              {quiz && <LabsTable isOpen={quiz?.openLab} close={() => dispatch(setOpenLab({ id: quiz.id }))} />}
            </section>
          )}
        </StudyTestLayout>
      )}
    </GetContainer>
  )
}

export default StudyTest
