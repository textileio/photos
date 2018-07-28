import React from 'react'
import { View, Text } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import styles from './statics/styles'

const FeedItem = props => {
  const { userPhoto, actionMsg, actionUser, timestamp, photo } = props

  return (
    <View style={styles.itemContainer}>
      <ImageSc width={29} source={userPhoto} />
      <View style={styles.textContainer}>
        <Text style={styles.text}><Text style={styles.strong}>{actionUser}</Text> {actionMsg}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <ImageSc width={40} source={photo} />
    </View>
  )
}

export default FeedItem