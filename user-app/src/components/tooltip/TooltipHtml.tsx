import React from 'react'
import GetContainer from '../get-container'
import WithHtml from '../with-html'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

interface IProps {
  url: string
  isOpen: boolean
}

function TooltipHtml(props: IProps) {
  const { lang } = useSelector((state: RootState) => state.html)
  return (
    <GetContainer url={props.url}>
      {({ data }) => (
        <div
          className='tooltip-html'
          style={{
            // display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            display: props.isOpen ? 'flex' : 'none'
          }}
        >
          {data?.data?.title?.[lang] && <b>{data?.data?.title?.[lang]}</b>}

          <WithHtml html={data?.data?.description?.[lang]} />
        </div>
      )}
    </GetContainer>
  )
}

export default TooltipHtml
