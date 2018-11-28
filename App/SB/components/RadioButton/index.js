import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import styles from './statics/styles'

const RadioButton = props => {
  const { selected, style, disabled, onPress } = props

  return (
    <TouchableOpacity style={[styles.button, style, disabled && styles.disabled]} onPress={onPress}>
      { selected && <Image style={styles.buttonImage} source={require('./statics/check.png')} /> }
      { selected && <View style={[styles.buttonSelected, disabled && styles.buttonDisabled]} /> }
    </TouchableOpacity>
  )
}

RadioButton.defaultProps = {
	onPress: () => {},
}

export default RadioButton
