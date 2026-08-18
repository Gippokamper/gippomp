import { Grid } from '@mui/material'
import PageLayout from '../../layouts/page'
import UserCard from './components/card'
import Columns from './data/columns'
import { GET_USERS, GET_USERS_INFO } from './queries'
import UserForm from './components/form/UserForm'
import { useQuery } from 'react-query'

const percentOf = (part?: number, total?: number) => (total ? (Number(part || 0) / Number(total)) * 100 : 0)

const Users = () => {
  const column = Columns()
  const { data } = useQuery(['user-statistics'], GET_USERS_INFO)
  const stats = data?.data

  return (
    <PageLayout
      topComponent={
        <Grid container spacing={2} sx={{ pb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <UserCard title='Foydalanuvchilar soni' count={stats?.users_count} percent={100} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <UserCard
              title='Tarif rejasida'
              count={stats?.users_tariff}
              percent={percentOf(stats?.users_tariff, stats?.users_count)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <UserCard
              title='Bepul sinov muddatida'
              count={stats?.users_free_trail}
              percent={percentOf(stats?.users_free_trail, stats?.users_count)}
            />
          </Grid>
        </Grid>
      }
      columns={column}
      pageName='Users'
      drawerComponent={<UserForm />}
      collectionQuery={GET_USERS}
      // Backend'da foydalanuvchi yaratish va bulk_delete yo'q (faqat index/show/update).
      // Ilgari "Add" va "Delete" tugmalari mavjud bo'lmagan endpoint'ga so'rov
      // yuborib, tushunarsiz xato qaytarardi.
      disableAdd
      disableDelete
    />
  )
}

export default Users
