import React from 'react'
import { View, ViewStyle } from 'react-native'

import Colors from '../Themes/Colors'

const TRACK: ViewStyle = {
  width: '100%',
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgb(220, 220, 220)',
  overflow: 'hidden'
}

const PROGRESS: ViewStyle = {
  height: 4,
  backgroundColor: Colors.brandBlue
}

export interface IProgressBarProps {
  style?: ViewStyle
  lineColor?: string
  progress: number
}

const ProgressBar = (props: IProgressBarProps) => {
  const { style, progress, lineColor } = props
  const progressPercentage = `${Math.max(progress, 0.02) * 100}%`
  const progressStyle = lineColor
    ? { ...PROGRESS, backgroundColor: lineColor }
    : PROGRESS
  return (
    <View style={{ ...TRACK, ...style }}>
      <View style={{ ...progressStyle, width: progressPercentage }} />
    </View>
  )
}

export default ProgressBar
