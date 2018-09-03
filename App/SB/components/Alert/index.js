import React from 'react'
import { View, Text } from 'react-native'

import styles from './statics/styles'

const Alert = props => {
  const { display, bottom, msg, top } = props
  if (display === true) {
    return (
      <View style={[styles.container, bottom && styles.bottom, top && styles.top]}>
        <Text style={styles.msg}>{msg}</Text>
      </View>
    )
  } else {
    return (<View />)
  }
}

export default Alert
