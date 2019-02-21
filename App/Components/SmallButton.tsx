import React from 'react'
import { ViewStyle, TextStyle } from 'react-native'
import Button from './Button'
import { color, textStyle as ts } from '../styles'

interface Props {
  text: string
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
  onPress?: () => void
}

const button = (props: Props) => {
  const { text, onPress, style, textStyle } = props
  return (
    <Button
      text={text.toUpperCase()}
      textStyle={{ ...ts.action_xs, ...textStyle }}
      style={{
        ...style,
        paddingHorizontal: 8,
        paddingVertical: 4
      }}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
