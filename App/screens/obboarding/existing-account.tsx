import React, { Component } from 'react'
import { View, Text } from 'react-native'

interface Props {}

export default class ExistingAccountOnboarding extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>{'Existing Account'}</Text>
      </View>
    )
  }
}
