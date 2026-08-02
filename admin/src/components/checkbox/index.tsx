import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Translations from '../translations'
import { Controller } from 'react-hook-form'
import DefaultValue from '../defaultvalue/DefaultValue'
// import { Controller } from 'react-hook-form'

interface ICustomCheckbox {
  label: string
  name: string
  defaultValue: any
  setValue: any
  value: any
}

function CustomCheckbox(props: ICustomCheckbox) {
  const [checked, setChecked] = useState(!!props.defaultValue)

  useEffect(() => {
    setChecked(!!props.value(props.name))
  }, [!!props.value(props.name)])
  return (
    <Grid>
      <Typography>
        <Translations text={props.label} />
        <Checkbox
          checked={checked}
          onChange={e => {
            props.setValue(props.name, e.target.checked)
            setChecked(e.target.checked)
          }}
        />
      </Typography>
    </Grid>
  )
}

export default CustomCheckbox
