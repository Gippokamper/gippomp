import React from 'react'
import PageLayout from '../../layouts/page'
import { tariffs } from './data/data'
import Columns from './data/columns'
import TariffsForm from './components/form'
import { GET_TARIFFS } from './queries'
import { BULK_DELETE_TARIFF } from './mutatuions'

function Tariffs() {
  const columns = Columns()
  return (
    <PageLayout
      pageName='Tariffs'
      data={tariffs}
      columns={columns}
      drawerComponent={<TariffsForm />}
      collectionQuery={GET_TARIFFS}
      deleteBulkMutation={BULK_DELETE_TARIFF}
    />
  )
}

export default Tariffs
