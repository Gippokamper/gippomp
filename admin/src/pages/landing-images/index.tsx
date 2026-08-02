import React from 'react'
import PageLayout from '../../layouts/page'
import LandingImagesForm from './components/form'
import Columns from './data/columns'
import { GET_IMAGES } from './queries'
import { BULK_DELETE_IMAGE } from './mutatuions'
import { landingPhotos } from './data/data'

function LandingImages() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='LandingImages'
      collectionQuery={GET_IMAGES}
      deleteBulkMutation={BULK_DELETE_IMAGE}
      columns={columns}
      data={landingPhotos}
      drawerComponent={<LandingImagesForm />}
    />
  )
}

export default LandingImages
