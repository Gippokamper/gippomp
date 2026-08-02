import React from 'react'
import styles from './index.module.scss'
import DescriptionIcon from '@mui/icons-material/Description'

function ArticleButton() {
  return (
    <div className={styles.container}>
      <DescriptionIcon />
      <span>Miya po’stlog’i, pardalari, bazal gangliylar va qorinchalar sitemasi</span>
    </div>
  )
}

export default ArticleButton
