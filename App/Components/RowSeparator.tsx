import React from 'react'
import { Platform, View } from 'react-native'
import { color, size, spacing } from '../styles'

const separator = () => {
  const height = size.hairline
  const margin = Platform.OS === 'ios' ? spacing._012 : 0
  return (
    <View
      style={{
        height,
        width: '100%',
        marginLeft: margin,
        backgroundColor: color.grey_4
      }}
    />
  )
}

export default separator
