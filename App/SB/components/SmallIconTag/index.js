import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './statics/styles'

const SmallIconTag = props => {
  const { text, image, textStyle, imageStyle, style, defaultSource } = props
  return (
    <View style={[styles.detail, style]}>
      <Image style={[styles.detailImage, imageStyle]} resizeMode={'contain'} source={image} defaultSource={defaultSource} />
      <View style={[styles.detailTextView]}>
        <Text style={[styles.detailText, textStyle]}>{text}</Text>
      </View>
    </View>
  )
}

export default SmallIconTag
