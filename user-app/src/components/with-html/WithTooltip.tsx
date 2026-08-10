import React, { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Tooltip } from 'react-tooltip'
import TooltipHtml from '../tooltip/TooltipHtml'
import parse from 'html-react-parser'
import { articleModeClasses, prepareArticleHtml, ILockLabels } from './prepare-html'
import { useArticlePhotos } from './use-article-photos'
import '../../content.scss'

interface IProps {
  html: string
  isQuiz?: boolean
  openMarker?: boolean
  /**
   * `info` ruxsati yo'q foydalanuvchi uchun yorliqlar. Berilsa, qo'shimcha
   * ma'lumot bloklari taklif elementlariga almashadi va almashtirgich ularni
   * ocholmaydi.
   */
  lockLabels?: ILockLabels
  /** Taklif bosilganda — odatda tariflar sahifasiga o'tish. */
  onLockClick?: () => void
}

function WithTooltip(props: IProps) {
  const { fontSize, showMarker, showAddInfo } = useSelector((state: RootState) => state.html)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { lockLabels } = props
  const cleanHtml = useMemo(() => prepareArticleHtml(props?.html, { lockLabels }), [props?.html, lockLabels])

  useArticlePhotos(containerRef, cleanHtml)

  const modeClasses = articleModeClasses({
    isQuiz: props.isQuiz,
    openMarker: props.openMarker,
    showMarker,
    // Qulflanganda almashtirgich qo'shimcha ma'lumotni ochmasligi kerak:
    // bloklar allaqachon taklifga almashgan, `<u>` esa yashirin qolsin.
    showAddInfo: !lockLabels && showAddInfo
  })

  /*
   * Taklif tugmalari HTML sifatida joylashtirilgani uchun ularga to'g'ridan
   * to'g'ri React ishlov beruvchisini bog'lab bo'lmaydi — hodisa konteynerda
   * ushlanadi.
   */
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!props.onLockClick) {
      return
    }

    if ((event.target as HTMLElement)?.closest?.('[data-addinfo-lock]')) {
      props.onLockClick()
    }
  }

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
        onClick={handleClick}
      >
        {parse(cleanHtml)}
      </div>
    </>
  )
}

export default WithTooltip
