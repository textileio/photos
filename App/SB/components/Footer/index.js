import React from 'react'
import { View } from 'react-native'

import styles from './styles'

const Footer = props => {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  )
}

export default Footer
