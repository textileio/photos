import React from 'react'
import { ViewStyle } from 'react-native'
import Button from './Button'
import { color, spacing } from '../styles'

interface Props {
  text: string
  style?: ViewStyle
  disabled?: boolean
  processing?: boolean
  onPress?: () => void
}

const button = (props: Props) => {
  const { text, onPress, style, processing } = props
  return (
    <Button
      text={text.toUpperCase()}
      textStyle={{
        fontFamily: 'Biotif-Bold',
        fontSize: 16,
        letterSpacing: 3,
        paddingLeft: 3
      }}
      style={{
        paddingHorizontal: spacing._024,
        paddingVertical: spacing._012,
        backgroundColor: color.action_3,
        ...style
      }}
      processing={processing}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
