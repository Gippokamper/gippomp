import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_VIDEOS } from './queries'
import { BULK_DELETE_VIDEOS } from './mutatuions'

function Videos() {
  const columns = Columns()
  return (
    <PageLayout
      columns={columns}
      pageName='Videos'
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_VIDEOS}
      deleteBulkMutation={BULK_DELETE_VIDEOS}
    />
  )
}

export default Videos
