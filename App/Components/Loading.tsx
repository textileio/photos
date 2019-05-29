import React from 'react'
import { View, ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { color } from '../styles'

interface Props extends ActivityIndicatorProps {
  backgroundColor?: string
}

const loading = (props: Props) => {
  const backgroundColor = props.backgroundColor ? props.backgroundColor : color.screen_primary
  const indicatorProps: ActivityIndicatorProps = { size: 'large', ...props }
  return (
    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', backgroundColor }}>
      <ActivityIndicator {...indicatorProps} />
    </View>
  )
}

export default loading
