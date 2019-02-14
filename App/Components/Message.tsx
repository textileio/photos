import React, { Component } from 'react'
import { View, Text } from 'react-native'

import Avatar from './Avatar'
import KeyValueText from './KeyValueText'
import { spacing, size } from '../styles'

interface Props {
  avatar?: string
  username: string
  message: string
}

const Message = (props: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.screenEdge }}>
      <Avatar style={{ height: size._024, width: size._024 }} target={props.avatar} />
      <KeyValueText style={{ flex: 1, paddingLeft: spacing._008 }} keyString={props.username} value={props.message} />
    </View>
  )
}

export default Message
