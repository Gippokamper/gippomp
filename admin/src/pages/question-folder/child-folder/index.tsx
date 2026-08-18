import PageLayout from '../../../layouts/page'
import { GET_FOLDERS, GET_IDS } from '../queries'
import { BULK_DELETE_FOLDER } from '../mutatuions'
import { useParams } from 'react-router-dom'
import Columns from './data/colums'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useQuery } from 'react-query'
import CategoryForm from './components/form'
import toast from 'react-hot-toast'

function ChildFolder() {
  const columns = Columns()
  const { parent } = useParams()
  const { data } = useQuery(['quiz-ids', parent, 'parent'], () => GET_IDS(String(parent), { type: 'parent' }), {
    enabled: !!parent
  })

  const questionIds: string = (data?.data?.questions_string || []).join(', ')

  // Ilgari bu komponent render funksiyasi ichida e'lon qilingandi — har render'da
  // yangi komponent sifatida qayta yaratilib, fokus/holat yo'qolardi.
  const rightContent = () => (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(18,27,45,.08)' }}>
      <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 0.5 }}>
        {parent}
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Ichki papkalardagi savollar ID lari
      </Typography>
      <TextField
        value={questionIds}
        fullWidth
        multiline
        rows={8}
        // Faqat ko'rish uchun: ilgari onChange'siz qiymat berilgani uchun React
        // "controlled input" ogohlantirishini berardi.
        InputProps={{ readOnly: true }}
      />
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
      pageName='Child-Folders'
      columns={columns}
      params={{ slug: parent }}
      rightContent={rightContent}
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_FOLDERS}
      deleteBulkMutation={BULK_DELETE_FOLDER}
    />
  )
}

export default ChildFolder
