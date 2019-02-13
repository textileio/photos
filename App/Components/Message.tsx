import React, { Component } from 'react'
import { View, Text } from 'react-native'

import Avatar from './Avatar'
import KeyValueText from './KeyValueText'
import * as s from '../Themes/Constants'

interface Props {
  avatar?: string
  username: string
  message: string
}

const Message = (props: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: s.SPACING_8 }}>
      <Avatar style={{ height: 30, width: 30 }} target={props.avatar} />
      <KeyValueText style={{ flex: 1, paddingLeft: s.SPACING_8 }} keyString={props.username} value={props.message} />
    </View>
  )
}

export default Message
