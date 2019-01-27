import React, { Component } from 'react'
import Redux, { Dispatch } from 'redux'
import { View, StatusBar, ActivityIndicator, Platform, PermissionsAndroid, Text } from 'react-native'
import Modal from 'react-native-modal'
import { NavigationContainerComponent } from 'react-navigation'
import AppNavigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import NavigationService from '../Services/NavigationService'
import { RootState, RootAction } from '../Redux/Types'
import TriggersActions from '../Redux/TriggersRedux'
import MigrationScreen from '../Containers/MigrationScreen'

// Styles
import styles from './Styles/RootContainerStyles'

interface StateProps {
  showMigrationModal: boolean
  monitorLocation: boolean
  verboseUi: boolean
  overlayMessage: string
}

interface DispatchProps {
  locationUpdate: () => void
}

class RootContainer extends Component<StateProps & DispatchProps> {

  // TODO: Move all this location handling out of here!!!

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
    const hasPermission = await PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
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
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={barStyle} />
        <AppNavigation ref={(navRef: NavigationContainerComponent) => { NavigationService.setTopLevelNavigator(navRef) }} />
        {this.props.verboseUi &&
        <View style={styles.bottomOverlay} >
          <Text style={styles.overlayText}>{this.props.overlayMessage}</Text>
        </View>
        }
        <Modal isVisible={this.props.showMigrationModal} style={{ margin: 0 }}>
          <MigrationScreen />
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error
    : state.textileNode.nodeState.state
  const appState = state.textileNode.appState
  const overlayMessage = state.textileNode.appStateUpdate + ': ' + appState + ' | ' + nodeStatus

  return {
    showMigrationModal: state.migration.status === 'processing',
    monitorLocation: state.preferences.services.backgroundLocation.status,
    verboseUi: state.preferences.verboseUi,
    overlayMessage
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  locationUpdate: () => dispatch(TriggersActions.locationUpdate())
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
