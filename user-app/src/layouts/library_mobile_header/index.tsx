import React from 'react'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '../../img/icons/MenuIcon'
import ArrowLeft from '../../img/icons/ArrowLeft'

interface IProps {
  openPlan: () => void
}

function LibraryMobileHeader(props: IProps) {
  const navigate = useNavigate()
  return (
    <div className='mobile-library'>
      <div className='mobile-library__wrap'>
        <div className='mobile-library__btn' onClick={() => navigate(-1)}>
          <ArrowLeft />
        </div>
        <div className='mobile-library__title'>Mavzu</div>
      </div>
      <div className='mobile-library__wrap'>
        <div className='mobile-library__btn' onClick={props.openPlan}>
          <MenuIcon />
        </div>
      </div>
    </div>
  )
}

export default LibraryMobileHeader
