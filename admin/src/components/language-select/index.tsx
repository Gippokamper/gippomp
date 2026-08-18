import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'

function LanguageSelect() {
  const { i18n } = useTranslation()
  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value)
  }
  return (
    <Select
      labelId='demo-simple-select-label'
      id='demo-simple-select'
      size='small'
      value={i18n.language}
      label={''}
      onChange={handleChange}
    >
      <MenuItem value={'uz'}>O`zbekcha</MenuItem>
      <MenuItem value={'ru'}>Русский</MenuItem>
      <MenuItem value={'en'}>English</MenuItem>
    </Select>
  )
}

export default LanguageSelect
