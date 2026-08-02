import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import { article } from './data/data'
import ArticleForm from './components/form'
import { GET_ARTICLES } from './queries'
import { BULK_DELETE_ARTICLES } from './mutatuions'

function Articles() {
  const column = Columns()
  return (
    <PageLayout
      data={[article]}
      columns={column}
      pageName='Articles'
      drawerComponent={<ArticleForm />}
      collectionQuery={GET_ARTICLES}
      deleteBulkMutation={BULK_DELETE_ARTICLES}
    />
  )
}

export default Articles
