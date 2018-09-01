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
  progress: number
}

const ProgressBar = (props: IProgressBarProps) => {
  const { style, progress } = props
  const progressPercentage =  `${Math.max(progress, 0.02) * 100}%`
  return (
    <View style={{ ...TRACK, ...style }} >
      <View style={{ ...PROGRESS, width: progressPercentage }} />
    </View>
  )
}

export default ProgressBar
