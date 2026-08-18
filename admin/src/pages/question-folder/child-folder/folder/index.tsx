import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import Columns from './data/colums'
import { BULK_DELETE_QUESTIONS } from './mutatuions'
import { GET_QUESTIONS } from './queries'
import PageLayout from '../../../../layouts/page'
import { useQuery } from 'react-query'
import { GET_IDS } from '../../queries'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import toast from 'react-hot-toast'

const Questions = () => {
  const column = Columns()
  const navigate = useNavigate()

  const { folder, parent } = useParams()
  const { data } = useQuery(['quiz-ids', folder, 'child'], () => GET_IDS(String(folder), { type: 'child' }), {
    enabled: !!folder
  })

  const questionIds: string = (data?.data?.questions_string || []).join(', ')

  const rightContent = () => (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
      <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 0.5 }}>
        {folder}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Papkadagi savollar ID lari
      </Typography>
      <TextField value={questionIds} fullWidth multiline rows={8} InputProps={{ readOnly: true }} />
      <Box sx={{ mt: 1.5 }}>
        <Button
          size='small'
          startIcon={<ContentCopyIcon />}
          disabled={!questionIds}
          onClick={() =>
            navigator.clipboard
              ?.writeText(questionIds)
              .then(() => toast.success('Nusxa olindi'))
              .catch(() => toast.error('Nusxa olib bo‘lmadi'))
          }
        >
          Nusxa olish
        </Button>
      </Box>
    </Paper>
  )

  return (
    <PageLayout
      columns={column}
      rightContent={rightContent}
      params={{ folder_slug: folder }}
      onClick={data =>
        navigate({
          pathname: `/question-folder/${parent}/${folder}/edit/`,
          search: createSearchParams({ question_id: String(data.id) }).toString()
        })
      }
      pageName='Questions'
      collectionQuery={GET_QUESTIONS}
      onAdd={() => navigate(`/question-folder/${parent}/${folder}/edit/`)}
      deleteBulkMutation={BULK_DELETE_QUESTIONS}
    />
  )
}

export default Questions
