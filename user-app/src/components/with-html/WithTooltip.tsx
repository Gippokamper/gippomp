import React, { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Tooltip } from 'react-tooltip'
import TooltipHtml from '../tooltip/TooltipHtml'
import parse from 'html-react-parser'
import { articleModeClasses, prepareArticleHtml } from './prepare-html'
import { useArticlePhotos } from './use-article-photos'
import '../../content.scss'

interface IProps {
  html: string
  isQuiz?: boolean
  openMarker?: boolean
}

function WithTooltip(props: IProps) {
  const { fontSize, showMarker, showAddInfo } = useSelector((state: RootState) => state.html)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const cleanHtml = useMemo(() => prepareArticleHtml(props?.html), [props?.html])

  useArticlePhotos(containerRef, cleanHtml)

  const modeClasses = articleModeClasses({
    isQuiz: props.isQuiz,
    openMarker: props.openMarker,
    showMarker,
    showAddInfo
  })

  return (
    <>
      <Tooltip
        id='my-tooltip'
        clickable
        offset={0}
        afterHide={() => setIsOpen(false)}
        afterShow={() => setTimeout(() => setIsOpen(true), 500)}
        className={!isOpen ? 'fade-out' : 'fade-in'}
        style={{
          display: isOpen ? 'block' : 'none',
          zIndex: 100
        }}
        render={({ activeAnchor }) => (
          <TooltipHtml isOpen={isOpen} url={activeAnchor?.getAttribute('data-some-relevant-attr') as string} />
        )}
      />
      <div
        ref={containerRef}
        className={`dangerous mce-content-body ${modeClasses}`}
        style={{
          fontSize: fontSize
        }}
      >
        {parse(cleanHtml)}
      </div>
    </>
  )
}

export default WithTooltip
