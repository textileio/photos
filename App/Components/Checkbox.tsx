import React, { PureComponent } from 'react'
import { View, ViewStyle, TouchableOpacity } from 'react-native'

import { color, spacing } from '../styles'

interface Props {
  checked: boolean
}

const checkboxStyle: ViewStyle = {
  width: spacing._032,
  height: spacing._032,
  marginRight: spacing._012,
  borderRadius: spacing._032 / 2,
  borderWidth: 1
}

export default class Checkbox extends PureComponent<Props> {
  render() {
    return (
      <View
        style={{
          ...checkboxStyle,
          backgroundColor: this.props.checked ? color.action_5 : 'transparent',
          borderColor: this.props.checked ? color.action_5 : color.grey_3
        }}
      />
    )
  }
}
