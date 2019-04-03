import React, { Component } from 'react'
import { View, Text, ViewStyle, ImageStyle, TextStyle } from 'react-native'

import Avatar from './Avatar'
import { spacing, size, textStyle, color } from '../styles'

const CONTAINER = (alignItems: 'center' | 'flex-start'): ViewStyle => {
  return {
    flexDirection: 'row',
    alignItems,
    paddingLeft: spacing.screenEdge,
    paddingRight: spacing.screenEdge,
    paddingTop: spacing._016,
    paddingBottom: spacing._016
  }
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
  ...textStyle.body_m_bold,
  lineHeight: textStyle.body_m_bold.fontSize
}

const TIME: TextStyle = {
  ...textStyle.body_xs,
  lineHeight: textStyle.body_xs.fontSize,
  paddingLeft: spacing._008,
  color: color.grey_3
}

const MESSAGE: TextStyle = {
  ...textStyle.body_m,
  lineHeight: textStyle.body_m.fontSize! * 1.3
}

export interface Props {
  avatar?: string
  username: string
  message?: string
  time: string
  containerStyle?: ViewStyle
  isSameUser?: boolean
}

const Message = (props: Props) => {
  const alignItems = props.message ? 'flex-start' : 'center'
  return (
    <View style={[CONTAINER(alignItems), props.containerStyle, props.isSameUser && {paddingTop: 0}]}>
      {props.isSameUser && <View style={AVATAR} />}
      {!props.isSameUser && <Avatar style={AVATAR} target={props.avatar} />}
      <View style={CONTENT}>
        {!props.isSameUser &&
          <View style={META}>
            <Text style={USERNAME}>{props.username}</Text>
            <Text style={TIME}>{props.time.toUpperCase()}</Text>
          </View>
        }
        {props.message &&
          <Text style={MESSAGE}>{props.message}</Text>
        }
      </View>
    </View>
  )
}

export default Message
