import React from 'react'
import SideNav, { ISideNavProps } from '../side-nav'

function MobileSideNav(props: ISideNavProps) {
  return (
    <div
      style={{
        position: 'absolute',
        display: props.toggled ? 'block' : 'none',
        maxHeight: '100vh',

        top: 0,
        left: 0
      }}
    >
      <SideNav {...props} />
    </div>
  )
}

export default MobileSideNav
