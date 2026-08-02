import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { openChapter } from '../../store/slices/htmlSlice'
import scroll from 'react-scroll'
import { useTranslation } from 'react-i18next'
const { Link } = scroll
interface IProps {
  isVisible: boolean
  hide: () => void
}

function LibraryMobilePlan(props: IProps) {
  const { t } = useTranslation()
  // Mundarija maqola tilida (tepadagi UZ/RU/EN), sayt interfeysi tilida emas.
  const { chapters, lang } = useSelector((state: RootState) => state.html)
  const dispatch = useDispatch()
  const handleSetActive = (to: number) => {
    dispatch(openChapter(to))
  }
  return (
    <div
      className='library-mobile__plan'
      style={{
        display: props.isVisible ? 'block' : 'none'
      }}
      onClick={e => {
        e.stopPropagation()
        props.hide()
      }}
    >
      <div className='side-plan'>
        <div className='side-plan__title'>{t('Contents')}</div>
        <ul className='side-plan__list'>
          {chapters?.map((chapter, i) => (
            <li key={chapter.id + String(chapter.isOpen)}>
              <Link
                to={chapter.id}
                spy={true}
                smooth={true}
                duration={500}
                activeClass='active'
                className='side-plan__item'
                containerId='nestedRelativeContainerElement'
                style={{
                  display: 'block'
                }}
                onClick={() => handleSetActive(chapter.id)}
                //   className='side-plan__item'
              >
                {chapter?.title?.[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LibraryMobilePlan
