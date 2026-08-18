import React from 'react'
import PageLayout from '../../layouts/page'
import { comments } from './data/data'
import Columns from './data/columns'
import CommentsForm from './components/form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GET_COMMENTS } from './queries'
import { BULK_DELETE_COMMENTS } from './mutatuions'

function Comments() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const columns = Columns()
  return (
    <PageLayout
      data={comments}
      columns={columns}
      pageName='Notes'
      //   onClick={row => {
      //     //@ts-ignore
      //     navigate({
      //       pathname: '/comments-edit',
      //       search: createSearchParams({
      //         comment_id: row.id
      //       }).toString()
      //     })
      //   }}
      collectionQuery={GET_COMMENTS}
      deleteBulkMutation={BULK_DELETE_COMMENTS}
      rightContent={refetch => <CommentsForm refetch={refetch} />}
      //@ts-ignore
      onAdd={() => {
        searchParams.delete('id')
        searchParams.delete('onAdd')
        setSearchParams(searchParams)
      }}
    />
  )
}

export default Comments
