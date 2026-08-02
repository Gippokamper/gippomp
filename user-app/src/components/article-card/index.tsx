import React, { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Article from '../../img/icons/Article'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { request } from '../../helpers/request'
import { AuthContext } from '../../providers/auth-provider'
import LockIcon from '../../img/icons/LockIcon'
import lightIcon from '../../img/icons/cash.svg'
import darkIcon from '../../img/icons/cash-dark.svg'
import Modal, { IModal } from '../modal'

const SAVE_ARTICLE = async (id: string | number) => {
  const response = await request({
    url: `dashboard/user/articles/${id}/read`,
    method: 'POST'
  })

  return response.data
}

interface IProps {
  article: any
}

function ArticleCard(props: IProps) {
  const [isRead, setIsRead] = useState(props.article?.is_read)
  const { i18n, t } = useTranslation()
  const { userPermissions } = useContext(AuthContext)
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const { mutate, isLoading } = useMutation(SAVE_ARTICLE, {
    onSuccess: () => {
      setIsRead(!isRead)
    }
  })

  const clickArticle = (item: any) => {
    if (item.paid) {
      if (!userPermissions?.some((e: string) => e === 'articles')) {
        setModalOpen(true)
      } else {
        navigate('/article/' + props.article?.slug)
      }
    } else {
      navigate('/article/' + props.article?.slug)
    }
    return
  }

  const modalProps: IModal = useMemo(() => {
    return {
      title: t('Make an additional payment'),
      description: t('Your previous payment is not enough to purchase the fare, so make an additional payment'),
      onAccept: () => {
        setModalOpen(false)
        navigate('/account?type=tariffs')
      },
      close: () => setModalOpen(false),
      acceptTitle: 'Sotib olish',
      lightIcon: lightIcon,
      darkIcon: darkIcon,
      isOpen: modalOpen
    }
  }, [modalOpen, navigate])
  return (
    <div className='study-themes__item'>
      <button onClick={() => clickArticle(props.article)} className='study-themes__wrap'>
        {userPermissions?.some((e: string) => e === 'articles') ? <Article /> : <LockIcon />}
        <span>{props.article?.name?.[i18n.language]}</span>
      </button>
      <label htmlFor={'theme1' + props?.article?.slug} className='study-themes__check'>
        <input
          checked={isRead}
          type='checkbox'
          disabled={isLoading}
          id={'theme1' + props?.article?.slug}
          onChange={() => mutate(props?.article?.id)}
          className='checkbox'
        />
        <span>{t('Mark as read')}</span>
      </label>
      <Modal {...modalProps} />
    </div>
  )
}

export default ArticleCard
