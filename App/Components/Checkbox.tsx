import React, { PureComponent } from 'react'
import { View, ViewStyle, TouchableOpacity } from 'react-native'

import Icon from '@textile/react-native-icon'

import { spacing, size } from '../styles'

interface Props {
  checked: boolean
  uncheckedColor: string
  checkedColor: string
}

const checkboxStyle: ViewStyle = {
  width: size._032,
  height: size._032,
  marginRight: spacing._012,
  borderRadius: spacing._032 / 2,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center'
}

export default class Checkbox extends PureComponent<Props> {
  render() {
    return (
      <View
        style={{
          ...checkboxStyle,
          backgroundColor: this.props.checked
            ? this.props.checkedColor
            : 'transparent',
          borderColor: this.props.checked
            ? this.props.checkedColor
            : this.props.uncheckedColor
        }}
      >
        {this.props.checked && (
          <Icon name="check-mark" size={size._024} color="#fff" />
        )}
      </View>
    )
  }
}
