import React, { Component } from 'react'
import { View, Text } from 'react-native'

interface Props {}

export default class NewAccountOnboarding extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>{'New Account'}</Text>
      </View>
    )
  }
}
