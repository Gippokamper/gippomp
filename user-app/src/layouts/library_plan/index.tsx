import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-scroll'
import { useTranslation } from 'react-i18next'

import { RootState } from '../../store'
import { openChapter } from '../../store/slices/htmlSlice'
import './library-plan.scss'

/**
 * Maqola mundarijasi — kontent tepasida, gorizontal lenta.
 *
 * Ilgari chapdagi ustunda turardi va o'qish maydonini toraytirardi. Endi
 * yuqorida: bo'limlar yonma-yon, sig'masa yon tomonga suriladi.
 */
function LibraryPlan() {
  const { t } = useTranslation()

  // Mundarija maqola tilida bo'lishi kerak (tepadagi UZ/RU/EN tugmalari), sayt
  // interfeysi tilida emas. Ilgari bu yerda i18n.language ishlatilgani uchun
  // maqola tilini almashtirsangiz ro'yxat eski tilda qolib ketardi.
  const { chapters, lang } = useSelector((state: RootState) => state.html)
  const dispatch = useDispatch()

  if (!chapters?.length) return null

  return (
    <nav className='toc' aria-label={t('Contents')}>
      <ul className='toc__list'>
        {chapters.map(chapter => (
          <li key={chapter.id}>
            <Link
              to={chapter.id}
              spy={true}
              smooth={true}
              duration={500}
              // Sarlavha paneli sticky — offsetsiz bo'limga o'tilganda uning
              // sarlavhasi panel ostida qolardi.
              offset={-70}
              activeClass='is-active'
              className='toc__item'
              containerId='nestedRelativeContainerElement'
              onClick={() => dispatch(openChapter(chapter.id))}
            >
              {chapter?.title?.[lang]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LibraryPlan
