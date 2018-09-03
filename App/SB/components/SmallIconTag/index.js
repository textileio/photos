import React from 'react'
import { View, Text } from 'react-native'
import styles from './statics/styles'
import Avatar from '../../../Components/Avatar'

const SmallIconTag = props => {
  const { text, peerId, textStyle, avatarStyle, style, defaultSource } = props
  return (
    <View style={[styles.detail, style]}>
      <Avatar style={avatarStyle} width={27} height={27} peerId={peerId} defaultSource={defaultSource} />
      <View style={[styles.detailTextView]}>
        <Text style={[styles.detailText, textStyle]}>{text}</Text>
      </View>
    </View>
  )
}

export default SmallIconTag
