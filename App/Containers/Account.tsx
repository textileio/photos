import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, ViewStyle } from 'react-native'
import { DrawerItems, DrawerItemsProps } from 'react-navigation'
import Icon from '@textile/react-native-icon'
import Avatar from '../Components/Avatar'
import { RootState } from '../Redux/Types'
import { textStyle, color } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center'
}

interface StateProps {
  username: string
  showPhotos: boolean
}

type Props = StateProps & DrawerItemsProps

class Account extends Component<Props> {
  state = {  }

  navToSettings = () => {
    this.props.navigation.navigate('Account')
  }

  render() {
    const items = this.props.showPhotos ? this.props.items : this.props.items.filter((item) => item.key !== 'Photos')
    const props = { ...this.props, items }
    return (
      <View style={CONTAINER}>
        <Icon style={{ position: 'absolute', top: 11, right: 11 }} color={color.grey_0} name='nut' onPress={this.navToSettings} size={24} />
        <View style={{ alignItems: 'center' }}>
          <Avatar style={{ width: 120, height: 120 }} self={true} />
          <Text style={{ ...textStyle.header_l, margin: 20 }}>{props.username}</Text>
        </View>
        <DrawerItems {...props} />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  username: state.account.profile.value ? state.account.profile.value.name || state.account.profile.value.address : 'unknown',
  showPhotos: state.preferences.verboseUi
})

export default connect(mapStateToProps, undefined)(Account)
