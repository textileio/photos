import React from 'react'
import propTypes from 'prop-types'

import { View } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import styles from './statics/styles'

const UserProfilePhoto = props => {
  const { width, source, style } = props

  return (
    <View style={[styles.container, style]}>
      <ImageSc style={{ ...styles.image, borderRadius: width / 2 }} height={width} width={width} source={source} />
    </View>
  )
}

UserProfilePhoto.propTypes = {
  width: propTypes.number.isRequired
}

export default UserProfilePhoto
