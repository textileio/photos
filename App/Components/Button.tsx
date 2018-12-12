import React from 'react'
import { Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native'

const BUTTON: ViewStyle = {
  backgroundColor: '#2625FF',
  minWidth: 300,
  paddingVertical: 18,
  paddingHorizontal: 65,
  borderRadius: 6
}

const BUTTON_TEXT: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 18,
  color: 'white',
  textAlign: 'center'
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
    <TouchableOpacity disabled={disabled} style={[BUTTON, style, disabled && DISABLED]} onPress={onPress}>
      {processing &&
        <ActivityIndicator/>
      }
      {!processing &&
        <Text style={[BUTTON_TEXT, textStyle]}>{text}</Text>
      }
    </TouchableOpacity>
  )
}

export default button
