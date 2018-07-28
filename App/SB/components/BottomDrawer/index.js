import React from 'react'
import { View } from 'react-native'

import styles from './statics/styles'

const BottomDrawer = props => {
  const { style, overlay } = props
  return (
    <View style={[overlay ? styles.mainContainer : {}]}>
      { overlay && <View style={styles.overlay} /> }
      <View style={[styles.container, style, !overlay ? { bottom: 0 } : { bottom: 25 }]}>
        {props.children}
      </View>
    </View>
  )
}

export default BottomDrawer
