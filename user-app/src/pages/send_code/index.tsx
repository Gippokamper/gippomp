import { SubmitHandler, useForm } from 'react-hook-form'
import Iye from '../../img/Iye'
import Logo from '../../img/Logo'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorMessage } from '@hookform/error-message'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SEND_CODE } from './mutations'
import toast from 'react-hot-toast'
import { request } from '../../helpers/request'
import { useTranslation } from 'react-i18next'
import Success from '../../components/notifications/Success'
import Error from '../../components/notifications/Error'

interface IFormInput {
  code: string
}

export const SEND_CODE_GET = async () => {
  const response = await request({
    url: 'phone/verification',
    method: 'GET'
  })

  return response.data
}

function SendCode() {
  const { t } = useTranslation()
  const formSchema = Yup.object().shape({
    code: Yup.string().required(t('Code is required')).min(4, t('Code is incorrect ')).max(4, t('Code is incorrect '))
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
  const { mutate } = useMutation(SEND_CODE, {
    onSuccess: data => {
      // Telefon tasdiqlash access_token qaytarmaydi — foydalanuvchi allaqachon
      // ro'yxatdan o'tishda token olgan. Uni "undefined" bilan buzmaymiz.
      if (data?.data?.access_token) {
        localStorage.setItem('accessToken', data.data.access_token)
      }
      navigate('/library/')
    },
    onError: () => {
      toast.custom(tr => <Error text={t('Code is incorrect ')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })

  const { data, refetch } = useQuery(['SEND_CODE_GET'], SEND_CODE_GET, {
    // Kod faqat sahifaga kirilganda bir marta yuboriladi; oyna fokusida qayta SMS ketmasin.
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: () => toast.custom(tr => <Success text={t('SMS sended!')} onClose={() => toast.dismiss(tr.id)} />)
  })
  const onSubmit: SubmitHandler<IFormInput> = data => mutate(data)

  return (
    <>
      <section className='login'>
        <div className='login__logo'>
          <Logo />
        </div>
        <div className='login-content'>
          <h1 className='login__title section-title'>{t('Verification')}</h1>
          <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='login-form__item'>
              <div className='login-form__text'>{t('Enter SMS code*')}</div>
              <div className='login-form__input'>
                <input type='text' placeholder='_ _ _ _' {...register('code')} />
              </div>
              <ErrorMessage errors={errors} name='code' />
            </div>

            <div className='login-form__enter'>
              {t('Profile available')} ? <Link to='/sign-in'>{t('Enter')}</Link>
              <br />
              <br />
              <a onClick={() => refetch()}>{t('Resend the code')}</a>
            </div>

            <button type='submit' className='login-form__btn btn'>
              {t('Continue')}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default SendCode
