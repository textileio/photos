import React from 'react'
import {
  AppState,
  AppStateStatus,
  Linking,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import TriggersActions from '../Redux/TriggersRedux'
import UploadingImagesActions from '../Redux/UploadingImagesRedux'
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

  _handleOpenURL (link) {
    DeepLink.route(link, this.props.navigation)
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
    this.progressSubscription = Upload.addListener('progress', null, this.props.uploadProgress)
    this.completionSubscription = Upload.addListener('completed', null, this.handleUploadComplete.bind(this))
    this.cancelledSubscription = Upload.addListener('cancelled', null, this.props.uploadError)
    this.errorSubscription = Upload.addListener('error', null, this.props.uploadError)

    // TODO: will need aaron to revist this guy...
    // navigator.geolocation.watchPosition(() => this.props.locationUpdate(), null, { useSignificantChanges: true })
  }

  render () {
    return (
      <PhotosNavigation ref={navRef => { PhotosNavigationService.setTopLevelNavigator(navRef) }} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentAppState: state.textileNode.appState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appStateChange: (previousState: AppStateStatus, newState: AppStateStatus) => { dispatch(TextileNodeActions.appStateChange(previousState, newState)) },
    locationUpdate: () => { dispatch(TriggersActions.locationUpdate()) },
    uploadComplete: e => { dispatch(UploadingImagesActions.imageUploadComplete(e.id, e.responseCode, e.responseBody)) },
    uploadProgress: e => { dispatch(UploadingImagesActions.imageUploadProgress(e.id, e.progress)) },
    uploadError: e => { dispatch(UploadingImagesActions.imageUploadError(e.id, e.error || 'Cancelled')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextileManager)
