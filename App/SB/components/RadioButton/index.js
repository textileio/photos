import React from 'react'
import { View, Image } from 'react-native'

import styles from './statics/styles'

const RadioButton = props => {
  const { selected, style, disabled } = props

  return (
    <View style={[styles.button, style, disabled && styles.disabled]}>
      { selected && <Image style={styles.buttonImage} source={require('./statics/check.png')} /> }
      { selected && <View style={[styles.buttonSelected, disabled && styles.buttonDisabled]} /> }
    </View>
  )
}

export default RadioButton
