import { Delete } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Confirm from '../../../../components/confirm'

interface IProps {
  to: string
  title: string
  onClick: () => void
}

function CategoryItem(props: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const onConfirm = () => {
    setIsOpen(false)
    props.onClick()
  }
  return (
    <Box>
      <Link to={props.to}>{props.title}</Link>
      <IconButton onClick={() => setIsOpen(true)}>
        <Delete />
      </IconButton>
      <Confirm
        title='Are you sure delete this?'
        onCancel={() => setIsOpen(false)}
        onConfirm={onConfirm}
        isOpen={isOpen}
      />
    </Box>
  )
}

export default CategoryItem
