import React from 'react'
import { Platform, Dimensions, View } from 'react-native'
import { COLOR_GREY_MEDIUM } from '../Themes/Constants'

const separator = () => {
  const scale = Dimensions.get('screen').scale
  const height = scale > 1 ? 0.5 : 1
  const margin = Platform.OS === 'ios' ? 12 : 0
  return <View style={{ height, width: '100%', marginLeft: margin, backgroundColor: COLOR_GREY_MEDIUM }} />
}

export default separator
