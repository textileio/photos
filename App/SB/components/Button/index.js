import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import styles from './statics/styles'

const ButtonNext = props => {
  const { onPress, disabled, text, style, textStyle } = props

  return (
    <TouchableOpacity disabled={disabled} style={[styles.button, style, disabled && styles.disabled]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle, disabled && styles.textDisabled]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default ButtonNext
