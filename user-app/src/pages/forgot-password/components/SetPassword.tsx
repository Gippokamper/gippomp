import React from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { SET_PASSWORD } from '../mutations'
import { ErrorMessage } from '@hookform/error-message'
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast'
import Error from '../../../components/notifications/Error'

interface IFormInput {
  password: string
  password_confirmation: string
}

interface IProps {
  token: string
  code: string
}

function SetPassword(props: IProps) {
  const {t} = useTranslation();
  const formSchema = Yup.object().shape({
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
  const { mutate } = useMutation(SET_PASSWORD, {
    onSuccess: () => {
      navigate('/sign-in/')
    },
    onError: () => {
      toast.custom(tr => <Error text={t('Code is incorrect ')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })
  const onSubmit: SubmitHandler<IFormInput> = data => mutate({ ...data, token: props.token, code: props.code })
  return (
    <div className='login-content'>
      <h1 className='login__title section-title'>{t('Reset password')}</h1>
      <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='login-form__item'>
          <div className='login-form__text'>{t('Enter new password*')}</div>
          <div className='login-form__input'>
            <input type='text' placeholder='_ _ _ _' {...register('password')} />
          </div>
          <ErrorMessage errors={errors} name='password' />
        </div>
        <div className='login-form__item'>
          <div className='login-form__text'>{t('Repeat password*')}</div>
          <div className='login-form__input'>
            <input type='text' placeholder='_ _ _ _' {...register('password_confirmation')} />
          </div>
          <ErrorMessage errors={errors} name='password_confirmation' />
        </div>

        <div className='login-form__enter'>
          {t('Profile available')} ? <Link to='/sign-in'>{t('Enter')}</Link>
        </div>

        <button type='submit' className='login-form__btn btn'>
            {t('Continue')}
        </button>
      </form>
    </div>
  )
}

export default SetPassword
