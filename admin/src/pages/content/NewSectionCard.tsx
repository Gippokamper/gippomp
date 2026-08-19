import { Box, Button, IconButton, TextField } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ImageIcon from '@mui/icons-material/Image'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useRef, useState } from 'react'
import MyEditor from '../../components/editor'
import NoteImagePicker, { PickKind } from './NoteImagePicker'

type Lang = 'uz' | 'ru' | 'en'

interface IProps {
  index: number
  lang: Lang
  title: any
  content: any
  onTitle: (v: any) => void
  onContent: (v: any) => void
  onRemove: () => void
  canRemove: boolean
}

// Yangi maqola yaratishда bir bo'lim (lokal — publishда birga saqlanadi).
function NewSectionCard(props: IProps) {
  const { lang } = props
  const [picker, setPicker] = useState<PickKind | null>(null)
  const insertRef = useRef<((c: string) => void) | null>(null)

  return (
    <Box sx={{ border: '1px solid rgba(18,27,45,.10)', borderRadius: 2, p: 1.5, mb: 1.2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <DragIndicatorIcon sx={{ color: 'text.disabled' }} />
        <TextField
          size='small'
          fullWidth
          label={`${props.index + 1}-bo'lim sarlavhasi (${lang.toUpperCase()})`}
          value={props.title[lang] || ''}
          onChange={e => props.onTitle({ ...props.title, [lang]: e.target.value })}
        />
        <Box sx={{ display: 'flex', gap: 0.3 }}>
          <Button size='small' startIcon={<NoteAddIcon />} onClick={() => setPicker('note')}>
            Eslatma
          </Button>
          <Button size='small' startIcon={<ImageIcon />} onClick={() => setPicker('image')}>
            Rasm
          </Button>
          <IconButton size='small' color='error' disabled={!props.canRemove} onClick={props.onRemove}>
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <MyEditor
        key={lang}
        value={props.content[lang] || ''}
        setValue={(e: string) => props.onContent({ ...props.content, [lang]: e })}
        insertRef={insertRef}
      />

      <NoteImagePicker
        open={!!picker}
        kind={picker || 'note'}
        onClose={() => setPicker(null)}
        onPick={token => {
          if (insertRef.current) insertRef.current(token)
          else props.onContent({ ...props.content, [lang]: (props.content[lang] || '') + ' ' + token + ' ' })
        }}
      />
    </Box>
  )
}

export default NewSectionCard
