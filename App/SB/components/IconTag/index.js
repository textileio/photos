import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './statics/styles'

const IconTag = props => {
  const { text, image, textStyle, imageStyle, style } = props
  return (
    <View style={[styles.detail, style]}>
      <Image style={[styles.detailImage, imageStyle]} source={image} />
      <Text style={[styles.detailText, textStyle]}>{text}</Text>
    </View>
  )
}

export default IconTag
