import React, { useEffect } from 'react'

interface IProps {
  defaultValue: any
  setDefaultValue(value: any): void
  children: React.ReactNode
}

function DefaultValue(props: IProps) {
  useEffect(() => {
    if (props.defaultValue) {
      props.setDefaultValue(props.defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValue])

  return <>{props.children}</>
}

export default DefaultValue
