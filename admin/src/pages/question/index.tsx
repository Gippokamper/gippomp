import { createSearchParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/page'
import Columns from './data/colums'
import { BULK_DELETE_QUESTIONS } from './mutatuions'
import { GET_QUESTIONS } from './queries'
import { questions } from './data/data'

const Questions = () => {
  const column = Columns()
  const navigate = useNavigate()

  return (
    <PageLayout
      columns={column}
      data={questions}
      onClick={data => {
        //@ts-ignore
        navigate({
          pathname: '/questions-create',
          search: createSearchParams({
            question_id: data.id
          }).toString()
        })
      }}
      pageName='Questions'
      collectionQuery={GET_QUESTIONS}
      onAdd={() => navigate('/questions-create')}
      deleteBulkMutation={BULK_DELETE_QUESTIONS}
    />
  )
}

export default Questions
