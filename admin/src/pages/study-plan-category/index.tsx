import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_STUDY_PLANS } from './queries'
import { BULK_DELETE_STUDY_PLAN } from './mutatuions'

// Diqqat: pageName Study-Plans dan farq qilishi shart — aks holda ikkala sahifa
// bitta cache kalitini bo'lishib, bir-birining ro'yxatini ko'rsatardi.
function StudyPlans() {
  const columns = Columns()
  return (
    <PageLayout
      columns={columns}
      params={{ without_content: true }}
      drawerComponent={<CategoryForm />}
      pageName='Study-Plan-Folders'
      collectionQuery={GET_STUDY_PLANS}
      deleteBulkMutation={BULK_DELETE_STUDY_PLAN}
    />
  )
}

export default StudyPlans
