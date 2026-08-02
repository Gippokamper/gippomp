import React, { RefObject, TextareaHTMLAttributes, useRef, useState } from 'react'
import GetContainer from '../../../components/get-container'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { SEND_FEEDBACK } from '../../../components/feedback-modal'
import CloseIcon from '../../../img/icons/CloseIcon'
import { request } from '../../../helpers/request'
import PaginatedItems from '../../../components/pagination'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Success from '../../../components/notifications/Success'

export const REPLY_FEEDBACK = async (data: any) => {
  const response = await request({
    url: 'dashboard/user/feedback/' + data?.id,
    method: 'POST',
    data: data
  })
  return response.data
}

function Messages() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<any>(null)
  const ref = useRef<any>()
  const [string, setString] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { mutate } = useMutation(selected ? REPLY_FEEDBACK : SEND_FEEDBACK)
  const onSubmit = (cb: any) => {
    mutate(
      selected
        ? {
            id: selected?.id,
            message: string
          }
        : {
            type: 'message',
            message: string
          },
      {
        onSuccess: () => {
          cb()
          setSelected(null)
          setString('')
          toast.custom(tr => <Success text={t('Sent')} onClose={() => toast.dismiss(tr.id)} />)
        }
      }
    )
  }
  console.log(pageNumber, 'page number')
  return (
    <GetContainer
      url='dashboard/user/feedback'
      params={{
        perPage: 10,
        page: pageNumber
      }}
    >
      {({ data, refetch }) => (
        <div className='account-tab'>
          <div className='account-message'>
            {selected && (
              <div
                style={{
                  width: '80%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '0.5rem'
                }}
              >
                {t('ID:')} {selected?.id}
                <button
                  onClick={() => {
                    setSelected(null)
                  }}
                  style={{
                    display: 'inline-block',
                    textAlign: 'right'
                  }}
                >
                  X
                </button>
              </div>
            )}
            <div className='account-message__text'>
              <textarea
                ref={ref}
                value={string}
                onChange={e => setString(e.target.value)}
                placeholder={t('Send message to admin')}
                defaultValue={''}
              />
              <button onClick={() => onSubmit(refetch)} className='account-settings__btn'>
                {t('Send')}
              </button>
            </div>
            <div className='rate__subtitle'>{t('News')}</div>
            <div className='rate-table'>
              <div className='rate-table__row rate-table__head'>
                <div>{t('ID Number')}</div>
                <div>{t('News')}</div>
                <div>{t('Actions')}</div>
              </div>
              {data?.data?.map((item: any) => (
                <div key={item.id} className='rate-table__row'>
                  <div>{item.id}</div>
                  <div>
                    <ul>
                      {item?.messages?.map((message: any, index: number) => (
                        <li key={message?.id ?? `${item.id}-${index}`}>
                          {message?.author === 'user' ? t('You') : t('Admin')}: {message?.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <button
                      className='btn'
                      style={{
                        padding: '0.5rem',
                        marginRight: '1rem'
                      }}
                      onClick={() => {
                        setSelected(item)
                        ref?.current?.focus()
                      }}
                    >
                      {t('Answer')}
                    </button>
                    {item?.chapter_id ? (
                      <button
                        style={{
                          padding: '0.5rem'
                        }}
                        className='btn'
                        onClick={() =>
                          navigate('/article/' + item?.article_id?.slug + '?chapter_id=' + item?.chapter_id?.id)
                        }
                      >
                        {t('Transition')}
                      </button>
                    ) : item?.question_id ? (
                      <button
                        style={{
                          padding: '0.5rem'
                        }}
                        className='btn'
                        onClick={() =>
                          navigate('/test/' + item?.block_id?.id + '?question_id=' + item?.question_id?.id)
                        }
                      >
                        {t('Transition')}
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {data && <PaginatedItems total={data?.meta?.total} itemsPerPage={10} setPageNumber={setPageNumber} />}
        </div>
      )}
    </GetContainer>
  )
}

export default Messages
