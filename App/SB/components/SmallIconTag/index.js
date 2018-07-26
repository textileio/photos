import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './statics/styles'

const SmallIconTag = props => {
  const { text, image } = props
  return (
    <View style={styles.detail}>
      <Image style={styles.detailImage} source={image} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  )
}

export default SmallIconTag