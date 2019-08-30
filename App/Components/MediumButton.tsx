import React from 'react'
import { ViewStyle, TextStyle } from 'react-native'
import Button from './Button'
import { textStyle as ts, spacing } from '../styles'

interface Props {
  text: string
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
  onPress?: () => void
}

function button(props: Props) {
  const { text, onPress, style, textStyle } = props
  return (
    <Button
      text={text.toUpperCase()}
      textStyle={{ ...ts.action_s, ...textStyle }}
      style={{
        ...style,
        paddingHorizontal: spacing._012,
        paddingVertical: spacing._008
      }}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
