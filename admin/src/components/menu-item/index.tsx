import React, { ReactNode } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './index.module.scss'
import { NavLink } from 'react-router-dom'

interface IMenuButton {
  icon?: ReactNode
  text: string
  link: string
  collapsed: boolean
}

function MenuButton(props: IMenuButton) {
  return (
    <NavLink
      className={({ isActive, isPending }) =>
        isActive
          ? props.collapsed
            ? styles.container_collapsed_active
            : styles.container_active
          : props.collapsed
          ? styles.container_collapsed
          : styles.container
      }
      to={props.link}
    >
      {props.icon}
      <span>{props.text}</span>
    </NavLink>
  )
}

export default MenuButton
