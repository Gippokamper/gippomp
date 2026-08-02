// ** React Imports
import { Dispatch, SetStateAction, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import Translations from '../translations'
import { UploadFile } from '@mui/icons-material'
import { MEDIA_URL, request } from '../../utils/request'
import { CircularProgress } from '@mui/material'

interface FileProp {
  name: string
  type: string
  size: number
}

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
  // ** State
  const [files, setFiles] = useState<File[]>([])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'video/mp4': ['.mp4', '.MP4']
    },
    onDrop: async (acceptedFiles: File[]) => {
      setIsLoading(true)
      props.setLoading && props.setLoading(true)
      const image = acceptedFiles[0]
      const data = new FormData()
      data.append('folder', props?.type ? props?.type : 'pages')
      data.append('video', image)
      await request({
        url: '/dashboard/admin/video_upload',
        method: 'POST',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response: any) => (props?.setVideo ? props?.setVideo(response?.data?.data?.path) : null))
        .catch((error: any) => toast.error(error.message))
        .finally(() => {
          setIsLoading(false)
          props.setLoading && props.setLoading(false)
        })
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const img = (
    <video width={500} height={300} controls>
      <source src={`${MEDIA_URL}${props.video}`} type='video/mp4' />
      Your browser does not support the video tag.
    </video>
  )

  return (
    <Box {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} {...props} />
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '5rem'
          }}
        >
          <CircularProgress color='secondary' />
        </Box>
      ) : props?.video?.length ? (
        img
      ) : (
        <Box
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '5rem'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UploadFile
              sx={{
                fontSize: '5rem'
              }}
            />
          </Box>
          <Typography>
            <Translations text={props.title || 'Upload image'} />
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default VideoUploaderSingle
