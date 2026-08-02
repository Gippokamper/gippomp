import React from 'react'
import LabsTable from '../labs-table'
import { useTranslation } from 'react-i18next'

interface IProps {
  isVisible: boolean
  hide: () => void
}

function LabTableMobile(props: IProps) {
  const {t} = useTranslation();
  return (
    <div
      className='library-setting'
      style={{
        display: props.isVisible ? 'flex' : 'none'
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
          <LabsTable isOpen={props.isVisible} close={props.hide} />
        </div>
      </div>
    </div>
  )
}

export default LabTableMobile
