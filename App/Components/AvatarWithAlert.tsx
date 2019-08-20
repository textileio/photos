import React from 'react'
import { View } from 'react-native'
import Avatar, { AvatarProps } from './Avatar'
import { color } from '../styles'

export interface AvatarAlertProps extends AvatarProps {
  active?: boolean
  size?: number
}

export default class AvatarWithAlert extends React.Component<AvatarAlertProps> {
  renderAlert = () => {
    if (!this.props.active) {
      return
    }
    const dimension = this.props.size || 8
    return (
      <View
        style={{
          width: dimension,
          height: dimension,
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: color.severe_4,
          borderRadius: dimension / 2
        }}
      />
    )
  }
  render() {
    return (
      <View>
        <Avatar {...this.props} />
        {this.renderAlert()}
      </View>
    )
  }
}
