import React from 'react'
import { RWebShare } from 'react-web-share'
import ShareIcon from '../../img/icons/ShareIcon'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../store'
import { setFontSize, toggleAddInfo, toggleShowMarker } from '../../store/slices/htmlSlice'
import { setTheme } from '../../store/siteSlice/siteSlice'

interface IProps {
  isVisible: boolean
  hide: () => void
}

function LibrarySetting(props: IProps) {
  const { t } = useTranslation()
  const { showMarker, showAddInfo, fontSize } = useSelector((state: RootState) => state.html)
  const { isDark } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  return (
    <div
      className='library-setting'
      style={{
        display: props.isVisible ? 'block' : 'none'
      }}
    >
      <div className='library-setting__content'>
        <div className='library-setting__title'>
          <span>{t('Theme settings')}</span>
          <button onClick={props.hide}>
            <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M3.33594 3.33203L16.6693 16.6654'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.6693 3.33203L3.33594 16.6654'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
        <div className='library-setting__wrap'>
          <div className='library-setting__button'>
            <RWebShare
              data={{
                text: t('Click on the link to read'),
                url: window.location.href,
                title: t('article')
              }}
              onClick={() => console.log('shared successfully!')}
            >
              <button
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <ShareIcon />
                <span>{t('Sharing')}</span>
              </button>
            </RWebShare>
          </div>
          {/* <label htmlFor='check1' className='library-setting__button'>
            <input type='checkbox' className='checkbox' id='check1' />
            <span>Bo’lishish</span>
          </label> */}
        </div>
        <div className='library-setting__more'>
          <div className='library-setting__name'>{t('Additional functions')}</div>
          <div className='library-setting__item'>
            <div className='library-setting__item-wrap'>
              <div className='library-setting__item-title'>{t('Additional information')}</div>
              <div className='library-setting__item-text'>{t('This function reveals additional information')}</div>
            </div>
            <input
              checked={showAddInfo}
              onClick={() => {
                if (showAddInfo && showMarker) {
                  dispatch(toggleAddInfo())
                  dispatch(toggleShowMarker())
                } else {
                  dispatch(toggleAddInfo())
                }
              }}
              type='checkbox'
              className='checkbox'
            />
          </div>
          <div className='library-setting__item'>
            <div className='library-setting__item-wrap'>
              <div className='library-setting__item-title'>{t('Marker')}</div>
              <div className='library-setting__item-text'>{t('This function displays the basic information')}</div>
            </div>
            <input
              checked={showMarker}
              onChange={e => dispatch(toggleShowMarker())}
              type='checkbox'
              className='checkbox'
            />
          </div>
          <div className='library-setting__item'>
            <div className='library-setting__item-wrap'>
              <div className='library-setting__item-title'>{t('Text size')}</div>
              <input
                type='range'
                min={10}
                max={30}
                value={fontSize}
                onChange={e => dispatch(setFontSize(Number(e.target.value)))}
                style={{
                  width: '100%'
                }}
              />
            </div>
          </div>
          <div className='side-mode'>
            <button className={`light ${isDark ? '' : 'current'}`} onClick={() => dispatch(setTheme(false))}>
              <svg width={18} height={18} viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9 13.6875V15.5625'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M9 2.4375V4.3125'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M5.68687 12.3164L4.35938 13.6439'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.64 4.35938L12.3125 5.68687'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M4.3125 9H2.4375'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M15.5625 9H13.6875'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M5.68687 5.68687L4.35938 4.35938'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.64 13.6439L12.3125 12.3164'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>Light</span>
            </button>
            <button className={`dark ${isDark ? 'current' : ''}`} onClick={() => dispatch(setTheme(true))}>
              <svg width={18} height={18} viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14.7766 11.25C12.9016 11.85 10.7266 11.475 9.22656 9.975C7.35156 8.1 7.20156 5.1 8.70156 3C5.62656 3.3 3.22656 5.85 3.22656 9C3.22656 12.3 5.92656 15 9.22656 15C11.7016 15 13.8766 13.425 14.7766 11.25V11.25Z'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{t('Dark')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibrarySetting
