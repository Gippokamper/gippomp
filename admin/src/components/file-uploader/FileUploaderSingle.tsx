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
  /** yuklanadigan papka nomi (backend'ga `folder` sifatida ketadi) */
  type?: string
  setImage?: any
  images?: string
  name?: string
  title?: string
  setLoading?: Dispatch<SetStateAction<boolean>>
}

const FileUploaderSingle = (props: IProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    onDrop: async (acceptedFiles: File[]) => {
      const image = acceptedFiles[0]
      if (!image) return
      setIsLoading(true)
      props.setLoading?.(true)
      const data = new FormData()
      data.append('folder', props?.type ? props.type : 'pages')
      data.append('image', image)
      try {
        const response: any = await request({
          url: 'dashboard/photo_upload',
          method: 'POST',
          data,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        props?.setImage?.(response?.data?.data?.path)
      } catch (e) {
        // Xato toast'i request.ts da chiqadi — bu yerda takrorlamaymiz.
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
          bgcolor: isDragActive ? 'rgba(77,175,0,.04)' : 'transparent',
          '&:hover': { borderColor: 'primary.main' }
        }}
      >
        {/*
          Ilgari bu yerda `{...props}` ham input'ga tarqatilardi va `type='images'`
          kabi prop dropzone bergan `type="file"` ni bosib ketardi — natijada
          input oddiy matn maydoniga aylanib, bosilganda fayl tanlash oynasi
          umuman ochilmasdi (faqat sudrab tashlash ishlardi).
        */}
        <input {...getInputProps()} />

        {isLoading ? (
          <CircularProgress size={28} />
        ) : props.images ? (
          <img
            src={`${MEDIA_URL}${props.images}`}
            alt=''
            style={{ width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: 8 }}
          />
        ) : (
          <UploadFile sx={{ fontSize: '2.5rem', color: 'text.secondary' }} />
        )}

        <Box sx={{ minWidth: 0 }}>
          <Typography variant='body2' fontWeight={600}>
            <Translations text={props.title || 'Upload image'} />
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            PNG, JPG, WEBP
          </Typography>
        </Box>

        {props.images && !isLoading && (
          <IconButton
            size='small'
            sx={{ ml: 'auto' }}
            onClick={event => {
              event.stopPropagation()
              props.setImage?.('')
            }}
          >
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}

export default FileUploaderSingle
