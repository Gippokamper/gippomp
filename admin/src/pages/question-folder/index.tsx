import React from 'react'
import PageLayout from '../../layouts/page'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { categoryArr } from './data/data'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_FOLDERS } from './queries'
import { BULK_DELETE_FOLDER } from './mutatuions'

function QuestionFolder() {
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
      pageName='Folders'
      columns={columns}
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_FOLDERS}
      deleteBulkMutation={BULK_DELETE_FOLDER}
    />
  )
}

export default QuestionFolder
