import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/columns'
import { landingPhotos } from './data/data'
import PartnersForm from './components/form'
import { GET_PARTNERS } from './queries'
import { BULK_DELETE_PARTNER } from './mutatuions'

function Partners() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='Partners'
      collectionQuery={GET_PARTNERS}
      deleteBulkMutation={BULK_DELETE_PARTNER}
      columns={columns}
      data={landingPhotos}
      drawerComponent={<PartnersForm />}
    />
  )
}

export default Partners
