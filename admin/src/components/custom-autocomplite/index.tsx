import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

interface IProps {
  data: any
  value: any
  setValue: any
  control?: any
  name: string
  getOption: any
  multiple?: boolean
  defaultValue?: any
  loading: boolean
  /** ko'rinadigan sarlavha; berilmasa maydon nomi ishlatiladi */
  label?: string
}

// Eslatma: bu yerda 240 qatorlik "countries" demo massivi ham bor edi —
// hech qayerda ishlatilmagani uchun olib tashlandi.
function CustomAutocomplete(props: IProps) {
  const [value, setValue] = useState<any>(props.multiple ? [] : null)

  useEffect(() => {
    props.setValue(props.name, props.value)
    setValue(props.value)
    //eslint-disable-next-line
  }, [props.value])

  return (
    <Autocomplete
      // freeSolo olib tashlandi: u bilan ro'yxatda yo'q matn ham qiymatga
      // aylanardi va saqlashda `el.id` -> undefined bo'lib, backend'ga bo'sh
      // qiymatlar ketardi.
      options={props.data || []}
      size='small'
      multiple={!!props.multiple}
      // Ro'yxatdagi element obyekt bo'lmasa getOptionLabel xato berardi.
      getOptionLabel={(option: any) => (option && typeof option === 'object' ? props.getOption(option) ?? '' : '')}
      isOptionEqualToValue={(option: any, selected: any) => option?.id === selected?.id}
      loading={props.loading}
      renderInput={params => (
        // Ilgari sarlavha sifatida maydon nomi ("category_ids") ko'rsatilardi.
        <TextField {...params} label={props.label || props.name} margin='normal' variant='outlined' />
      )}
      onChange={(_, values) => {
        setValue(values)
        props.setValue(props.name, values)
      }}
      value={props.multiple ? value || [] : value ?? null}
    />
  )
}

export default CustomAutocomplete
