import React from 'react'
import PageLayout from '../../layouts/page'
import Table from '../../components/Table'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { categoryArr } from './data/data'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_VIDEO_CATEGORIES } from './queries'
import { BULK_DELETE_VIDEO_CATEGORY } from './mutatuions'

function VideoCategory() {
  const navigate = useNavigate()
  const columns = Columns()
  return (
    <PageLayout
      buttons={[
        <Button onClick={() => navigate('/category-list')} variant='contained' key={'button'}>
          Category list
        </Button>
      ]}
      data={categoryArr}
      columns={columns}
      pageName='Video-Categories'
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_VIDEO_CATEGORIES}
      deleteBulkMutation={BULK_DELETE_VIDEO_CATEGORY}
    />
  )
}

export default VideoCategory
