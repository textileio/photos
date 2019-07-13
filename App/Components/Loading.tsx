import React from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ActivityIndicatorProps,
  TextStyle,
  ViewStyle
} from 'react-native'

import { color, textStyle, spacing } from '../styles'

const TEXT: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_4,
  textAlign: 'center',
  marginTop: spacing._012
}

interface Props extends ActivityIndicatorProps {
  containerxStyle?: ViewStyle
  text?: string
}

export default function loading(props: Props) {
  const indicatorProps: ActivityIndicatorProps = { size: 'large', ...props }
  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: color.screen_primary,
        ...props.containerxStyle
      }}
    >
      <ActivityIndicator {...indicatorProps} />
      {props.text && <Text style={TEXT}>{props.text}</Text>}
    </View>
  )
}
