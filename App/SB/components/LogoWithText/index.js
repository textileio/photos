import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, Image } from 'react-native'

import styles from './statics/styles'

const LogoWithText = props => {
  const { text } = props

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('./statics/logo.png')} />
      <Text style={styles.tagline}>{text}</Text>
    </View>
  )
}

LogoWithText.propTypes = {
  text: PropTypes.string.isRequired
}

export default LogoWithText
