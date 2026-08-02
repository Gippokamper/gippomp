import React, { ReactNode } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './index.module.scss'
import { NavLink } from 'react-router-dom'
import { Button } from '@mui/material'

interface IMenuButton {
  icon: ReactNode
  text: string
  isActive?: boolean
  onClick?: () => void
}

function CategoryButton(props: IMenuButton) {
  return (
    <div onClick={props.onClick} className={props.isActive ? styles.container_active : styles.container}>
      {props.icon}
      <span>{props.text}</span>
    </div>
  )
}

export default CategoryButton
