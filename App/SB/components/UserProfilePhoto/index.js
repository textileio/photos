import React from 'react'
import propTypes from 'prop-types'

import { View } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import styles from './statics/styles'

const UserProfilePhoto = props => {
  const { width, photo, style } = props

  return (
    <View style={[styles.container, style]}>
      <ImageSc style={styles.filter} width={width} source={require('./statics/user-profile-filter.png')} />
      <ImageSc style={styles.image} height={width} width={width} source={photo} />
    </View>
  )
}

UserProfilePhoto.propTypes = {
  photo: propTypes.number.isRequired,
  width: propTypes.number.isRequired
}

export default UserProfilePhoto