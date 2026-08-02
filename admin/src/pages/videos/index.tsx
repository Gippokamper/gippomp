import React from 'react'
import PageLayout from '../../layouts/page'
import Table from '../../components/Table'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { categoryArr } from './data/data'
import Columns from './data/colums'
import CategoryForm from './components/form'
import { GET_VIDEOS } from './queries'
import { BULK_DELETE_VIDEOS } from './mutatuions'

function Videos() {
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
      columns={columns}
      pageName='Videos'
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_VIDEOS}
      deleteBulkMutation={BULK_DELETE_VIDEOS}
    />
  )
}

export default Videos
