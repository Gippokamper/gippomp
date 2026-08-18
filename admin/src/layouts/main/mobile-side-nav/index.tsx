import { Drawer } from '@mui/material'
import SideNav, { ISideNavProps } from '../side-nav'

// Ilgari bu shunchaki `position:absolute` div edi: fon (backdrop) yo'q, tashqariga
// bosib yopib bo'lmasdi va menyudan o'tgandan keyin ham ochiq qolardi.
function MobileSideNav(props: ISideNavProps) {
  const close = () => props.setToggled(false)

  return (
    <Drawer
      open={props.toggled}
      onClose={close}
      anchor='left'
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { border: 'none' } }}
    >
      <SideNav {...props} collapsed={false} onNavigate={close} />
    </Drawer>
  )
}

export default MobileSideNav
