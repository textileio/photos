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
import PhotosNavigation from '../Navigation/PhotosNavigation'
import Upload from 'react-native-background-upload'
import PhotosNavigationService from '../Services/PhotosNavigationService'

class TextileManager extends React.PureComponent {
  constructor () {
    super()
    this.setup()
  }

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
    AppState.removeEventListener('change', this.props.appStateChange)
    this.progressSubscription.remove()
    this.completionSubscription.remove()
    this.errorSubscription.remove()
  }

  async setup () {
    // await PushNotificationIOS.requestPermissions()
    AppState.addEventListener('change', (event) => this.props.appStateChange(event))
    navigator.geolocation.watchPosition(() => this.props.locationUpdate(), null, { useSignificantChanges: true })
    this.progressSubscription = Upload.addListener('progress', null, (event) => this.props.uploadProgress(event))
    this.completionSubscription = Upload.addListener('completed', null, (event) => this.props.uploadComplete(event))
    this.errorSubscription = Upload.addListener('error', null, (event) => this.props.uploadError(event))
  }

  render () {
    return (
      <PhotosNavigation ref={navRef => { PhotosNavigationService.setTopLevelNavigator(navRef) }} />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appStateChange: event => { dispatch(TextileActions.appStateChange(event)) },
    locationUpdate: () => { dispatch(TextileActions.locationUpdate()) },
    uploadComplete: event => { dispatch(TextileActions.imageUploadComplete(event)) },
    uploadProgress: event => { dispatch(TextileActions.imageUploadProgress(event)) },
    uploadError: event => { dispatch(TextileActions.imageUploadError(event)) }
  }
}

export default connect(null, mapDispatchToProps)(TextileManager)
