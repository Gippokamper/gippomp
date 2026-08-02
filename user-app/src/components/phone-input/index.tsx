import React from 'react'
import Iye from '../../img/Iye'
import { InputMask, useMask } from '@react-input/mask'
import { ErrorMessage } from '@hookform/error-message'
import { useTranslation } from 'react-i18next'

interface IProps {
  register: any
  errors: any
}

function PhoneInput(props: IProps) {
  const {t} = useTranslation();
  const inputRef = useMask({ mask: '(__) ___-__-__', replacement: { _: /\d/ } })
  return (
    <div className='login-form__item'>
      <div className='login-form__text'>{t('Phone number')}*</div>
      <div
        className='login-form__input '
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          borderRadius: '0.4rem',
          paddingInline: '0.4rem'
        }}
      >
        +998{' '}
        <InputMask
          placeholder='(__) ___-__-__'
          mask='(__) ___-__-__'
          replacement={{ _: /\d/ }}
          {...props.register('phone')}
        />
        {/* <input placeholder='(99) 999-99-99' {...props.register('phone')} ref={inputRef} /> */}
      </div>
      <span
        style={{
          fontSize: '0.7rem'
        }}
      >
        <ErrorMessage errors={props.errors} name='phone' />
      </span>
    </div>
  )
}

export default PhoneInput
