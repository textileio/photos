import React from 'react'
import { View, Image } from 'react-native'

import styles from './Styles/AvatarStyles'

const Avatar = props => {
  const { uri, height, width, defaultSource, style } = props
  let borderRadius = height / 2
  return (
    <View style={[styles.container, style, {width, height, borderRadius}]}>
      <View style={styles.stretch}>
        {uri && <Image
          key={uri}
          source={{uri: uri}}
          resizeMode={'cover'}
          style={{width, height}}
          defaultSource={defaultSource}
        />}
        {/* avoids a null uri warning */}
        {!uri && defaultSource && <Image
          key={uri}
          source={defaultSource}
          resizeMode={'cover'}
          style={{width, height}}
        />}
      </View>
    </View>
  )
}

export default Avatar
