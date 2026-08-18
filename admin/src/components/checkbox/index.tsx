import { Checkbox, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import Translations from '../translations'

interface ICustomCheckbox {
  label: string
  name: string
  defaultValue: any
  setValue: any
  /** react-hook-form getValues funksiyasi */
  value: any
}

function CustomCheckbox(props: ICustomCheckbox) {
  const { name, setValue, value } = props
  const current = !!value(name)
  const [checked, setChecked] = useState(!!props.defaultValue)

  useEffect(() => {
    setChecked(current)
  }, [current])

  return (
    // Ilgari belgi <Typography> ichida edi va yorliqni bosish ishlamasdi.
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={e => {
            setValue(name, e.target.checked)
            setChecked(e.target.checked)
          }}
        />
      }
      label={<Translations text={props.label} />}
    />
  )
}

export default CustomCheckbox
