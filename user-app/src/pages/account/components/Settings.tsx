import React, { useEffect, useState } from 'react'
import GetContainer from '../../../components/get-container'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { request } from '../../../helpers/request'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Modal from '../../../components/modal'
import lightIcon from '../../../img/icons/info-information-circle.svg'
import Success from '../../../components/notifications/Success'
import Error from '../../../components/notifications/Error'
import DeviceCard from '../../../components/device-card'
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

function Settings(props: IProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const queryClient = useQueryClient()
  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: props.userData
  })
  useEffect(() => {
    reset(props.userData)
  }, [props.userData, reset])

  const { mutate } = useMutation(UPDATE_PROFILE, {
    onSuccess: async () => {
      // Barcha faol so'rovlarni yangilaymiz — header/sidebar ham yangi ma'lumotni ko'rsatsin.
      await queryClient.invalidateQueries()
      toast.custom(tr => <Success text={t('Profile updated')} onClose={() => toast.dismiss(tr.id)} />)
    },
    onError: () => {
      toast.custom(tr => <Error text={t('Wrong login or password')} onClose={() => toast.dismiss(tr.id)} />)
    }
  })

  const GET_IMAGE = async (file: File[], cb: any) => {
    const image = file[0]
    const data = new FormData()
    data.append('folder', 'profile')
    data.append('image', image)
    await request({
      url: 'dashboard/photo_upload',
      method: 'POST',
      data: data,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response: any) => {
        // Rasm yo'lini forma qiymatiga yozamiz — alohida `photo` state kerak
        // emas edi, u hech qayerda o'qilmasdi.
        cb('image', response?.data?.data?.path)
      })
      .catch((error: any) =>
        toast.custom(tr => <Error text={t(error?.response?.data?.message)} onClose={() => toast.dismiss(tr.id)} />)
      )
  }
  return (
    props.userData && (
      <div className='account-tab'>
        <div className='account-settings'>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Your name')}</div>
            <div className='account-settings__input'>
              <input type='text' placeholder={t('Enter your name')} {...register('firstname')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Your surname')}</div>
            <div className='account-settings__input'>
              <input type='text' placeholder={t('Enter your surname')} {...register('lastname')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Profession')}</div>
            <div className='account-settings__input'>
              <select {...register('profession')}>
                <option key={'not selected'} value={'not selected'}>
                  {t('not selected')}
                </option>
                <option key={'student'} value={'student'}>
                  {t('student')}
                </option>
                <option key={'doctor'} value={'doctor'}>
                  {t('doctor')}
                </option>
                <option key={'teacher'} value={'teacher'}>
                  {t('teacher')}
                </option>
              </select>
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Study place')}</div>
            <div className='account-settings__input'>
              <GetContainer url='dashboard/user/universities'>
                {({ data, isLoading }) =>
                  isLoading ? (
                    <p>{t('Loading...')}</p>
                  ) : (
                    <select {...register('university_id')}>
                      <option key={'not selected'} value={null || 'not selected'}>
                        {t('not selected')}
                      </option>
                      {data?.data?.map((region: any) => (
                        <option key={region?.id} value={region?.id}>
                          {t(region?.name)}
                        </option>
                      ))}
                    </select>
                  )
                }
              </GetContainer>
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Interest')}</div>
            <div className='account-settings__input'>
              <input type='text' placeholder={t('Enter your name')} {...register('interests')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Graduation year')}</div>
            <div className='account-settings__input'>
              <input
                type='number'
                min='1900'
                max='2099'
                step='1'
                placeholder={t('Graduation year')}
                {...register('graduation_year')}
              />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Birthday')}</div>
            <div className='account-settings__input'>
              <input type='date' placeholder={t('Birthday')} {...register('birthday')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Sex')}</div>
            <div className='account-settings__input'>
              <select {...register('gender')}>
                <option key={'not selected'} value={'not selected'}>
                  {t('not selected')}
                </option>
                <option value={'male'}>{t('male')}</option>
                <option value={'female'}>{t('female')}</option>
              </select>
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Phone number')}</div>
            <div className='account-settings__input'>
              <input disabled type='tel' placeholder={t('Enter your name')} {...register('phone')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Email')}</div>
            <div className='account-settings__input'>
              <input type='email' placeholder={t('Email')} {...register('email')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('District/City')}</div>
            <div className='account-settings__input'>
              <GetContainer url='dashboard/user/regions'>
                {({ data, isLoading }) =>
                  isLoading ? (
                    <p>{t('Loading...')}</p>
                  ) : (
                    <select {...register('region_id')}>
                      <option key={'not selected'} value={null || 'not selected'}>
                        {t('not selected')}
                      </option>
                      {data?.data?.map((region: any) => (
                        <option key={region?.id} value={region?.id}>
                          {t(region?.name)}
                        </option>
                      ))}
                    </select>
                  )
                }
              </GetContainer>
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Province')}</div>
            <div className='account-settings__input'>
              <input type='text' placeholder={t('Province')} {...register('province')} />
            </div>
          </div>
          <div className='account-settings__item'>
            <div className='account-settings__name'>{t('Change profile picture')}</div>
            <label htmlFor='file' className='account-settings__file'>
              <input
                type='file'
                accept='image/png, image/gif, image/jpeg'
                id='file'
                //@ts-ignore
                onChange={e => GET_IMAGE(e.target.files, setValue)}
              />
              <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {t('Select a file')}
              </span>
              {
                <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {getValues('image') ? getValues('image') : t('No file selected')}
                </p>
              }
            </label>
          </div>
          <div className='account-settings__item'>
            {/* Ilgari href'siz <a> edi — Tab bilan fokus olmasdi. */}
            <button type='button' onClick={() => setIsVisible(true)} className='account-settings__info'>
              <svg width={30} height={30} viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <circle
                  cx='14.9969'
                  cy='14.9969'
                  r='11.2547'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.75 19.3753H16.6379'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M15.1959 19.3772V14.0625H13.7578'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M15.1254 10.3049C15.1254 10.4776 14.9854 10.6176 14.8128 10.6176C14.6401 10.6176 14.5001 10.4776 14.5001 10.3049C14.5001 10.1323 14.6401 9.99232 14.8128 9.99232'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M14.8127 9.99238C14.9854 9.99238 15.1253 10.1324 15.1253 10.305'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{t('Information about settings')}</span>
            </button>
          </div>
          <div className='account-settings__item'>
            <button type='submit' className='account-settings__btn' onClick={handleSubmit(data => mutate(data))}>
              {t('Save')}
            </button>
          </div>
        </div>

        {/*
          Qurilmalar ilgari Tariflar tabida turardi — tarifga aloqasi yo'q,
          bu profil sozlamasi. Shu yerga ko'chirildi.
        */}
        <section className='acc-devices'>
          <h2 className='acc-devices__title'>{t('Devices')}</h2>
          <p className='acc-devices__hint'>{t('You can be logged in on up to 4 devices')}</p>
          <div className='rate-devices'>
            <GetContainer url='dashboard/user/devices'>
              {({ data, refetch }) =>
                data?.data?.length ? (
                  data.data.map((item: any) => <DeviceCard key={item?.id} item={item} refetch={refetch} />)
                ) : (
                  <p className='acc-devices__hint'>{t('No devices')}</p>
                )
              }
            </GetContainer>
          </div>
        </section>
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
  )
}

export default Settings
