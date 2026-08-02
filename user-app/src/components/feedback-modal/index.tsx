import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { request } from '../../helpers/request'
import toast from 'react-hot-toast'
import Success from '../notifications/Success'
interface IProps {
  isVisible: boolean
  hide: () => void
  article_slug?: string
  chapter_id?: number
  block_id?: number
  question_id?: number
  type: string
  zIndex?: number
}

export const SEND_FEEDBACK = async (data: any) => {
  const response = await request({
    url: 'dashboard/user/feedback',
    method: 'POST',
    data: data
  })

  return response.data
}

function FeedbackModal(props: IProps) {
  const { t } = useTranslation()
  const { mutate } = useMutation(SEND_FEEDBACK, {
    onSuccess: () => props.hide()
  })
  const [string, setString] = useState('')

  return (
    <div
      className='stats-popup'
      style={{
        display: props.isVisible ? 'block' : 'none',
        ...(props.zIndex
          ? {
              zIndex: props.zIndex
            }
          : {})
      }}
    >
      <div className='stats-popup__content'>
        <div className='stats-popup__close' onClick={props.hide}>
          <svg width={22} height={22} viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M3.625 18.1289L18.1287 3.6252'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M3.625 3.6252L18.1287 18.1289'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <div className='stats-popup__title'>{t('Leave feedback')}</div>
        <textarea
          placeholder={t('Send message to admin')}
          defaultValue={''}
          style={{
            width: '100%',
            maxWidth: '100%',
            minWidth: '100%',
            marginTop: '1.8rem',
            height: '10rem'
          }}
          value={string}
          onChange={e => setString(e.target.value)}
        />

        <div className='stats-info__btns'>
          {/* <button className='btn-white'>Yaqinroq bilish</button> */}
          <button
            className='btn'
            style={{ width: '100%' }}
            onClick={() =>
              mutate(
                {
                  article_slug: props.article_slug,
                  block_id: props.block_id,
                  question_id: props.question_id,
                  type: props.type,
                  chapter_id: props.chapter_id,
                  message: string
                },
                {
                  onSuccess: data => {
                    setString('')
                    toast.custom(tr => <Success text={t('Sent')} onClose={() => toast.dismiss(tr.id)} />)
                  }
                }
              )
            }
          >
            t({'Sending'})
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
