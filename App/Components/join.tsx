import React, { Component } from 'react'
import { View, Text, ViewStyle, ImageStyle, TextStyle } from 'react-native'

import Avatar from './Avatar'
import { spacing, size, textStyle, color } from '../styles'

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  paddingLeft: spacing.screenEdge,
  paddingRight: spacing.screenEdge,
  paddingTop: spacing._012,
  paddingBottom: spacing._012,
  alignItems: 'center'
}

const AVATAR: ImageStyle = {
  height: size._024,
  width: size._024
}

const CONTENT: ViewStyle = {
  flex: 1,
  paddingLeft: spacing._008
}

const META: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline'
}

const USERNAME: TextStyle = {
  ...textStyle.body_m_bold
}

const MESSAGE: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_3
}


const TIME: TextStyle = {
  ...textStyle.body_xs,
  lineHeight: textStyle.body_xs.fontSize,
  paddingLeft: spacing._008,
  color: color.grey_3
}

interface Props {
  avatar?: string
  username: string
  message: string
  time: string
}

const Join = (props: Props) => {
  return (
    <View style={CONTAINER}>
      <Avatar style={AVATAR} target={props.avatar} />
      <View style={CONTENT}>
        <View style={META}>
          <Text style={USERNAME}>{props.username} <Text style={MESSAGE}>{props.message}</Text></Text>
          <Text style={TIME}>{props.time.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  )
}

export default Join
