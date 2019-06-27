import React from 'react'
import { View, Text, ActivityIndicator, ActivityIndicatorProps, TextStyle } from 'react-native'

import { color, textStyle, spacing } from '../styles'

const TEXT: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_4,
  textAlign: 'center',
  marginTop: spacing._012
}

interface Props extends ActivityIndicatorProps {
  backgroundColor?: string
  text?: string
}

const loading = (props: Props) => {
  const backgroundColor = props.backgroundColor
    ? props.backgroundColor
    : color.screen_primary
  const indicatorProps: ActivityIndicatorProps = { size: 'large', ...props }
  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor
      }}
    >
      <ActivityIndicator {...indicatorProps} />
      {props.text &&
        <Text style={TEXT}>{props.text}</Text>
      }
    </View>
  )
}

export default loading
