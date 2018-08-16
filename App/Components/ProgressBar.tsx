import React from 'react'
import { View, Image, ViewStyle, ImageStyle } from 'react-native'

const TRACK: ViewStyle = {
  flex: 1,
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgb(220, 220, 220)',
  overflow: 'hidden'
}

const PROGRESS: ViewStyle = {
  height: 4,
  backgroundColor: 'blue'
}

export type ProgressBarProps = {
  style?: ViewStyle,
  progress: number
}

const ProgressBar = (props: ProgressBarProps) => {
  const { style, progress } = props
  const progressPercentage = progress * 100 + '%'
  return <View style={{...TRACK, ...style}} >
    <View style={{...PROGRESS, width: progressPercentage}} />
  </View>
}

export default ProgressBar