import { Dispatch, SetStateAction, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CircularProgress, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useDropzone } from 'react-dropzone'
import Translations from '../translations'
import { UploadFile } from '@mui/icons-material'
import { MEDIA_URL, request } from '../../utils/request'

interface IProps {
  type?: string
  setVideo?: any
  video?: string
  name?: string
  title?: string
  setLoading?: Dispatch<SetStateAction<boolean>>
}

const VideoUploaderSingle = (props: IProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { 'video/mp4': ['.mp4', '.MP4'] },
    onDrop: async (acceptedFiles: File[]) => {
      const video = acceptedFiles[0]
      if (!video) return
      setIsLoading(true)
      props.setLoading?.(true)
      const data = new FormData()
      data.append('folder', props?.type ? props.type : 'pages')
      data.append('video', video)
      try {
        const response: any = await request({
          // To'g'ri manzil `dashboard/video_upload` — ilgari `dashboard/admin/...`
          // ga so'rov ketardi va bunday route yo'q (404), ya'ni video yuklash
          // umuman ishlamasdi.
          url: 'dashboard/video_upload',
          method: 'POST',
          data,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        props?.setVideo?.(response?.data?.data?.path)
      } catch (e) {
        // Xato toast'i request.ts da chiqadi.
      } finally {
        setIsLoading(false)
        props.setLoading?.(false)
      }
    }
  })

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: '1px dashed',
          borderColor: isDragActive ? 'primary.main' : 'rgba(18,27,45,.2)',
          borderRadius: 2,
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main' }
        }}
      >
        {/* `{...props}` input'ga tarqatilmaydi — u `type="file"` ni buzardi. */}
        <input {...getInputProps()} />
        {isLoading ? (
          <CircularProgress size={28} />
        ) : (
          <UploadFile sx={{ fontSize: '2.5rem', color: 'text.secondary' }} />
        )}
        <Box>
          <Typography variant='body2' fontWeight={600}>
            <Translations text={props.title || 'Upload video'} />
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            MP4
          </Typography>
        </Box>
        {props.video && !isLoading && (
          <IconButton
            size='small'
            sx={{ ml: 'auto' }}
            onClick={event => {
              event.stopPropagation()
              props.setVideo?.('')
            }}
          >
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        )}
      </Box>

      {props.video && !isLoading && (
        <video style={{ width: '100%', maxWidth: '30rem', marginTop: '0.75rem', borderRadius: 8 }} controls>
          <source src={`${MEDIA_URL}${props.video}`} type='video/mp4' />
        </video>
      )}
    </Box>
  )
}

export default VideoUploaderSingle
