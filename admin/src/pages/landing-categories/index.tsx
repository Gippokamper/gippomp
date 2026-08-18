import React from 'react'
import PageLayout from '../../layouts/page'
import { translations } from './data/data'
import Columns from './data/columns'
import TranslationsForm from './components/form'
import { GET_CATEGORIES } from './queries'
import { BULK_DELETE_CATEGORY } from './mutatuions'

function LandingCategories() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='LandingCategories'
      collectionQuery={GET_CATEGORIES}
      deleteBulkMutation={BULK_DELETE_CATEGORY}
      columns={columns}
      data={translations}
      drawerComponent={<TranslationsForm />}
    />
  )
}

export default LandingCategories
