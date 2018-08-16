import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './statics/styles'
import Avatar from '../../../Components/Avatar'

const SmallIconTag = props => {
  const { text, uri, textStyle, avatarStyle, style, defaultSource } = props
  return (
    <View style={[styles.detail, style]}>
      <Avatar style={avatarStyle} width={27} height={27} uri={uri} defaultSource={defaultSource} />
      <View style={[styles.detailTextView]}>
        <Text style={[styles.detailText, textStyle]}>{text}</Text>
      </View>
    </View>
  )
}

export default SmallIconTag
