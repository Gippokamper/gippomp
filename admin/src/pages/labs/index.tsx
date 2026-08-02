import { createSearchParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/page'
import Columns from './data/columns'
import { news } from './data/data'
import { BULK_DELETE_LABS } from './mutatuions'
import { GET_LABS } from './queries'

const Labs = () => {
  const column = Columns()
  const navigate = useNavigate()

  return (
    <PageLayout
      columns={column}
      data={news}
      onClick={data => {
        //@ts-ignore
        navigate({
          pathname: '/labs-create',
          search: createSearchParams({
            labs_id: data.id
          }).toString()
        })
      }}
      pageName='Labs'
      collectionQuery={GET_LABS}
      onAdd={() => navigate('/labs-create')}
      deleteBulkMutation={BULK_DELETE_LABS}
    />
  )
}

export default Labs
