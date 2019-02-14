import React from 'react'
import { ViewStyle } from 'react-native'
import Button from './Button'
import { color } from '../styles'

interface Props {
  text: string
  style?: ViewStyle
  disabled?: boolean
  onPress?: () => void
}

const button = (props: Props) => {
  const { text, onPress, style } = props
  return (
    <Button
      text={text.toUpperCase()}
      textStyle={{
        fontFamily: 'Biotif-Bold',
        fontSize: 10,
        letterSpacing: 2,
        paddingLeft: 2
      }}
      style={{
        ...style,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: color.action_3
      }}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
