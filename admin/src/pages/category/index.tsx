import React from 'react'
import PageLayout from '../../layouts/page'
import Table from '../../components/Table'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { categoryArr } from './data/data'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { BULK_DELETE_CATEGORY } from './mutatuions'
import { GET_CATEGORIES } from './queries'

function Category() {
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
      pageName='Categories'
      columns={columns}
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_CATEGORIES}
      deleteBulkMutation={BULK_DELETE_CATEGORY}
    />
  )
}

export default Category
