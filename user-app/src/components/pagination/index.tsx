import React, { useState } from 'react'
import ReactPaginate from 'react-paginate'
import styles from './index.module.scss'

// Example items, to simulate fetching from another resources.
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

function Items({ currentItems }: { currentItems: any[] }) {
  return (
    <>
      {currentItems &&
        currentItems.map(item => (
          <div>
            <h3>Item #{item}</h3>
          </div>
        ))}
    </>
  )
}

function PaginatedItems({
  itemsPerPage,
  total,
  setPageNumber
}: {
  itemsPerPage: number
  total: number
  setPageNumber: React.Dispatch<React.SetStateAction<number>>
}) {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0)

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage
  console.log(`Loading items from ${itemOffset} to ${endOffset}`)
  const currentItems = items.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(total / itemsPerPage)

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    setPageNumber(event.selected + 1)
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`)
    setItemOffset(newOffset)
  }

  return (
    <ReactPaginate
      breakLabel='...'
      nextLabel={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5L16 12L9 19" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      }
      onPageChange={handlePageClick}
      containerClassName={styles.container}
      pageLinkClassName={'pagination_page_a'}
      pageClassName={'pagination_page'}
      activeClassName={'pagination_active'}
      activeLinkClassName={'pagination_active'}
      previousClassName={'pagination_previous'}
      nextClassName={'pagination_next'}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      previousLabel={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      }
      renderOnZeroPageCount={null}
    />
  )
}

// Add a <div id="container"> to your HTML to see the component rendered.

export default PaginatedItems
