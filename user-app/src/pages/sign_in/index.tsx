import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import Iye from '../../img/Iye'
import Logo from '../../img/Logo'
import { useContext, useState } from 'react'
import { useMutation } from 'react-query'
import { LOGIN } from './mutations'
import { Link, redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorMessage } from '@hookform/error-message'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DeviceModal from '../../components/device-modal'
import IyeHide from '../../img/icons/IyeHide'
import PhoneInput from '../../components/phone-input'
import InputMask from 'react-input-mask'
import { stripPhoneNumber } from '../../helpers/formatter'
import { AuthContext } from '../../providers/auth-provider'
import { useTranslation } from 'react-i18next'


interface IFormInput {
  phone: string
  password: string
}

function SignIn() {
  const {t} = useTranslation();
  const { login } = useContext(AuthContext)
  const formSchema = Yup.object().shape({
    phone: Yup.string().required(t('Phone is required')),
    password: Yup.string().required(t('Password is required')).min(6, t('Password length should be at least 6 characters'))
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<IFormInput>({
    mode: 'onTouched',
    //@ts-ignore
    resolver: yupResolver(formSchema)
  })

  const onSubmit: SubmitHandler<IFormInput> = data => {
    login({ ...data, phone: 998 + stripPhoneNumber(data.phone) })
    console.log(data)
  }
  const [hide, setHide] = useState({
    password: true,
    password_confirmation: true
  })
  console.log(getValues('phone'))

  return (
    <>
      <section className='login'>
        <div className='login__logo'>
          <Logo />
        </div>
        <div className='login-content'>
          <h1 className='login__title section-title'>{t('Login to profile')}</h1>
          <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
            <PhoneInput register={register} errors={errors} />
            <div className='login-form__item'>
              <div className='login-form__text'>{t('Password')}</div>
              <div className='login-form__input login-form__password'>
                <input
                  type={hide.password ? 'password' : 'test'}
                  placeholder={t('Enter the password')}
                  {...register('password')}
                />
                {hide.password ? (
                  <Iye onClick={() => setHide({ ...hide, password: !hide.password })} />
                ) : (
                  <IyeHide onClick={() => setHide({ ...hide, password: !hide.password })} />
                )}
              </div>
              <ErrorMessage errors={errors} name='password' />
            </div>
            <div className='login-form__enter'>
              {t('Profile not available')} <Link to='/sign-up'>{t('Create')}</Link>
            </div>
            <div className='login-form__enter'>
              <Link to='/forgot-password/'>{t('I forgot my password')}</Link>
            </div>
            <button className='login-form__btn btn'>{t('Continue')}</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default SignIn
