import React from 'react'
import { View, Image } from 'react-native'

import styles from './Styles/AvatarStyles'

const Avatar = props => {
  const { uri, height, width, defaultSource, style } = props
  let borderRadius = height / 2
  return (
    <View style={[styles.container, style, {width, height, borderRadius}]}>
      <View style={styles.stretch}>
        <Image
          source={{uri: uri}}
          resizeMode={'cover'}
          style={{width, height}}
          defaultSource={defaultSource}
        />
      </View>
    </View>
  )
}

export default Avatar
