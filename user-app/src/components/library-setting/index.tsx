import React from 'react'
import { RWebShare } from 'react-web-share'
import ShareIcon from '../../img/icons/ShareIcon'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../store'
import { setFontSize, toggleAddInfo, toggleShowMarker } from '../../store/slices/htmlSlice'
import { setTheme } from '../../store/siteSlice/siteSlice'
import { THEME_OPTIONS } from '../../data/theme_options'
import Segmented from '../segmented'
import type { Theme } from '../../store/siteSlice/siteSlice'

interface IProps {
  isVisible: boolean
  hide: () => void
}

function LibrarySetting(props: IProps) {
  const { t } = useTranslation()
  const { showMarker, showAddInfo, fontSize } = useSelector((state: RootState) => state.html)
  const { theme } = useSelector((state: RootState) => state.site)
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
          {/*
            Uch rejim: kunduzgi, o'qish (iliq qog'oz) va tungi. O'qish rejimi
            aynan shu yerda — maqola sozlamalarida — eng kerakli joyda turadi.
          */}
          <div className='library-setting__item-title'>{t('Appearance')}</div>
          <Segmented
            ariaLabel={t('Appearance')}
            value={theme}
            onChange={next => dispatch(setTheme(next as Theme))}
            options={THEME_OPTIONS.map(option => ({
              value: option.value,
              label: t(option.label),
              icon: option.icon
            }))}
          />
        </div>
      </div>
    </div>
  )
}

export default LibrarySetting
