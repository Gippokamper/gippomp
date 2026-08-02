import React from 'react'
import { useTranslation } from 'react-i18next'


function StudyTestSide() {
  const {t} = useTranslation();

  return (
    <div className='study-test__side'>
      <div className='study-test__search'>
        <div className='header-search'>
          <div className='header-search__input'>
            <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g clipPath='url(#clip0_2522_8521)'>
                <path
                  d='M19.6334 17.871L15.7624 13.9984C18.6588 10.1278 17.8691 4.64195 13.9984 1.74551C10.1278 -1.15092 4.64195 -0.361157 1.74551 3.50949C-1.15092 7.38013 -0.361157 12.866 3.50949 15.7624C6.61871 18.0891 10.8892 18.0891 13.9984 15.7624L17.871 19.635C18.3577 20.1216 19.1467 20.1216 19.6333 19.635C20.12 19.1483 20.12 18.3593 19.6333 17.8727L19.6334 17.871ZM8.78623 15.015C5.34618 15.015 2.55751 12.2263 2.55751 8.78623C2.55751 5.34618 5.34618 2.55751 8.78623 2.55751C12.2263 2.55751 15.015 5.34618 15.015 8.78623C15.0113 12.2247 12.2248 15.0113 8.78623 15.015Z'
                  fill='currentColor'
                />
              </g>
              <defs>
                <clipPath id='clip0_2522_8521'>
                  <rect width={20} height={20} fill='white' />
                </clipPath>
              </defs>
            </svg>
            <input type='text' placeholder={t('Search')} />
          </div>
        </div>
      </div>
      <div className='study-test__head'>
        <li className='current'>Nmadur</li>
        <li>Qaysidur</li>
        <li>Qaysidur</li>
      </div>
      <div className='study-test__table'>
        <div className='study-test__table-row study-test__table-head'>
          <div>O’tkazildi</div>
          <div>Xabar</div>
        </div>
        <div className='study-test__table-row'>
          <div>2023-06-05 16:32:23</div>
          <div>
            +1 qurilma tarifi uchun hisobingizdan 45000 so’m yechib qolindi. Hozircha ballansingiz 365000.00 so’m
          </div>
        </div>
        <div className='study-test__table-row'>
          <div>2023-06-05 16:32:23</div>
          <div>
            +1 qurilma tarifi uchun hisobingizdan 45000 so’m yechib qolindi. Hozircha ballansingiz 365000.00 so’m
          </div>
        </div>
        <div className='study-test__table-row'>
          <div>2023-06-05 16:32:23</div>
          <div>
            +1 qurilma tarifi uchun hisobingizdan 45000 so’m yechib qolindi. Hozircha ballansingiz 365000.00 so’m
          </div>
        </div>
      </div>
      <button className='study-test__side-close'>Yopish</button>
    </div>
  )
}

export default StudyTestSide
