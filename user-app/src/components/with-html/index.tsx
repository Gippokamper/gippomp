import React, { useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { articleModeClasses, prepareArticleHtml } from './prepare-html'
import { useArticlePhotos } from './use-article-photos'
import '../../content.scss'

interface IProps {
  html: string
  isQuiz?: boolean
  openMarker?: boolean
}

function WithHtml(props: IProps) {
  const { fontSize, showMarker, showAddInfo } = useSelector((state: RootState) => state.html)
  const containerRef = useRef<HTMLDivElement>(null)

  const cleanHtml = useMemo(() => prepareArticleHtml(props?.html, { spansToParagraphs: true }), [props?.html])

  useArticlePhotos(containerRef, cleanHtml)

  const modeClasses = articleModeClasses({
    isQuiz: props.isQuiz,
    openMarker: props.openMarker,
    showMarker,
    showAddInfo
  })

  return (
    <div
      ref={containerRef}
      className={`dangerous ${modeClasses}`}
      style={{
        fontSize: fontSize
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  )
}

export default WithHtml
