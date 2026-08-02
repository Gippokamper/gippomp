import React from 'react'
import PageLayout from '../../layouts/page'
import Columns from './data/columns'
import { GET_VIDEOS } from './queries'
import { BULK_DELETE_VIDEO } from './mutatuions'
import { landingPhotos } from './data/data'
import LandingVideosForm from './components/form'

function LandingVideos() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='LandingVideos'
      collectionQuery={GET_VIDEOS}
      deleteBulkMutation={BULK_DELETE_VIDEO}
      columns={columns}
      data={landingPhotos}
      drawerComponent={<LandingVideosForm />}
    />
  )
}

export default LandingVideos
