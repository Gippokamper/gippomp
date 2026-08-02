import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/columns'
import TranslationsForm from './components/form'
import { GET_FAQS } from './queries'
import { BULK_DELETE_FAQ } from './mutatuions'
import { Faqs } from './data/data'

function FAQ() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='Faqs'
      collectionQuery={GET_FAQS}
      deleteBulkMutation={BULK_DELETE_FAQ}
      columns={columns}
      data={Faqs}
      drawerComponent={<TranslationsForm />}
    />
  )
}

export default FAQ
