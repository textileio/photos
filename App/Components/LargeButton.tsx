import React from 'react'
import { ViewStyle } from 'react-native'
import Button from './Button'
import * as s from '../Themes/Constants'

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
        ...style,
        paddingHorizontal: s.SPACING_24,
        paddingVertical: s.SPACING_12,
        backgroundColor: s.COLOR_BRAND_BLUE
      }}
      processing={processing}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
