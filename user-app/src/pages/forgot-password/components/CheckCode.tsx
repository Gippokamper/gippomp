import React, { Dispatch, SetStateAction } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import { FORGOT_SEND_CODE } from '../mutations'
import { ErrorMessage } from '@hookform/error-message'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Error from '../../../components/notifications/Error'
interface IFormInput {
  code: string
}
interface IProps {
  setCode: Dispatch<SetStateAction<string>>
  setToken: Dispatch<SetStateAction<string>>
  token: string
}
function CheckCode(props: IProps) {
  const {t} = useTranslation(); 
  const formSchema = Yup.object().shape({
    code: Yup.string().required(t('Code is required')).min(6, t('Code is incorrect ')).max(6, t('Code is incorrect '))
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
  const { mutate } = useMutation(FORGOT_SEND_CODE, {
    // Backend faqat yangi `token` qaytaradi; `code` esa foydalanuvchi kiritgan qiymat.
    onSuccess: (data, variables: any) => {
      props.setToken(data?.data?.token)
      props.setCode(variables?.code)
    },
    onError: () => {
      toast.custom(tr => <Error text={t('Code is incorrect ')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })
  const onSubmit: SubmitHandler<IFormInput> = data => mutate({ ...data, token: props.token })
  return (
    <div className='login-content'>
      <h1 className='login__title section-title'>{t('Verification')}</h1>
      <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='login-form__item'>
          <div className='login-form__text'>{t('Enter the SMS code*')}</div>
          <div className='login-form__input'>
            <input type='text' placeholder='_ _ _ _ _ _' {...register('code')} />
          </div>
          <ErrorMessage errors={errors} name='code' />
        </div>

        <div className='login-form__enter'>
          {t('Profile available')} ? <Link to='/sign-in'>{t('Kirish')}</Link>
        </div>

        <button type='submit' className='login-form__btn btn'>
          {t('Continue')}
        </button>
      </form>
    </div>
  )
}

export default CheckCode
