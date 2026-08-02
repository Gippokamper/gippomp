import { Box } from '@mui/material'
import React from 'react'
import styles from './index.module.scss'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import CategoryButton from '../../components/category-button'
import ArticleButton from '../../components/article-button'
import MainLayout from '../../layouts/main'

function CategoryList() {
  return (
    <>
      <Box>
        <p className={styles.title}>Videolar</p>
        <Box>
          <CategoryButton icon={<FolderOpenIcon />} text='Anatomiya' />
        </Box>
        <p style={{ marginTop: '2rem' }} className={styles.title}>
          Anatomiya
        </p>
        <Box>
          {/* <CategoryButton icon={<FolderOpenIcon />} text='Anatomiya' /> */}
          <ArticleButton />
        </Box>
      </Box>
    </>
  )
}

export default CategoryList
