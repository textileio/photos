import React from 'react'
import TextField from './TextField'

const Input = props => {
  return (
    <TextField
      keyboardType='default'
      {...props}
    />
  )
}

export default Input
