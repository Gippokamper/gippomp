import { useMutation, useQuery } from 'react-query'
import { request } from '../../helpers/request'
import { MainLayout } from '../../layouts/main'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Modal, { IModal } from '../../components/modal'
import { useTranslation } from 'react-i18next'
import WithHtml from '../../components/with-html'
import Success from '../../components/notifications/Success'
import Error from '../../components/notifications/Error'

const SEND_MESSAGE = async (data: any) => {
  const response = await request({
    url: '/dashboard/user/feedback_site',
    method: 'POST',
    data: data
  })
  return response.data
}

const GET_PRIVACY = async () => {
  const response = await request({
    url: '/dashboard/user/privacy_policy',
    method: 'GET'
  })
  return response.data
}

export const Help = () => {
  const { i18n, t } = useTranslation()
  const { mutate } = useMutation(SEND_MESSAGE, {
    onSuccess: data => {
      toast.custom(tr => <Success text={t('Message sended!')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })

  const { data } = useQuery(['privacy'], GET_PRIVACY)

  const [isCheched, setIsChecked] = useState(false)
  const { register, handleSubmit } = useForm()
  const onSubmit = (data: any) => {
    if (isCheched) {
      mutate(data)
    } else {
      toast.custom(tr => <Error text={t('Accept the user terms')} onClose={() => toast.dismiss(tr.id)} />)
    }
  }

  const [modalOpen, setModalOpen] = useState(false)

  const modalProps: IModal = useMemo(() => {
    return {
      title: t('User Terms title'),
      description: t('User Terms description'),
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
  }, [modalOpen])

  return (
    <MainLayout>
      <section className='help'>
        <h1 className='help__title section-title'>{t('Help center')}</h1>
        <div className='help-content'>
          <div className='help-side'>
            <div className='section-subtitle'>{t('Contact us')}</div>
            <div className='help-side__form'>
              <div className='account-settings__item'>
                <div className='account-settings__name'>{t('Your name')}</div>
                <div className='account-settings__input'>
                  <input type='text' placeholder={t('Enter your name')} {...register('name')} />
                </div>
              </div>
              <div className='account-settings__item'>
                <div className='account-settings__name'>{t('Your phone or email')}</div>
                <div className='account-settings__input'>
                  <input type='text' placeholder={t('Enter your phone or email')} {...register('contact')} />
                </div>
              </div>
              <div className='account-settings__item'>
                <div className='account-settings__name'>{t('Commentary')}</div>
                <div className='account-settings__input'>
                  <textarea placeholder={t('Commentary')} defaultValue={''} {...register('message')} />
                </div>
              </div>
              <label htmlFor='check' className='login-form__check'>
                <input type='checkbox' id='check' checked={isCheched} onChange={e => setIsChecked(e.target.checked)} />
                <span>
                  {t('All')}{' '}
                  <a href='#' onClick={() => setModalOpen(true)}>
                    {t('to the conditions')}
                  </a>{' '}
                  {t('I agree')}
                </span>
              </label>
              <button onClick={handleSubmit(data => onSubmit(data))} className='help-side__btn'>
                {t('Send')}
              </button>
            </div>
          </div>
          <div className='help-main'>
            <WithHtml html={data?.data?.text?.[i18n.language]} />
          </div>
        </div>
        <Modal {...modalProps} />
      </section>
    </MainLayout>
  )
}
