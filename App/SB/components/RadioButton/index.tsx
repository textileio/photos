import React from 'react'
import { View, Image, ViewStyle } from 'react-native'

import styles from './statics/styles'

interface RadioProps {
  selected: boolean
  disabled?: boolean
  style?: ViewStyle
}

const RadioButton = (props: RadioProps) => {
  const { selected, style, disabled } = props

  const shouldDisable = Boolean(disabled)
  return (
    <View style={[styles.button, style, shouldDisable && styles.disabled]}>
      {selected && (
        <Image
          style={styles.buttonImage}
          source={require('./statics/check.png')}
        />
      )}
      {selected && (
        <View
          style={[
            styles.buttonSelected,
            shouldDisable && styles.buttonDisabled
          ]}
        />
      )}
    </View>
  )
}

export default RadioButton
