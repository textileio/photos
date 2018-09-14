import React from 'react'
import { Text, TextStyle, TextProps } from 'react-native'

const KEY: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 14,
  lineHeight: 16
}

const VALUE: TextStyle = {
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  fontFamily: 'BentonSans-Light',
  fontSize: 14,
  lineHeight: 16,
  overflow: 'visible',
  paddingTop: 6,
  paddingBottom: 8
}

interface Props extends TextProps {
  keyString: string
  value: string
}

const keyValueText = (props: Props) => {
  const { keyString, value, ...rest } = props
  return (
    <Text style={VALUE} {...rest}>
      <Text style={KEY}>{keyString}</Text>{' '}{value}
    </Text>
  )
}

export default keyValueText
