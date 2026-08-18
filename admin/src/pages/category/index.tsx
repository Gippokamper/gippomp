import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { BULK_DELETE_CATEGORY } from './mutatuions'
import { GET_CATEGORIES } from './queries'

function Category() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='Categories'
      columns={columns}
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_CATEGORIES}
      deleteBulkMutation={BULK_DELETE_CATEGORY}
    />
  )
}

export default Category
