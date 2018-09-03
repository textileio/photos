import React from 'react'
import { Text } from 'react-native'

import styles, { colors } from './statics/styles'

const PasswordValidator = props => {
  const { display, text } = props

  return (
    <Text style={[!display && { display: 'none' }, styles.text, colors[text]]}>{text}</Text>
  )
}

export default PasswordValidator
