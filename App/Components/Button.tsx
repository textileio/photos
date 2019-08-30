import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator
} from 'react-native'

const BUTTON_TEXT: TextStyle = {
  fontFamily: 'Biotif-Regular',
  fontSize: 18,
  color: 'white',
  textAlign: 'center',
  textAlignVertical: 'center',
  includeFontPadding: false
}

const DISABLED: ViewStyle = {
  opacity: 0.2
}

interface Props {
  onPress?: () => void
  disabled?: boolean
  processing?: boolean
  text?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

function button(props: Props) {
  const { onPress, disabled, text, style, textStyle, processing } = props

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View style={[style, disabled && DISABLED]}>
        {processing && <ActivityIndicator />}
        {!processing && <Text style={[BUTTON_TEXT, textStyle]}>{text}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export default button
