import React, { Component } from 'react'
import { Dispatch } from 'redux'
import {
  View,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Text
} from 'react-native'
import { NavigationContainerComponent } from 'react-navigation'
import AppNavigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import NavigationService from '../Services/NavigationService'
import { RootState, RootAction } from '../Redux/Types'
import TriggersActions from '../Redux/TriggersRedux'

// Styles
import styles from './Styles/RootContainerStyles'

interface StateProps {
  nodeState: string
  showVerboseUi: boolean
}

class RootContainer extends Component<StateProps> {
  render() {
    const barStyle = Platform.OS === 'ios' ? 'dark-content' : 'light-content'
    const overlayMessage = this.props.nodeState
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={barStyle} />
        <AppNavigation
          ref={(navRef: NavigationContainerComponent) => {
            NavigationService.setTopLevelNavigator(navRef)
          }}
        />
        {this.props.showVerboseUi && (
          <View style={styles.bottomOverlay}>
            <Text style={styles.overlayText}>{overlayMessage}</Text>
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  let nodeState: string = state.textile.nodeState.state
  if (state.textile.nodeState.error) {
    nodeState = `${nodeState}: ${state.textile.nodeState.error}`
  }
  return {
    showVerboseUi:
      state.preferences.verboseUi &&
      state.preferences.verboseUiOptions.nodeStateOverlay,
    nodeState
  }
}

export default connect(mapStateToProps)(RootContainer)
