import React from 'react'
import {
  AppState,
  AppStateStatus,
  Linking,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import TextileActions from '../Redux/TextileRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import PhotosNavigation from '../Navigation/PhotosNavigation'
import Upload from 'react-native-background-upload'
import PhotosNavigationService from '../Services/PhotosNavigationService'
import DeepLink from '../Services/DeepLink'

class TextileManager extends React.PureComponent {
  componentDidMount () {
    this.setup()
    BackgroundTask.schedule()
    // DeepLinking for Device Pairing
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this._handleOpenURL(url)
      })
    } else {
      Linking.addEventListener('url', this._handleOpenURLEvent.bind(this))
    }
  }

  _handleOpenURLEvent (event) {
    this._handleOpenURL(event.url)
  }

  _handleOpenURL (url) {
    if (url) {
      const data = DeepLink.getData(url)
      if (data.path === '/invites/device' && data.hash !== '') {
        // start pairing the new device
        this.props.navigation.navigate('PairingView', {request: DeepLink.getParams(data.hash)})
      } else if (data.path === '/invites/new' && data.hash !== '') {
        // invite the user to the thread
        this.props.navigation.navigate('ThreadInvite', {request: DeepLink.getParams(data.hash)})
      }
    }
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleNewAppState)
    this.progressSubscription.remove()
    this.completionSubscription.remove()
    this.cancelledSubscription.remove()
    this.errorSubscription.remove()
  }

  handleNewAppState (newAppState: AppStateStatus) {
    this.props.appStateChange(this.props.currentAppState, newAppState)
  }

  handleUploadComplete (event) {
    const {responseCode} = event
    if (responseCode >= 200 && responseCode < 300) {
      this.props.uploadComplete(event)
    } else {
      this.props.uploadError({...event, error: 'Response code: ' + responseCode})
    }
  }

  async setup () {
    // await PushNotificationIOS.requestPermissions()
    AppState.addEventListener('change', this.handleNewAppState.bind(this))
    navigator.geolocation.watchPosition(() => this.props.locationUpdate(), null, { useSignificantChanges: true })
    this.progressSubscription = Upload.addListener('progress', null, this.props.uploadProgress)
    this.completionSubscription = Upload.addListener('completed', null, this.handleUploadComplete.bind(this))
    this.cancelledSubscription = Upload.addListener('cancelled', null, this.props.uploadError)
    this.errorSubscription = Upload.addListener('error', null, this.props.uploadError)
  }

  render () {
    return (
      <PhotosNavigation ref={navRef => { PhotosNavigationService.setTopLevelNavigator(navRef) }} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentAppState: state.ipfs.appState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appStateChange: (previousState: AppStateStatus, newState: AppStateStatus) => { dispatch(TextileNodeActions.appStateChange(previousState, newState)) },
    locationUpdate: () => { dispatch(TextileActions.locationUpdate()) },
    uploadComplete: event => { dispatch(TextileActions.imageUploadComplete(event)) },
    uploadProgress: event => { dispatch(TextileActions.imageUploadProgress(event)) },
    uploadError: event => { dispatch(TextileActions.imageUploadError(event)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextileManager)
