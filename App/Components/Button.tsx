import React, { Component } from 'react'
import { Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native'

import RoundedCornersView from './RoundedCornersView'

const BUTTON: ViewStyle = {
  backgroundColor: '#2625FF'
  // minWidth: 300,
  // paddingVertical: 18,
  // paddingHorizontal: 65
}

const BUTTON_TEXT: TextStyle = {
  fontFamily: 'Biotif-Regular',
  fontSize: 18,
  color: 'white',
  textAlign: 'center',
  textAlignVertical: 'center',
  includeFontPadding: false
}

const DISABLED: ViewStyle = {
  backgroundColor: '#D8D8D8'
}

interface Props {
  onPress?: () => void
  disabled?: boolean
  processing?: boolean
  text?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

const button = (props: Props) => {
  const { onPress, disabled, text, style, textStyle, processing } = props

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <RoundedCornersView style={[BUTTON, style, disabled && DISABLED]}>
        {processing &&
          <ActivityIndicator />
        }
        {!processing &&
          <Text style={[BUTTON_TEXT, textStyle]}>{text}</Text>
        }
      </RoundedCornersView>
    </TouchableOpacity>
  )
}

export default button
