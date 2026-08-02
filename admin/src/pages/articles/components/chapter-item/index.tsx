import React, { useState } from 'react'
import styles from './index.module.scss'
import { Box, Collapse, IconButton, Typography } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useNavigate } from 'react-router-dom'
import Confirm from '../../../../components/confirm'
import { useTranslation } from 'react-i18next'

function ChapterItem({ item, onEdit, onDelete }: any) {
  const { i18n } = useTranslation()
  const [expand, setExpand] = useState(false)
  const navigation = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const onConfirm = () => {
    setIsOpen(false)
    onDelete()
  }
  return (
    <Box
      sx={{
        mb: '2rem'
      }}
    >
      <Box className={styles.container}>
        <Box>
          <IconButton sx={{ mr: '1.88rem' }} onClick={onEdit}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => setIsOpen(true)}>
            <Delete />
          </IconButton>
        </Box>
        <Typography className={styles.title}>{item?.title?.[i18n.language]}</Typography>
        <IconButton onClick={() => setExpand(!expand)}>
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={expand} timeout='auto' unmountOnExit>
        <Typography
          //   className={classes.root}
          variant='body1'
          dangerouslySetInnerHTML={{
            __html: item?.description?.[i18n.language]
          }}
        ></Typography>
      </Collapse>
      <Confirm
        title='Are you sure delete this?'
        onCancel={() => setIsOpen(false)}
        onConfirm={onConfirm}
        isOpen={isOpen}
      />
    </Box>
  )
}

export default ChapterItem
