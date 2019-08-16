import React from 'react'
import { Dispatch } from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'

import Icon from '@textile/react-native-icon'

import { RootAction, RootState } from '../Redux/Types'

interface ScreenProps {
  size: number
  color: string
  alertColor: string
  name?: string
  alertName?: string
}

class NotificationsIcon extends React.Component<
  ScreenProps & StateProps
> {

  render() {
    const color = this.props.alert ? this.props.alertColor : this.props.color
    const name = this.props.alert ? (this.props.alertName || 'bell-alert') : (this.props.name || 'bell')
    return (
      <Icon name={name} size={this.props.size} color={color} />
    )
  }
}

interface StateProps {
  alert: boolean
}

function mapStateToProps(state: RootState): StateProps {
  const alert =
    Object.keys(state.cafes.cafes).length > 0

  return {
    alert
  }
}


export default connect(
  mapStateToProps,
  undefined
)(NotificationsIcon)
