import React from 'react'
import PageLayout from '../../layouts/page'
import { translations } from './data/data'
import Columns from './data/columns'
import TranslationsForm from './components/form'
import { GET_VOCABULARIES } from './queries'
import { BULK_DELETE_VOCABULARY } from './mutatuions'

function Translations() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='Translations'
      collectionQuery={GET_VOCABULARIES}
      deleteBulkMutation={BULK_DELETE_VOCABULARY}
      columns={columns}
      data={translations}
      drawerComponent={<TranslationsForm />}
    />
  )
}

export default Translations
