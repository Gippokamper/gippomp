import React from 'react'
import PageLayout from '../../layouts/page'
import Table from '../../components/Table'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { categoryArr } from './data/data'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_STUDY_PLANS } from './queries'
import { BULK_DELETE_STUDY_PLAN } from './mutatuions'

function QuizzesCategory() {
  const navigate = useNavigate()
  const columns = Columns()
  return (
    <PageLayout
      buttons={[
        <Button onClick={() => navigate('/category-list')} variant='contained' key={'button'}>
          Category list
        </Button>
      ]}
      params={{
        without_child: true
      }}
      data={categoryArr}
      columns={columns}
      drawerComponent={<CategoryForm />}
      pageName='Quizzes-category'
      collectionQuery={GET_STUDY_PLANS}
      deleteBulkMutation={BULK_DELETE_STUDY_PLAN}
    />
  )
}

export default QuizzesCategory
