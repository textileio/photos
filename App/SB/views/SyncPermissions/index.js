import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import AuthAction from '../../../Redux/AuthRedux'

import { Button } from 'react-native-elements'
import ButtonSB from '../../components/Button'
import PermissionsInfo from '../../components/PermissionsInfo'

import styles from './statics/styles'

class SyncPermissions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      complete: false,
      iOS: Platform.OS === 'ios',
      cameraRoll: false,
      locationBackground: false,
      infoVisible: false,
      info: { }
    }
  }

  toggleCamera () {
    this.props.triggerCameraPermissions()
    this.setState({ cameraRoll: true, complete: this.state.location })
    if (this.state.iOS) {
      this.showInfo('alwaysAllow')
    }
  }

  toggleBackground () {
    this.props.triggerBackgroundLocationPermissions()
    this.setState({ locationBackground: true, complete: this.state.cameraRoll })
  }

  hideInfo () {
    this.setState({ infoVisible: false })
  }

  showInfo (infoFocus) {
    let info = {}
    switch (infoFocus) {
      case 'alwaysAllow':
        info = {
          title: 'Choose, Always Allow',
          details: 'In the location permission, please select, "Always Allow". '
            + 'It is needed by the app to periodically wake up and ensure you are getting updates to and from your peer network. '
            + 'Without it, the app will provide a lonely experience. We never collect, store, or share your location data.'
        }
        break
      case 'camera':
        info = {
          title: 'Camera Roll',
          details: 'Textile accesses your camera roll to import any new photos you take after you install the app. '
            + 'Without access to your camera roll, you will have no photos to view or share in the app. '
            + 'Photos added to Textile are privately encrypted - only visible to you ever - and hosted on IPFS. '
            + 'The only time they will ever be visible to anyone else is if you share them with your friends via our shared Threads feature.'
        }
        break
      case 'background':
      default:
        info = {
          title: 'Background location',
          details: 'Background location allows Textile to wake up periodically to check for updates to your camera roll '
            + 'and to check for updates on your peer-to-peer network. Without background location the app will never get '
            + 'any new information, it will be a pretty boring place. We never keep, store, process, or share your location data with anyone or any device.'
        }
    }
    this.setState({ infoVisible: true, info })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ImageSc width={147} source={require('./statics/main-image.png')} />
          <Text style={styles.title}>To make everything run we need a few permissions</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <View>
                <Text style={styles.itemTitle}>Camera Roll</Text>
                <View style={styles.itemTexts}>
                  <Text style={styles.itemDescription}>Import new photos</Text>
                  <TouchableOpacity onPress={() => { this.showInfo('camera') }}>
                    <ImageSc width={15} source={require('./statics/icon-info.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <Button disabled={this.state.cameraRoll} title={!this.state.cameraRoll ? 'ok' : ''} buttonStyle={styles.permissionsButtonStyle} onPress={this.toggleCamera.bind(this)} />
            </View>
            <View style={styles.listItem}>
              <View>
                <Text style={styles.itemTitle}>Background Location</Text>
                <View style={styles.itemTexts}>
                  <Text style={styles.itemDescription}>Wakes app up periodically</Text>
                  <TouchableOpacity onPress={() => { this.showInfo('background') }}>
                    <ImageSc width={15} source={require('./statics/icon-info.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <Button
                disabled={!this.state.cameraRoll || this.state.locationBackground}
                title={this.state.locationBackground || !this.state.cameraRoll ? '' : 'ok'}
                color={'#4a4a4a'} buttonStyle={styles.permissionsButtonStyle}
                onPress={this.toggleBackground.bind(this)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <ButtonSB disabled={!this.state.complete} style={styles.button} text='Continue' onPress={() => { this.props.navigation.navigate('ProfilePic') }} />
        </View>
        {this.state.infoVisible && <PermissionsInfo isVisible info={this.state.info} close={this.hideInfo.bind(this)} />}
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    triggerCameraPermissions: () => { dispatch(AuthAction.requestCameraPermissions()) },
    triggerBackgroundLocationPermissions: () => { dispatch(AuthAction.requestBackgroundLocationPermissions()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncPermissions)
