import React, { useEffect, useMemo, useRef, useState } from 'react'
import GetContainer from '../../../components/get-container'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { MEDIA_URL, request } from '../../../helpers/request'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Modal from '../../../components/modal'
import lightIcon from '../../../img/icons/info-information-circle.svg'
import Success from '../../../components/notifications/Success'
import Error from '../../../components/notifications/Error'
import './settings.scss'

export const UPDATE_PROFILE = async (data: any) => {
  const response: any = await request({
    url: 'dashboard/user/profile',
    method: 'PUT',
    data: data
  })
  return response.data
}

interface IProps {
  userData: any
}

/**
 * "Sozlamalar" bo'limi — profil ma'lumotlarini tahrirlash.
 *
 * Qurilmalar ro'yxati bu yerdan olib tashlandi: u endi kabinetning alohida
 * bo'limi. Ikki joyda turgani chalkash edi.
 */
function Settings(props: IProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: props.userData
  })

  useEffect(() => {
    reset(props.userData)
  }, [props.userData, reset])

  const image = watch('image')

  const initials = useMemo(
    () =>
      [props.userData?.firstname, props.userData?.lastname]
        .filter(Boolean)
        .map((part: string) => part.trim().charAt(0).toUpperCase())
        .join('') || '?',
    [props.userData]
  )

  const { mutate, isLoading: isSaving } = useMutation(UPDATE_PROFILE, {
    onSuccess: async () => {
      // Barcha faol so'rovlarni yangilaymiz — header/sidebar ham yangi ma'lumotni ko'rsatsin.
      await queryClient.invalidateQueries()
      toast.custom(tr => <Success text={t('Profile updated')} onClose={() => toast.dismiss(tr.id)} />)
    },
    onError: () => {
      toast.custom(tr => <Error text={t('Wrong login or password')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })

  const uploadImage = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    const data = new FormData()
    data.append('folder', 'profile')
    data.append('image', file)

    setUploading(true)
    try {
      const response: any = await request({
        url: 'dashboard/photo_upload',
        method: 'POST',
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setValue('image', response?.data?.data?.path)
    } catch (error: any) {
      toast.custom(tr => (
        <Error text={t(error?.response?.data?.message)} onClose={() => toast.dismiss(tr.id)} />
      ))
    } finally {
      setUploading(false)
    }
  }

  if (!props.userData) return null

  return (
    <div className='acc-panel'>
      <div className='acc-panel__head'>
        <h2 className='acc-panel__title'>{t('Settings')}</h2>
        {/* Ilgari href'siz <a> edi — Tab bilan fokus olmasdi. */}
        <button type='button' className='acc-panel__action' onClick={() => setIsVisible(true)}>
          {t('Information about settings')}
        </button>
      </div>

      {/*
        Rasm tanlash — ilgari brauzerning xom "Faylni belgilash / Fayl
        belgilanmagan" tugmasi edi. Endi ko'rinadigan avatar va oddiy tugma.
      */}
      <div className='acc-form__avatar'>
        <span className='acc-hero__avatar'>
          {image ? <img src={MEDIA_URL + image} alt='' /> : <span>{initials}</span>}
        </span>
        <div className='acc-form__avatar-side'>
          <button
            type='button'
            className='ui-btn ui-btn--ghost'
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? t('Loading...') : t('Change profile picture')}
          </button>
          <span className='acc-form__hint'>JPG, PNG, GIF</span>
        </div>
        <input
          ref={fileRef}
          type='file'
          accept='image/png, image/gif, image/jpeg'
          className='acc-form__file'
          onChange={e => uploadImage(e.target.files)}
        />
      </div>

      <div className='acc-form'>
        <label className='acc-form__field'>
          <span>{t('Your name')}</span>
          <input type='text' placeholder={t('Enter your name')} {...register('firstname')} />
        </label>

        <label className='acc-form__field'>
          <span>{t('Your surname')}</span>
          <input type='text' placeholder={t('Enter your surname')} {...register('lastname')} />
        </label>

        <label className='acc-form__field'>
          <span>{t('Profession')}</span>
          <select {...register('profession')}>
            <option value='not selected'>{t('not selected')}</option>
            <option value='student'>{t('student')}</option>
            <option value='doctor'>{t('doctor')}</option>
            <option value='teacher'>{t('teacher')}</option>
          </select>
        </label>

        <label className='acc-form__field'>
          <span>{t('Study place')}</span>
          <GetContainer url='dashboard/user/universities'>
            {({ data, isLoading }) =>
              isLoading ? (
                <input type='text' disabled placeholder={t('Loading...')} />
              ) : (
                <select {...register('university_id')}>
                  <option value='not selected'>{t('not selected')}</option>
                  {data?.data?.map((item: any) => (
                    <option key={item?.id} value={item?.id}>
                      {t(item?.name)}
                    </option>
                  ))}
                </select>
              )
            }
          </GetContainer>
        </label>

        <label className='acc-form__field'>
          <span>{t('District/City')}</span>
          <GetContainer url='dashboard/user/regions'>
            {({ data, isLoading }) =>
              isLoading ? (
                <input type='text' disabled placeholder={t('Loading...')} />
              ) : (
                <select {...register('region_id')}>
                  <option value='not selected'>{t('not selected')}</option>
                  {data?.data?.map((item: any) => (
                    <option key={item?.id} value={item?.id}>
                      {t(item?.name)}
                    </option>
                  ))}
                </select>
              )
            }
          </GetContainer>
        </label>

        <label className='acc-form__field'>
          <span>{t('Province')}</span>
          <input type='text' placeholder={t('Province')} {...register('province')} />
        </label>

        <label className='acc-form__field'>
          <span>{t('Graduation year')}</span>
          <input type='number' min='1900' max='2099' step='1' placeholder='2026' {...register('graduation_year')} />
        </label>

        <label className='acc-form__field'>
          <span>{t('Birthday')}</span>
          <input type='date' {...register('birthday')} />
        </label>

        <label className='acc-form__field'>
          <span>{t('Sex')}</span>
          <select {...register('gender')}>
            <option value='not selected'>{t('not selected')}</option>
            <option value='male'>{t('male')}</option>
            <option value='female'>{t('female')}</option>
          </select>
        </label>

        <label className='acc-form__field'>
          <span>{t('Interest')}</span>
          <input type='text' placeholder={t('Interest')} {...register('interests')} />
        </label>

        <label className='acc-form__field'>
          <span>{t('Email')}</span>
          <input type='email' placeholder={t('Email')} {...register('email')} />
        </label>

        {/* Telefon o'zgartirilmaydi — tizimga kirish shu raqam orqali. */}
        <label className='acc-form__field'>
          <span>{t('Phone number')}</span>
          <input type='tel' disabled {...register('phone')} />
        </label>
      </div>

      <div className='acc-form__footer'>
        <button
          type='submit'
          className='ui-btn ui-btn--primary'
          disabled={isSaving}
          onClick={handleSubmit(data => mutate(data))}
        >
          {t('Save')}
        </button>
      </div>

      <Modal
        lightIcon={lightIcon}
        darkIcon={lightIcon}
        close={() => setIsVisible(false)}
        isOpen={isVisible}
        title={t('Modal title account ')}
        description={t('Modal account descr')}
      />
    </div>
  )
}

export default Settings
