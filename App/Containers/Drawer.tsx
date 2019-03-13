import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ViewStyle } from 'react-native'
import { SafeAreaView, DrawerItemsProps } from 'react-navigation'
import Account from './Account'

const CONTAINER: ViewStyle = {
  flex: 1
}

class Drawer extends Component<DrawerItemsProps> {
  render() {
    return (
      <SafeAreaView style={CONTAINER} forceInset={{ top: 'always', horizontal: 'never' }}>
        <Account {...this.props} />
      </SafeAreaView>
    )
  }
}

export default connect(undefined, undefined)(Drawer)
