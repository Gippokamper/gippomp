import { Grid, MenuItem } from '@mui/material'
import Table from '../../components/Table'
import PageLayout from '../../layouts/page'
import UserCard from './components/card'
import Columns from './data/columns'
import { users } from './data/data'
import { useNavigate } from 'react-router-dom'
import { GET_USERS, GET_USERS_INFO } from './queries'
import UserForm from './components/form/UserForm'
import { BULK_DELETE_USER } from './mutatuions'
import { useQuery } from 'react-query'

const Users = () => {
  const column = Columns()
  const { data } = useQuery(['user-statistiks'], GET_USERS_INFO)

  return (
    <PageLayout
      topComponent={
        // Qator wrap qilinmaydi, ya'ni toshib ketishi gorizontal bo'yicha.
        // overflowY:'scroll' esa doim ko'rinadigan vertikal scrollbar chizardi.
        <Grid container wrap='nowrap' gap={2} sx={{ pb: 2, overflowX: 'auto' }}>
          <Grid item xs={12} md={4}>
            <UserCard title='Количество пользователей' count={data?.data?.users_count} percent={100} />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserCard
              title='На тарифном плане'
              count={data?.data?.users_tariff}
              percent={(data?.data?.users_tariff / data?.data?.users_count) * 100}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserCard
              title='На бесплатной плане'
              count={data?.data?.users_free_trail}
              percent={(data?.data?.users_free_trail / data?.data?.users_count) * 100}
            />
          </Grid>
        </Grid>
      }
      columns={column}
      data={users}
      //   onClick={data => {
      //     //@ts-ignore
      //     navigate(`${data?.id}`)
      //   }}
      pageName='Users'
      drawerComponent={<UserForm />}
      collectionQuery={GET_USERS}
      deleteBulkMutation={BULK_DELETE_USER}
    />
  )
}

export default Users
