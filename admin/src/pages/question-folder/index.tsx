import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_FOLDERS } from './queries'
import { BULK_DELETE_FOLDER } from './mutatuions'

function QuestionFolder() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='Folders'
      columns={columns}
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_FOLDERS}
      deleteBulkMutation={BULK_DELETE_FOLDER}
    />
  )
}

export default QuestionFolder
