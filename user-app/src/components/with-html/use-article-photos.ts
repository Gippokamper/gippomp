import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPhoto } from '../../store/slices/htmlSlice'
import { wireArticleAnchors } from './prepare-html'

/**
 * Konteyner ichidagi havolalarni izoh/rasmga ulaydi va rasm bosilganda
 * modalni ochadi.
 *
 * Ilgari har bir <a> ga alohida `addEventListener` qo'shilardi va u hech
 * qachon olib tashlanmasdi — effect qayta ishlaganda (masalan shrift o'lchami
 * o'zgarganda) listener takror qo'shilib, rasm bir necha marta ochilardi.
 * Endi konteynerda bitta delegatsiyalangan listener bor.
 */
export function useArticlePhotos(ref: React.RefObject<HTMLElement>, html: string) {
  const dispatch = useDispatch()

  useEffect(() => {
    wireArticleAnchors(ref.current)
  }, [ref, html])

  useEffect(() => {
    const root = ref.current
    if (!root) {
      return
    }

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('[photo-url]')
      const url = target?.getAttribute('photo-url')
      if (url) {
        dispatch(setPhoto({ type: 'image', url }))
      }
    }

    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [ref, dispatch])
}
