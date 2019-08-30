import React from 'react'
import { SafeAreaView, View, ViewStyle } from 'react-native'
import { color, spacing } from '../../styles'

const PROGRESS_BAR: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

const DOT: ViewStyle = {
  margin: 3,
  height: 8,
  width: 8,
  backgroundColor: color.action_6,
  borderRadius: 4
}

const DOT_ACTIVE: ViewStyle = {
  backgroundColor: color.action_4
}

// Components

// Individual dot displayed at bottom of screen. Is highlighted when active.
interface DotProps {
  active: boolean
}

const Dot = (props: DotProps) => {
  return <View style={[DOT, props.active && DOT_ACTIVE]} />
}

interface ProgressBarProps {
  length: number
  active: number
}

// List of dots displayed at the bottom of the screen as a progress bar
export default function ProgressBar(props: ProgressBarProps) {
  return (
    <View style={PROGRESS_BAR}>
      {[...Array(props.length).keys()].map(i => {
        return <Dot key={i} active={i === props.active} />
      })}
    </View>
  )
}
