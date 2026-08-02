import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAddInfo, toggleAllChapter, toggleShowMarker } from '../../store/slices/htmlSlice'
import { useTranslation } from 'react-i18next'
import LibrarySetting from '../../components/library-setting'
import { RootState } from '../../store'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { request } from '../../helpers/request'

function LibraryFooter() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { showAddInfo, chapters, showMarker } = useSelector((state: RootState) => state.html)
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const { data } = useQuery(['articl(e', id], async () => {
    const response = await request({
      url: 'dashboard/user/articles/' + id,
      method: 'GET'
    })
    return response.data
  })
  console.log(data, 'data')
  return (
    <footer
      className='footer footer-library'
      style={{
        zIndex: 100
      }}
    >
      <ul className='footer-menu'>
        <li>
          <a
            className={showAddInfo ? 'current' : ''}
            onClick={() => {
              if (showAddInfo && showMarker) {
                dispatch(toggleAddInfo())
                dispatch(toggleShowMarker())
              } else {
                dispatch(toggleAddInfo())
              }
            }}
          >
            <svg width={25} height={24} viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12.5 21V21C7.529 21 3.5 16.971 3.5 12V12C3.5 7.029 7.529 3 12.5 3V3C17.471 3 21.5 7.029 21.5 12V12C21.5 16.971 17.471 21 12.5 21Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12.4974 8.29297V14.7096'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M15.7057 11.5013H9.28906'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Information')}</span>
          </a>
        </li>
        <li>
          <a
            href={
              !!data?.data?.blocks?.length ? `/detail/article/${data?.data?.slug}/${data?.data?.blocks?.[0]?.id}` : ''
            }
            className={!data?.data?.blocks?.length ? 'disabled' : ''}
          >
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M17 8.5V10.5'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.6689 9.66797V12.423C14.6689 12.751 14.5129 13.057 14.2429 13.244C13.7909 13.556 13.0059 13.968 12.0079 13.968C11.0099 13.968 10.2199 13.555 9.76494 13.244C9.49294 13.058 9.33594 12.751 9.33594 12.421V9.66797'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M18.429 17H5.571C4.151 17 3 15.849 3 14.429V5.571C3 4.151 4.151 3 5.571 3H18.428C19.849 3 21 4.151 21 5.571V14.428C21 15.849 19.849 17 18.429 17Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14 17L14.5 21'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M10 17L9.5 21'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M8.14062 21H15.8606'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7 8.5L12 11L17 8.5L12 6L7 8.5Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Qbank')}</span>
          </a>
        </li>
        <li
          style={{
            width: '4rem'
          }}
        >
          <a
            onClick={() =>
              dispatch(chapters?.some(el => !el.isOpen) ? toggleAllChapter(true) : toggleAllChapter(false))
            }
            className={chapters?.some(el => !el.isOpen) ? '' : 'current'}
          >
            {chapters?.some(el => !el.isOpen) ? (
              <svg width={20} height={20} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.99479 3.33203V16.6654'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M6.66406 6.66536L9.99823 3.33203L13.3324 6.66536'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.3324 13.332L9.99823 16.6662L6.66406 13.332'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='18' viewBox='0 0 16 18' fill='none'>
                <path
                  d='M1.33333 8.16663C1.11232 8.16663 0.900358 8.25442 0.744078 8.4107C0.587797 8.56698 0.5 8.77894 0.5 8.99996C0.5 9.22097 0.587797 9.43293 0.744078 9.58921C0.900358 9.74549 1.11232 9.83329 1.33333 9.83329H2.16667C2.38768 9.83329 2.59964 9.74549 2.75592 9.58921C2.9122 9.43293 3 9.22097 3 8.99996C3 8.77894 2.9122 8.56698 2.75592 8.4107C2.59964 8.25442 2.38768 8.16663 2.16667 8.16663H1.33333ZM5.5 8.16663C5.27899 8.16663 5.06702 8.25442 4.91074 8.4107C4.75446 8.56698 4.66667 8.77894 4.66667 8.99996C4.66667 9.22097 4.75446 9.43293 4.91074 9.58921C5.06702 9.74549 5.27899 9.83329 5.5 9.83329H6.33333C6.55435 9.83329 6.76631 9.74549 6.92259 9.58921C7.07887 9.43293 7.16667 9.22097 7.16667 8.99996C7.16667 8.77894 7.07887 8.56698 6.92259 8.4107C6.76631 8.25442 6.55435 8.16663 6.33333 8.16663H5.5ZM8.83333 8.99996C8.83333 8.77894 8.92113 8.56698 9.07741 8.4107C9.23369 8.25442 9.44565 8.16663 9.66667 8.16663H10.5C10.721 8.16663 10.933 8.25442 11.0893 8.4107C11.2455 8.56698 11.3333 8.77894 11.3333 8.99996C11.3333 9.22097 11.2455 9.43293 11.0893 9.58921C10.933 9.74549 10.721 9.83329 10.5 9.83329H9.66667C9.44565 9.83329 9.23369 9.74549 9.07741 9.58921C8.92113 9.43293 8.83333 9.22097 8.83333 8.99996ZM13.8333 8.16663C13.6123 8.16663 13.4004 8.25442 13.2441 8.4107C13.0878 8.56698 13 8.77894 13 8.99996C13 9.22097 13.0878 9.43293 13.2441 9.58921C13.4004 9.74549 13.6123 9.83329 13.8333 9.83329H14.6667C14.8877 9.83329 15.0996 9.74549 15.2559 9.58921C15.4122 9.43293 15.5 9.22097 15.5 8.99996C15.5 8.77894 15.4122 8.56698 15.2559 8.4107C15.0996 8.25442 14.8877 8.16663 14.6667 8.16663H13.8333ZM7.16667 4.34496L6.2325 3.41079C6.07533 3.25899 5.86483 3.175 5.64633 3.1769C5.42783 3.1788 5.21882 3.26644 5.06432 3.42094C4.90981 3.57545 4.82217 3.78446 4.82027 4.00296C4.81837 4.22146 4.90237 4.43196 5.05417 4.58913L7.41083 6.94663C7.56711 7.10285 7.77903 7.19061 8 7.19061C8.22097 7.19061 8.43289 7.10285 8.58917 6.94663L10.9467 4.58913C11.1029 4.43276 11.1907 4.22072 11.1906 3.99966C11.1905 3.77861 11.1026 3.56663 10.9462 3.41038C10.7899 3.25412 10.5778 3.16638 10.3568 3.16646C10.1357 3.16654 9.92376 3.25443 9.7675 3.41079L8.83333 4.34496V1.49996C8.83333 1.27895 8.74554 1.06698 8.58926 0.910704C8.43297 0.754423 8.22101 0.666626 8 0.666626C7.77899 0.666626 7.56702 0.754423 7.41074 0.910704C7.25446 1.06698 7.16667 1.27895 7.16667 1.49996V4.34496ZM8 17.3333C7.77899 17.3333 7.56702 17.2455 7.41074 17.0892C7.25446 16.9329 7.16667 16.721 7.16667 16.5V13.655L6.2325 14.5891C6.07533 14.7409 5.86483 14.8249 5.64633 14.823C5.42783 14.8211 5.21882 14.7335 5.06432 14.579C4.90981 14.4245 4.82217 14.2155 4.82027 13.997C4.81837 13.7785 4.90237 13.568 5.05417 13.4108L7.41083 11.0533C7.56711 10.8971 7.77903 10.8093 8 10.8093C8.22097 10.8093 8.43289 10.8971 8.58917 11.0533L10.9467 13.4108C11.1029 13.5672 11.1907 13.7792 11.1906 14.0003C11.1905 14.2213 11.1026 14.4333 10.9462 14.5895C10.7899 14.7458 10.5778 14.8335 10.3568 14.8335C10.1357 14.8334 9.92376 14.7455 9.7675 14.5891L8.83333 13.655V16.5C8.83333 16.721 8.74554 16.9329 8.58926 17.0892C8.43297 17.2455 8.22101 17.3333 8 17.3333Z'
                  fill='currentColor'
                />
              </svg>
            )}
            <span>{chapters?.some(el => !el.isOpen) ? t('Opening') : t('Shut down')}</span>
          </a>
        </li>
        <li>
          <a onClick={() => setOpen(true)}>
            <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M20 8V5C20 3.89543 19.1046 3 18 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H10'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path d='M7 8H12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M7 12H10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M7 16H8' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15 15.9998L14.4146 15.4143C14.1493 15.149 13.7895 15 13.4144 15C13.0393 15 12.6795 15.149 12.4143 15.4143V15.4143C11.9376 15.891 11.8636 16.6379 12.2375 17.1989L14.1775 20.1093C14.5485 20.6658 15.173 21 15.8418 21H19.6379C20.6465 21 21.4974 20.2489 21.6224 19.248L21.9844 16.3512C22.1178 15.284 21.3832 14.3024 20.3218 14.1293L18 13.7507V11.5C18 10.6716 17.3284 10 16.5 10V10C15.6716 10 15 10.6716 15 11.5V15.9998Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{t('Functions')}</span>
          </a>
        </li>
      </ul>
      <LibrarySetting isVisible={open} hide={() => setOpen(false)} />
    </footer>
  )
}

export default LibraryFooter
