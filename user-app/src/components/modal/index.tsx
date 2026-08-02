import React from 'react'
import close from '../../img/icons/close.svg'
export interface IModal {
  isOpen: boolean
  title: string
  description: string
  onCancel?: () => void
  onAccept?: () => void
  cancelTitle?: string
  acceptTitle?: string
  close: () => void
  darkIcon?: any
  lightIcon?: any
}

function Modal(props: IModal) {
  return (
    <div
      className='account-popup'
      style={{
        display: props.isOpen ? 'block' : 'none'
      }}
    >
      <div className='account-popup__close' onClick={props.close}>
        <img src={close} alt='ico' />
      </div>
      <div className='account-popup__content'>
        {props.darkIcon && props.lightIcon && (
          <div className='account-popup__img'>
            <img src={props.lightIcon} alt='ico' className='account-popup__img-light' />
            <img src={props.darkIcon} alt='ico' className='account-popup__img-dark' />
          </div>
        )}
        <div className='account-popup__title section-subtitle'>{props.title}</div>
        <div className='account-popup__text'>{props.description}</div>
        <div className='account-popup__btns'>
          {props.onCancel && (
            <button onClick={props.onCancel} className='account-popup__btn btn btn-grey'>
              {props.cancelTitle}
            </button>
          )}
          {props.onAccept && (
            <button onClick={props.onAccept} className='account-popup__btn btn'>
              {props.acceptTitle}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
