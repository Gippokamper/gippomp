import React from 'react'
import PageLayout from '../../layouts/page'
import { images } from './data/data'
import Columns from './data/columns'
import { useSearchParams } from 'react-router-dom'
import { GET_IMAGES } from './queries'
import { BULK_DELETE_IMAGES } from './mutatuions'
import ImagesForm from './form'

function Images() {
  const columns = Columns()
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <PageLayout
      data={images}
      columns={columns}
      pageName='Images'
      //   onClick={row => {
      //     //@ts-ignore
      //     navigate({
      //       pathname: '/images-edit',
      //       search: createSearchParams({
      //         image_id: row.id
      //       }).toString()
      //     })
      //   }}
      collectionQuery={GET_IMAGES}
      deleteBulkMutation={BULK_DELETE_IMAGES}
      //@ts-ignore
      onAdd={() => {
        searchParams.delete('id')
        searchParams.delete('onAdd')
        setSearchParams(searchParams)
      }}
      rightContent={refetch => <ImagesForm refetch={refetch} />}
    />
  )
}

export default Images
