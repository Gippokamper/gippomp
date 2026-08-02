import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import Columns from './data/colums'
import { BULK_DELETE_QUESTIONS } from './mutatuions'
import { GET_QUESTIONS } from './queries'
import PageLayout from '../../../../layouts/page'
import { questions } from './data/data'
import { useQuery } from 'react-query'
import { GET_IDS } from '../../queries'
import { Box, TextField, Typography } from '@mui/material'

const Questions = () => {
  const column = Columns()
  const navigate = useNavigate()

  const { folder, parent } = useParams()
  const { data } = useQuery(['quiz-ids', folder, 'child'], () => GET_IDS(String(folder), { type: 'child' }))

  const RightContent = () => {
    return (
      <Box
        sx={{
          bgcolor: '#fff',
          flex: 1,
          width: '45rem',
          p: '1.88rem',
          height: '45rem'
        }}
      >
        <Typography
          sx={{
            mb: '1.88rem'
          }}
          typography={'h3'}
        >
          {folder}
        </Typography>
        <TextField value={data?.data?.questions_string?.join(', ')} fullWidth multiline rows={8} />
      </Box>
    )
  }

  return (
    <PageLayout
      columns={column}
      data={questions}
      rightContent={RightContent}
      params={{ folder_slug: folder }}
      onClick={data => {
        //@ts-ignore
        navigate({
          pathname: `/question-folder/${parent}/${folder}/edit/`,
          search: createSearchParams({
            question_id: data.id
          }).toString()
        })
      }}
      pageName='Questions'
      collectionQuery={GET_QUESTIONS}
      onAdd={() => navigate(`/question-folder/${parent}/${folder}/edit/`)}
      deleteBulkMutation={BULK_DELETE_QUESTIONS}
    />
  )
}

export default Questions
