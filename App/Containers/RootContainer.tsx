import React, { Component } from 'react'
import Redux, { Dispatch } from 'redux'
import { View, StatusBar, Platform, PermissionsAndroid, Text } from 'react-native'
import Modal from 'react-native-modal'
import { NavigationContainerComponent } from 'react-navigation'
import AppNavigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import NavigationService from '../Services/NavigationService'
import { RootState, RootAction } from '../Redux/Types'
import TriggersActions from '../Redux/TriggersRedux'

// Styles
import styles from './Styles/RootContainerStyles'

interface StateProps {
  monitorLocation: boolean
  nodeState: string
  showVerboseUi: boolean
}

interface DispatchProps {
  locationUpdate: () => void
}

class RootContainer extends Component<StateProps & DispatchProps> {
  handleNewPosition () {
    this.props.locationUpdate()
  }

  setupLocationMonitoring () {
    if (Platform.OS === 'android') {
      this.setupAndroid()
    } else {
      this.watchPosition()
    }
  }

  async setupAndroid() {
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (hasPermission) {
      this.watchPosition()
    }
  }

  watchPosition () {
    // Only watchPosition if the user has enabled it in settings
    if (this.props.monitorLocation) {
      navigator.geolocation.watchPosition(this.handleNewPosition.bind(this), undefined, { useSignificantChanges: true })
    }
  }

  componentDidMount () {
    this.setupLocationMonitoring()
  }

  render () {
    const barStyle = Platform.OS === 'ios' ? 'dark-content' : 'light-content'
    const overlayMessage = this.props.nodeState
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={barStyle} />
        <AppNavigation
          ref={(navRef: NavigationContainerComponent) => { NavigationService.setTopLevelNavigator(navRef) }}
        />
        {this.props.showVerboseUi &&
        <View style={styles.bottomOverlay} >
          <Text style={styles.overlayText}>{overlayMessage}</Text>
        </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    monitorLocation: state.preferences.services.backgroundLocation.status,
    showVerboseUi: state.preferences.verboseUi && state.preferences.verboseUiOptions.nodeStateOverlay,
    nodeState: state.textile.nodeState.state
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  locationUpdate: () => dispatch(TriggersActions.locationUpdate())
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
