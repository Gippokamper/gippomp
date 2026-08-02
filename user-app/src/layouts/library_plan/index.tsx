import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import React from 'react'
import { Link } from 'react-scroll'
import { openChapter } from '../../store/slices/htmlSlice'
import { useTranslation } from 'react-i18next'

interface IProps {
  isHide: boolean
}

function LibraryPlan(props: IProps) {
  const { t } = useTranslation()
  // Mundarija maqola tilida bo'lishi kerak (tepadagi UZ/RU/EN tugmalari), sayt
  // interfeysi tilida emas. Ilgari bu yerda i18n.language ishlatilgani uchun
  // maqola tilini almashtirsangiz chapdagi ro'yxat eski tilda qolib ketardi.
  const { chapters, lang } = useSelector((state: RootState) => state.html)
  const dispatch = useDispatch()
  const handleSetActive = (to: number) => {
    dispatch(openChapter(to))
  }
  //   useEffect(() => {
  //     Events.scrollEvent.register('begin', (to, element) => {})

  //     Events.scrollEvent.register('end', (to, element) => {})

  //     scrollSpy.update()

  //     return () => {
  //       Events.scrollEvent.remove('begin')
  //       Events.scrollEvent.remove('end')
  //     }
  //   }, [])

  return (
    <div
      style={{
        overflow: 'hidden',
        width: !props.isHide ? '100%' : 0,
        transition: 'all 0.5s ease-in-out'
      }}
    >
      <div
        className={`side-plan`}
        style={{
          height: '100%'
        }}
      >
        <div className='side-plan__title'>{t('Contents')}</div>
        <ul className='side-plan__list'>
          {chapters?.map((chapter, i) => (
            <li
              // className={`side-plan__item ${beginId === chapter?.id && chapter.isOpen ? 'active' : ''}`}
              key={chapter.id}
            >
              <Link
                to={chapter.id}
                spy={true}
                smooth={true}
                duration={500}
                // Sarlavha paneli (.library-head) endi sticky — offsetsiz
                // bo'limga o'tilganda uning sarlavhasi panel ostida qolardi.
                offset={-70}
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

export default LibraryPlan
