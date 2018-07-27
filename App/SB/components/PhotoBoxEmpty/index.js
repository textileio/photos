import React from 'react'
import { View, Image, Text } from 'react-native'

import styles from './statics/styles'

const PhotoWithTextBox = props => {
  const { style, text } = props

  return (
    <View style={[styles.itemContainer, style]}>
      <View style={styles.itemBox}>
        <Image style={styles.itemBoxPlus} source={require('./statics/icon-big-plus.png')} />
      </View>
      <Text style={styles.itemText}>{text}</Text>
    </View>
  )
}

export default PhotoWithTextBox
