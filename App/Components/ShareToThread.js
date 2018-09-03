import React from 'react'
import { View } from 'react-native'

import Nav from '../Navigation/ShareToThreadNavigation'

export default class ShareToThread extends React.Component {
  render () {
    return (
      <View style={{ height: 400 }}>
        <Nav screenProps={this.props} />
      </View>
    )
  }
}
