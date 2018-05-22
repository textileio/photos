// @flow
import React from 'react'
import {
  Linking,
  Platform,
  AppState
} from 'react-native'
import { connect } from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import TextileActions from '../Redux/TextileRedux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import PhotosNavigation from '../Navigation/PhotosNavigation'
import Upload from 'react-native-background-upload'
import PhotosNavigationService from '../Services/PhotosNavigationService'

class TextileManager extends React.PureComponent {
  // TODO: This logic should be moved deeper into the stack
  _handleOpenURLEvent (event) {
    this._handleOpenURL(event.url)
  }
  // TODO: This logic should be moved deeper into the stack
  _handleOpenURL (url) {
    if (url) {
      const data = url.replace(/.*?:\/\//g, '')
      this.props.navigation.navigate('PairingView', {data: data})
    }
  }

  componentDidMount () {
    this.setup()
    this.props.appStateChange(this.props.currentAppState, AppState.currentState)
    BackgroundTask.schedule()
    // TODO: This logic should be moved deeper into the stack
    if (Platform.OS === 'android') {
      // TODO: Android deep linking isn't setup in the Java native layer
      Linking.getInitialURL().then(url => {
        this._handleOpenURL(url)
      })
    } else {
      Linking.addEventListener('url', this._handleOpenURLEvent.bind(this))
    }
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleNewAppState)
    this.progressSubscription.remove()
    this.completionSubscription.remove()
    this.cancelledSubscription.remove()
    this.errorSubscription.remove()
  }

  handleNewAppState (newAppState) {
    this.props.appStateChange(this.props.currentAppState, newAppState)
  }

  async setup () {
    // await PushNotificationIOS.requestPermissions()
    AppState.addEventListener('change', this.handleNewAppState.bind(this))
    navigator.geolocation.watchPosition(() => this.props.locationUpdate(), null, { useSignificantChanges: true })
    this.progressSubscription = Upload.addListener('progress', null, this.props.uploadProgress)
    this.completionSubscription = Upload.addListener('completed', null, this.props.uploadComplete)
    this.cancelledSubscription = Upload.addListener('cancelled', null, this.props.uploadCancelled)
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
    appStateChange: (previousState, newState) => { dispatch(IpfsNodeActions.appStateChange(previousState, newState)) },
    locationUpdate: () => { dispatch(TextileActions.locationUpdate()) },
    uploadComplete: event => { dispatch(TextileActions.imageUploadComplete(event)) },
    uploadProgress: event => { dispatch(TextileActions.imageUploadProgress(event)) },
    uploadCancelled: event => { dispatch(TextileActions.imageUploadCancelled(event)) },
    uploadError: event => { dispatch(TextileActions.imageUploadError(event)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextileManager)
