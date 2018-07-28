import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import styles from './statics/styles'

const RadioButton = props => {
  const { selected, style } = props

  return (
    <TouchableOpacity style={[styles.button, style]}>
      { selected && <Image style={styles.buttonImage} source={require('./statics/check.png')} /> }
      { selected && <View style={styles.buttonSelected}/> }
    </TouchableOpacity>
  )
}

export default RadioButton