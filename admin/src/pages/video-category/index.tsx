import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_VIDEO_CATEGORIES } from './queries'
import { BULK_DELETE_VIDEO_CATEGORY } from './mutatuions'

function VideoCategory() {
  const columns = Columns()
  return (
    <PageLayout
      columns={columns}
      pageName='Video-Categories'
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_VIDEO_CATEGORIES}
      deleteBulkMutation={BULK_DELETE_VIDEO_CATEGORY}
    />
  )
}

export default VideoCategory
