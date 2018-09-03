import React from 'react'
import { View } from 'react-native'

import styles from './statics/styles'

const Toolbar = props => {
  const { children, left, center, right, style } = props

  return (
    <View style={[styles.toolBar, style]}>
      <View style={styles.toolbarTop}>
        {left}
        {center}
        {right}
      </View>
      <View style={styles.toolbarBottom}>
        {children}
      </View>
    </View>
  )
}

export default Toolbar
