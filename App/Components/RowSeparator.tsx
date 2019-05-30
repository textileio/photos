import React from 'react'
import { Platform, Dimensions, View } from 'react-native'
import { color } from '../styles'

const separator = () => {
  const scale = Dimensions.get('screen').scale
  const height = scale > 1 ? 0.5 : 1
  const margin = Platform.OS === 'ios' ? 12 : 0
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
