import React from 'react'
import { View, Image, Text } from 'react-native'

import styles from './statics/styles'

const PhotoWithTextBox = props => {
  const { style } = props

  return (
    <View style={[styles.itemContainer, style]}>
      <View style={styles.itemBox}>
        <Image style={styles.itemBoxPlus} source={require('./statics/icon-big-plus.png')} />
      </View>
      <Text style={styles.itemText}>Create new thread</Text>
    </View>
  )
}

export default PhotoWithTextBox