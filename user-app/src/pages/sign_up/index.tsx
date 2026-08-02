import { SubmitHandler, useForm } from 'react-hook-form'
import Iye from '../../img/Iye'
import Logo from '../../img/Logo'
import { useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { REGISTER } from './mutations'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorMessage } from '@hookform/error-message'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import IyeHide from '../../img/icons/IyeHide'
import { stripPhoneNumber } from '../../helpers/formatter'
import InputMask from 'react-input-mask'
import PhoneInput from '../../components/phone-input'
import Modal, { IModal } from '../../components/modal'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Error from '../../components/notifications/Error'

interface IFormInput {
  firstname: string
  phone: string
  password: string
  password_confirmation: string
}

export const SignUp = () => {
  const {t} = useTranslation();

  const formSchema = Yup.object().shape({
    firstname: Yup.string().required(t('Phone is required')),
    phone: Yup.string().required(t('Phone is required')),
    password: Yup.string().required(t('Password is required')).min(6, t('Password length should be at least 6 characters')),
    password_confirmation: Yup.string()
      .required(t('Confirm Password is required'))
      .min(6, t('Password length should be at least 6 characters'))
      .oneOf([Yup.ref('password')], t('Passwords do not match'))
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>({
    mode: 'onTouched',
    //@ts-ignore
    resolver: yupResolver(formSchema)
  })
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const { mutate } = useMutation(REGISTER, {
    onSuccess: data => {
      // Ro'yxatdan o'tgach token saqlanmasa, /send-code sahifasidagi telefon
      // tasdiqlash so'rovi Authorization'siz ketib 401 beradi (login'ga qaytaradi).
      if (data?.data?.access_token) {
        localStorage.setItem('accessToken', data.data.access_token)
      }
      if (data?.data?.refresh_token) {
        localStorage.setItem('refreshToken', data.data.refresh_token)
      }
      navigate('/send-code')
    },
    onError: () => {
      toast.custom(tr => <Error text={t('Wrong login or password')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })
  const onSubmit: SubmitHandler<IFormInput> = data => mutate({ ...data, phone: 998 + stripPhoneNumber(data?.phone) })
  const [hide, setHide] = useState({
    password: true,
    password_confirmation: true
  })

  const [modalOpen, setModalOpen] = useState(false)

  const modalProps: IModal = useMemo(() => {
    return {
      title: t('Sign up title'),
      description: t('Sign up desc'),
      //   onAccept: () => {
      //     setModalOpen(false)
      //     navigate('/account?type=tariffs')
      //   },
      close: () => setModalOpen(false),
      //   acceptTitle: 'Sotib olish',
      lightIcon: false,
      darkIcon: false,
      isOpen: modalOpen
    }
  }, [modalOpen, navigate])

  return (
    <>
      {/* SIGN-UP */}
      <section className='login login-reg'>
        <div className='login__logo'>
          <Logo />
        </div>
        <div className='login-content'>
          <h1 className='login__title section-title'>{t('Registration')}</h1>
          <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='login-form__item'>
              <div className='login-form__text'>{t('Name*')}</div>
              <div className='login-form__input'>
                <input type='text' placeholder={t('Enter your name')} {...register('firstname')} />
              </div>
              <span
                style={{
                  fontSize: '0.7rem'
                }}
              >
                <ErrorMessage errors={errors} name='firstname' />
              </span>
            </div>
            <PhoneInput register={register} errors={errors} />
            <div className='login-form__item'>
              <div className='login-form__text'>{t('New Password*')}</div>
              <div className='login-form__input login-form__password'>
                <input
                  type={hide?.password ? 'password' : 'text'}
                  placeholder={t('Enter the password')}
                  {...register('password')}
                />
                {hide.password ? (
                  <Iye onClick={() => setHide({ ...hide, password: !hide.password })} />
                ) : (
                  <IyeHide onClick={() => setHide({ ...hide, password: !hide.password })} />
                )}
              </div>
              <span
                style={{
                  fontSize: '0.7rem'
                }}
              >
                <ErrorMessage errors={errors} name='password' />
              </span>
            </div>
            <div className='login-form__item'>
              <div className='login-form__text'>{t('Repeat password*')}</div>
              <div className='login-form__input login-form__password'>
                <input
                  type={hide?.password_confirmation ? 'password' : 'text'}
                  placeholder={t('Repeat password')}
                  {...register('password_confirmation')}
                />
                {hide.password_confirmation ? (
                  <Iye onClick={() => setHide({ ...hide, password_confirmation: !hide.password_confirmation })} />
                ) : (
                  <IyeHide onClick={() => setHide({ ...hide, password_confirmation: !hide.password_confirmation })} />
                )}
              </div>
              <span
                style={{
                  fontSize: '0.7rem'
                }}
              >
                {' '}
                <ErrorMessage errors={errors} name='password_confirmation' />
              </span>
            </div>
            <label htmlFor='check' className='login-form__check'>
              <input type='checkbox' id='check' checked={confirm} onChange={e => setConfirm(e.target.checked)} />
              <span>
                {t('All')}{' '}
                <a href='#' onClick={() => setModalOpen(true)}>
                  {t('to the conditions')}
                </a>{' '}
                {t('I agree')}
              </span>
            </label>
            <div className='login-form__enter'>
              {t('Do I have a profile?')} <Link to='/sign-in'>{t('Enter')}</Link>
            </div>
            {/* disabled btn*/}
            <button className={`login-form__btn btn ${confirm ? '' : 'btn-disabled'}`} type='submit' disabled={!confirm}>
              {t('Continue')}
            </button>
          </form>
        </div>
        <Modal {...modalProps} />
      </section>
    </>
  )
}
