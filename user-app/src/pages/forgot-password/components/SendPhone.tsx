import React, { Dispatch, SetStateAction } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { FORGOT_PASSWORD } from '../mutations'
import { ErrorMessage } from '@hookform/error-message'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputMask from 'react-input-mask'
import { stripPhoneNumber } from '../../../helpers/formatter'
import PhoneInput from '../../../components/phone-input'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Error from '../../../components/notifications/Error'

interface IFormInput {
  phone: string
}
interface IProps {
  setToken: Dispatch<SetStateAction<string>>
}
function SendPhone(props: IProps) {
  const {t} = useTranslation();
  const formSchema = Yup.object().shape({
    phone: Yup.string().required(t('Phone is required'))
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
  const { mutate } = useMutation(FORGOT_PASSWORD, {
    onSuccess: data => {
      props.setToken(data?.data?.token)
    },
    onError: () => {
      toast.custom(tr => <Error text={t('User not found')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })
  const onSubmit: SubmitHandler<IFormInput> = data => mutate({ ...data, phone: 998 + stripPhoneNumber(data?.phone) })
  return (
    <div className='login-content'>
      <h1 className='login__title section-title'>{t('Reset password')}</h1>
      <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <PhoneInput register={register} errors={errors} />
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

export default SendPhone
