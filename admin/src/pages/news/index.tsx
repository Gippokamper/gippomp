import { createSearchParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/page'
import Columns from './data/columns'
import { news } from './data/data'
import { BULK_DELETE_NEWS } from './mutatuions'
import { GET_NEWS } from './queries'

const News = () => {
  const column = Columns()
  const navigate = useNavigate()

  return (
    <PageLayout
      columns={column}
      data={news}
      onClick={data => {
        //@ts-ignore
        navigate({
          pathname: '/news-create',
          search: createSearchParams({
            news_id: data.id
          }).toString()
        })
      }}
      pageName='News'
      collectionQuery={GET_NEWS}
      onAdd={() => navigate('/news-create')}
      deleteBulkMutation={BULK_DELETE_NEWS}
    />
  )
}

export default News
