import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_STUDY_PLANS } from './queries'
import { BULK_DELETE_STUDY_PLAN } from './mutatuions'

function QuizzesCategory() {
  const columns = Columns()
  return (
    <PageLayout
      params={{ without_child: true }}
      columns={columns}
      drawerComponent={<CategoryForm />}
      pageName='Quizzes-Category'
      collectionQuery={GET_STUDY_PLANS}
      deleteBulkMutation={BULK_DELETE_STUDY_PLAN}
    />
  )
}

export default QuizzesCategory
