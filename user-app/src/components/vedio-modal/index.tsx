import React from 'react'
import close from '../../img/icons/close.svg'

interface IProps {
  url: string
  close: () => void
}

function VideoModal(props: IProps) {
  console.log(props.url, 'url', 'https://www.youtube.com/embed/' + props.url?.split('https://youtube.com/')?.[1])
  return (
    <div className='library-gallery' style={{ display: props.url ? 'block' : 'none' }}>
      <div className='library-gallery__content'>
        <div className='library-gallery__main'>
          <div
            className='library-gallery__close'
            style={{
              position: 'absolute',
              left: '2rem',
              top: '2rem',
              width: '3rem',
              height: '3rem'
            }}
            onClick={props.close}
          >
            <img src={close} alt='ico' />
          </div>
          <div
            className='library-gallery__img'
            // style={{
            //   width: '100%',
            //   backgroundColor: 'red'
            // }}
          >
            <iframe
              width={'100%'}
              style={{
                width: '100%',
                height: '100%'
              }}
              height={'80%'}
              src={'https://www.youtube.com/embed/' + props.url?.split('https://youtu.be/')?.[1]}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoModal
