import React from 'react'
import { View, Text } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import styles from './statics/styles'

const FeedItem = () => {
  return (
    <View style={styles.itemContainer}>
      <ImageSc width={32} source={require('./statics/icon-textile.png')} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>We have a new update 🎊 🎉 </Text>
      </View>
      <Text style={styles.link}>Update</Text>
    </View>
  )
}

export default FeedItem
