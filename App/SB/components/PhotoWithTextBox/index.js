import React from 'react'
import propTypes from 'prop-types'
import { View, Image, Text } from 'react-native'

import styles from './statics/styles'

const PhotoWithTextBox = props => {
  const { photo, text, style } = props

  return (
    <View style={[styles.itemContainer, style]}>
      <Image style={styles.itemPhoto} source={photo} />
      <Text style={styles.itemText}>{text}</Text>
    </View>
  )
}

PhotoWithTextBox.propTypes = {
  photo: propTypes.number.isRequired,
  text: propTypes.string.isRequired
}

export default PhotoWithTextBox