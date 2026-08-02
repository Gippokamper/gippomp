import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import React from 'react'

interface IProps {
  title: string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

function Confirm(props: IProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onCancel}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <DialogTitle id='scroll-dialog-title'>{props.title}</DialogTitle>
      {/* <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
          {[...new Array(50)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
            )
            .join('\n')}
        </DialogContentText>
      </DialogContent> */}
      <DialogActions>
        <Button onClick={props.onCancel}>No</Button>
        <Button onClick={props.onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Confirm
