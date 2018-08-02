import React from 'react'
import { View, Text } from 'react-native'

import styles from './statics/styles'

const Alert = props => {
  const { display, bottom, msg, top } = props
  return (
    <View style={[styles.container, !display && { display: 'none' }, bottom && styles.bottom, top && styles.top]}>
      <Text style={styles.msg}>{msg}</Text>
    </View>
  )
}

export default Alert
