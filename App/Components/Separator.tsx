import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'

import { color } from '../styles'

const SeparatorContainer: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center'
}

const SeparatorBar: ViewStyle = {
  width: '96%',
  height: 1,
  backgroundColor: color.grey_4
}

export default class Separator extends PureComponent {
  render() {
    return (
      <View style={SeparatorContainer}>
        <View style={SeparatorBar} />
      </View>
    )
  }
}
