import React, { useEffect, useMemo, useRef, useState } from 'react'
import minus from '../../img/icons/minus.svg'
import close from '../../img/icons/close.svg'
import plus from '../../img/icons/plus.svg'
import fullscreen from '../../img/icons/fullscreen.svg'
import edit from '../../img/icons/edit.svg'
import GetContainer from '../get-container'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setClosePhoto } from '../../store/slices/htmlSlice'

import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import { MEDIA_URL } from '../../helpers/request'
import WithHtml from '../with-html'
import { Tooltip } from 'react-tooltip'
import { useSearchParams } from 'react-router-dom'
import { setOpenImage } from '../../store/quizSlice/quizSlice'
import { useTranslation } from 'react-i18next'
import Lottie from 'lottie-react'
import loaderData from '../../data/Gippoloading.json'
import CloseIcon from '../../img/icons/CloseIcon'
import MinusIcon from '../../img/icons/MinusIcon'
import PlusIcon from '../../img/icons/PlusIcon'
import FullScreenIcon from '../../img/icons/FullScreenIcon'

function ImageModal() {
  const { i18n, t } = useTranslation()
  const { photo, lang } = useSelector((state: RootState) => state.html)
  const dispatch = useDispatch()
  const [commentOpen, setCommentOpen] = useState(false)
  const [searchParams] = useSearchParams({})
  const [isMarker, setIsMarker] = useState(false)
  const { data } = useSelector((state: RootState) => state.quiz)
  const quiz = useMemo(() => {
    const quiz_id = searchParams.has('quiz_id') ? Number(searchParams.get('quiz_id')) : data?.[0]?.question?.id
    return data?.find((x: any) => x?.question?.id === quiz_id)
  }, [data, searchParams])
  const [showLoader, setSHowLoader] = useState(false)

  useEffect(() => {
    if (!!photo) {
      setTimeout(() => {
        setSHowLoader(true)
      }, 1000)
    }
  }, [photo])

  const Controls = ({ data }: any) => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
      <>
        <div
          className='library-gallery__close'
          style={{ position: 'absolute', left: '1rem', top: '1rem', zIndex: 1100, margin: 0 }}
          onClick={() => {
            resetTransform()
            setIsMarker(false)
            setSHowLoader(false)
            dispatch(setClosePhoto())
            if (photo?.type === 'quiz') {
              dispatch(setOpenImage({ id: Number(quiz?.id) }))
            }
          }}
        >
          <img src={close} alt='ico' />
        </div>
        <div className='library-gallery__btns'>
          {data?.marker_photo && (
            <button
              id={photo?.type === 'quiz' && data?.marker_photo ? 'help' : ''}
              className={`library-gallery__edit ${isMarker ? 'active' : ''}`}
              onClick={() => setIsMarker(!isMarker)}
            >
              <img src={edit} alt='ico' />
            </button>
          )}
          <div
            className='library-gallery__zoom'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => zoomOut()}
            >
              <img src={minus} alt='ico' />
            </button>
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => zoomIn()}
            >
              <img src={plus} alt='ico' />
            </button>
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => resetTransform()}
            >
              <img src={fullscreen} alt='ico' />
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <GetContainer url={photo?.url || ''}>
      {({ data, isLoading }) => (
        <div className='library-gallery' style={{ display: photo ? 'flex' : 'none', maxHeight: '100vh' }}>
          <div className='library-gallery__content'>
            <TransformWrapper
              minScale={0.2}
              centerOnInit
              centerZoomedOut
              //   initialScale={photo?.isVideo && data?.data?.link ? 1 : 0.3}
            >
              <TransformComponent wrapperClass='library-gallery__main'>
                {/* <div className='library-gallery__main'> */}
                {isLoading && (
                  <div
                    style={{
                      width: '30%',
                      display: showLoader ? 'block' : 'none'
                    }}
                  >
                    <Lottie width={150} height={150} animationData={loaderData} loop={true} />
                  </div>
                )}
                {data?.data && (
                  <img
                    src={MEDIA_URL + (isMarker ? data?.data?.marker_photo : data?.data?.photo)}
                    alt='test'
                    style={{
                      resize: 'none'
                    }}
                  />
                )}
                {/* </div> */}
              </TransformComponent>
              <Controls data={data?.data} />
            </TransformWrapper>
            {data?.data?.description && (
              <div
                className='library-gallery__info '
                style={
                  {
                    // alignSelf: 'flex-end'
                    //   width: 'auto'
                  }
                }
              >
                <div
                  className={`${!commentOpen ? 'close' : 'library-gallery__text '}`}
                  //   style={{
                  //     width: !isMobile ? (!commentOpen ? 0 : '20rem') : '100dvw',
                  //     overflow: 'scroll',
                  //     height: isMobile ? (!commentOpen ? 0 : '20rem') : '100%'
                  //   }}
                >
                  <div
                    className='library-gallery__text__content'
                    // style={{
                    //   minWidth: isMobile ? '100%' : '20rem',
                    //   height: '100%',
                    //   overflow: 'hidden'
                    // }}
                  >
                    <h4 className='section-title'>{data?.data?.title?.[lang]}</h4>
                    <WithHtml html={data?.data?.description?.[lang]} />
                  </div>
                </div>
                <div
                  id={photo?.type === 'quiz' ? 'help' : ''}
                  className={`library-gallery__slide btn ${commentOpen ? 'closed' : ''}`}
                  onClick={() => setCommentOpen(!commentOpen)}
                >
                  <CloseIcon />
                </div>
              </div>
            )}
          </div>
          <Tooltip anchorSelect='#help' place='top'>
            {t('Get help')}
          </Tooltip>
        </div>
      )}
    </GetContainer>
  )
}

export default ImageModal
