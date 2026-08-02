import React from 'react'

import { nav_data } from '../../data/nav_data'
import { NavLink } from 'react-router-dom'

function LibrarySideMenu() {
  return (
    <ul className='side-menu'>
      {nav_data.map(nav => (
        <li key={nav.to}>
          <NavLink
            to={nav.to}
            className={({ isActive, isPending }) => (isPending ? 'current' : isActive ? 'current' : '')}
          >
            {nav.icon}
            <span>{nav.text}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default LibrarySideMenu
