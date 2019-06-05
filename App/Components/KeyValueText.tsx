import React from 'react'
import { Text, TextStyle, TextProps } from 'react-native'

import { spacing, textStyle } from '../styles'

const KEY: TextStyle = {
  ...textStyle.body_m_bold,
  lineHeight: 16
}

const VALUE: TextStyle = {
  ...textStyle.body_m,
  lineHeight: 16,
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'visible',
  paddingTop: spacing._008
}

interface Props extends TextProps {
  keyString: string
  value: string
}

const keyValueText = (props: Props) => {
  const { keyString, value, ...rest } = props
  return (
    <Text style={VALUE} {...rest}>
      <Text style={KEY}>{keyString}</Text> {value}
    </Text>
  )
}

export default keyValueText
