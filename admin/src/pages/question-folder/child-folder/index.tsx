import React from 'react'
import PageLayout from '../../../layouts/page'
import { GET_FOLDERS, GET_IDS } from '../queries'
import { BULK_DELETE_FOLDER } from '../mutatuions'
import { useParams } from 'react-router-dom'
import Columns from './data/colums'
import { categoryArr } from './data/data'
import { Box, TextField, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import CategoryForm from './components/form'

function ChildFolder() {
  const columns = Columns()
  const { parent } = useParams()
  const { data } = useQuery(['quiz-ids', parent, 'parent'], () => GET_IDS(String(parent), { type: 'parent' }))

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
          {parent}
        </Typography>
        <TextField value={data?.data?.questions_string?.join(', ')} fullWidth multiline rows={8} />
      </Box>
    )
  }
  return (
    <PageLayout
      data={categoryArr}
      pageName='Child-Folders'
      columns={columns}
      params={{
        slug: parent
      }}
      rightContent={RightContent}
      drawerComponent={<CategoryForm />}
      collectionQuery={GET_FOLDERS}
      deleteBulkMutation={BULK_DELETE_FOLDER}
    />
  )
}

export default ChildFolder
