import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, ViewStyle } from 'react-native'
// @ts-ignore
import { DrawerItems, NavigationScreenProps } from 'react-navigation'
import Avatar from '../Components/Avatar'
import Icon from '../Components/Icon'
import { RootState } from '../Redux/Types'
import * as s from '../Themes/Constants'
import { Colors } from '../Themes'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center'
}

interface StateProps {
  username: string
}

type Props = StateProps & NavigationScreenProps

class Account extends Component<Props> {
  state = {  }

  navToSettings = () => {
    this.props.navigation.navigate('Account')
  }

  render() {
    return (
      <View style={CONTAINER}>
        <Icon style={{ position: 'absolute', top: 0, right: 20 }} color={Colors.charcoal} name='nut' onPress={this.navToSettings} size={24} />
        <View style={{ alignItems: 'center' }}>
          <Avatar style={{ width: 120, height: 120 }} self={true} />
          <Text style={{ ...s.H2, margin: 20 }}>{this.props.username}</Text>
        </View>
        <DrawerItems {...this.props} style={{ backgroundColor: 'blue' }} />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  username: `@${state.account.profile.value ? state.account.profile.value.username || 'uknown' : 'unknown'}`
})

export default connect(mapStateToProps, undefined)(Account)
