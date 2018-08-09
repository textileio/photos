import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './statics/styles'
import navStyles from '../../../Navigation/Styles/NavigationStyles'

const SmallIconTag = props => {
  const { text, image, textStyle, imageStyle, style, defaultSource } = props
  return (
    <View style={[styles.detail, style]}>


      <View style={styles.detailImageView}>
        <View style={styles.detailImageContainer}>
          <Image style={[styles.detailImage, imageStyle]} resizeMode={'cover'} source={image} defaultSource={defaultSource} />
        </View>
      </View>

      <View style={[styles.detailTextView]}>
        <Text style={[styles.detailText, textStyle]}>{text}</Text>
      </View>
    </View>
  )
}

export default SmallIconTag
