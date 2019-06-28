import React from 'react'
import { View, Image, Text, ViewStyle, StyleSheet } from 'react-native'

import styles from './statics/styles'

interface PhotoWithTextBoxProps {
  title: string
  style?: ViewStyle
}

const PhotoWithTextBox = (props: PhotoWithTextBoxProps) => {
  const { style, title } = props
  const viewStyle = StyleSheet.flatten([styles.itemContainer, style])
  return (
    <View style={viewStyle}>
      <View style={styles.itemBox}>
        <Image
          style={styles.itemBoxPlus}
          source={require('./statics/icon-big-plus.png')}
        />
      </View>
      <Text style={styles.itemText}>{title}</Text>
    </View>
  )
}

export default PhotoWithTextBox
