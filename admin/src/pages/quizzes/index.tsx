import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_STUDY_PLANS } from './queries'
import { BULK_DELETE_STUDY_PLAN } from './mutatuions'

function Quizzes() {
  const columns = Columns()
  return (
    <PageLayout
      columns={columns}
      drawerComponent={<CategoryForm />}
      params={{ with_content: 1 }}
      pageName='Quizzes'
      collectionQuery={GET_STUDY_PLANS}
      deleteBulkMutation={BULK_DELETE_STUDY_PLAN}
    />
  )
}

export default Quizzes
