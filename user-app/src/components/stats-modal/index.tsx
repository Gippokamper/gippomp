import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
interface IProps {
  isVisible: boolean
  hide: () => void
  stats: any
}

function StatsModal(props: IProps) {
  const { i18n , t } = useTranslation()
  const navigate = useNavigate()
  const { type, studySlug } = useParams()
  const [selections, setSelections] = useState({
    right_answer: false,
    wrong_answer: false,
    help_answer: false,
    no_answer: false
  })
  const count = useMemo(() => {
    const keys = Object.keys(selections)
    //@ts-ignore
    const sum = keys?.reduce((sum, key) => (!!selections[key] ? sum + props.stats[key] : sum + 0), 0)
    return sum
  }, [selections, props.stats])
  const getValue = (key: string) => {
    if (key === 'right_answer') {
      return 1
    } else if (key === 'wrong_answer') {
      return 0
    } else if (key === 'help_answer') {
      return -1
    } else if (key === 'no_answer') {
      return 2
    }
  }
  const goToQuiz = () => {
    const keys = Object.keys(selections)
    //@ts-ignore
    const search = keys?.reduce((string, key) => (!!selections[key] ? { ...string, [key]: getValue(key) } : string), {})
    console.log(search, 'search')
    navigate(
      {
        pathname: `/detail/${type}/${studySlug}/${props?.stats?.block_id?.id}`,
        search: createSearchParams(search).toString()
      },
      { replace: true }
    )
  }

  console.log(selections, 'selections')
  return (
    <div className='stats-popup' style={{ display: props.isVisible ? 'block' : 'none' }}>
      <div className='stats-popup__content'>
        <div className='stats-popup__close' onClick={props.hide}>
          <svg width={22} height={22} viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M3.625 18.1289L18.1287 3.6252'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M3.625 3.6252L18.1287 18.1289'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <div className='stats-popup__title'>{props?.stats?.block_id?.name?.[i18n.language]}</div>
        <div className='stats-popup__item'>
          <div className='stats-popup__subtitle'>{t('The purpose of the search')}</div>
          <div className='stats-popup__course'>{props?.stats?.block_id?.name?.[i18n.language]}</div>
        </div>
        <div className='stats-popup__item'>
          <div className='stats-popup__subtitle'>{t('The purpose of the search')}</div>
          <div className='stats-popup__choose'>
            <label htmlFor='list1'>
              <input
                type='checkbox'
                checked={selections.no_answer}
                onChange={e =>
                  setSelections(prev => {
                    return {
                      ...prev,
                      no_answer: e.target.checked
                    }
                  })
                }
                className='checkbox'
                id='list1'
              />
              <span>{t("The ones I didn't answer")}</span>
            </label>
            <label htmlFor='list2' className='yellow'>
              <input
                type='checkbox'
                className='checkbox'
                id='list2'
                checked={selections.help_answer}
                onChange={e =>
                  setSelections(prev => {
                    return {
                      ...prev,
                      help_answer: e.target.checked
                    }
                  })
                }
              />
              <span>{t('The ones I answered with help')}</span>
            </label>
            <label htmlFor='list3' className='red'>
              <input
                type='checkbox'
                className='checkbox'
                id='list3'
                checked={selections.wrong_answer}
                onChange={e =>
                  setSelections(prev => {
                    return {
                      ...prev,
                      wrong_answer: e.target.checked
                    }
                  })
                }
              />
              <span>{t('Xato javob berganlarim')}</span>
            </label>
            <label htmlFor='list4' className='green'>
              <input
                type='checkbox'
                className='checkbox'
                id='list4'
                checked={selections.right_answer}
                onChange={e =>
                  setSelections(prev => {
                    return {
                      ...prev,
                      right_answer: e.target.checked
                    }
                  })
                }
              />
              <span>{t('I answered correctly')}</span>
            </label>
          </div>
        </div>
        <div className='stats-popup__item'>
          <div className='stats-popup__subtitle'>{t('Number of questions')}</div>
          <div className='stats-popup__range'>
            <div className='stats-popup__range-input'>
              <input
                type='range'
                min={0}
                max={props?.stats?.question_count}
                onChange={() => {}}
                value={count}
                style={{
                  width: '100%'
                }}
              />
            </div>
            <div className='stats-popup__range-value'>
              <span>{count}</span>
              <p>/ {props.stats.question_count}</p>
            </div>
          </div>
        </div>
        <div className='stats-info__btns'>
          {/* <button className='btn-white'>Yaqinroq bilish</button> */}
          <button
            className={`btn ${!count ? 'disable-test-stats' : ''}`}
            style={{ width: '100%' }}
            disabled={!count}
            onClick={goToQuiz}
          >
            {t('Start')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatsModal
