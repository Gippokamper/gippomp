// ** React Imports
import { createContext, useState, ReactNode, SetStateAction, Dispatch } from 'react'

// ** Types
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table'

// ** Defaults

export interface TableFilterType {
  columnFilters: MRT_ColumnFiltersState
  globalFilter: string
  sorting: MRT_SortingState
  pagination: MRT_PaginationState
  rowCount: number
  value: string
  setValue: Dispatch<SetStateAction<string>>
  setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>
  setGlobalFilter: Dispatch<SetStateAction<string>>
  setSorting: Dispatch<SetStateAction<MRT_SortingState>>
  setPagination: Dispatch<SetStateAction<MRT_PaginationState>>
  setRowCount: Dispatch<SetStateAction<number>>
}

const defaultProvider = {
  columnFilters: [],
  globalFilter: '',
  sorting: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10
  },
  rowCount: 1,
  value: '',
  setValue: () => '',

  setColumnFilters: () => [],
  setGlobalFilter: () => '',
  setSorting: () => [],
  setPagination: () => {
    return {
      pageIndex: 0,
      pageSize: 10
    }
  },
  setRowCount: () => 1
}
const TableFilterContext = createContext<TableFilterType>(defaultProvider)

type Props = {
  children: ReactNode
}

const TableFilterProvider = ({ children }: Props) => {
  // ** States
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [rowCount, setRowCount] = useState(1)
  const [value, setValue] = useState('')

  // ** Hooks
  // const router = useRouter()

  const values = {
    columnFilters,
    globalFilter,
    sorting,
    pagination,
    rowCount,
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setPagination,
    setRowCount,
    value,
    setValue
  }
  //@ts-ignore

  return <TableFilterContext.Provider value={values}>{children}</TableFilterContext.Provider>
}

export { TableFilterContext, TableFilterProvider }
