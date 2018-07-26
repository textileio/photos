import React from 'react'
import { View } from 'react-native'

import styles from './statics/styles'

const Toolbar = props => {
  const { children, left, center, right } = props

  return (
    <View style={styles.toolBar}>
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