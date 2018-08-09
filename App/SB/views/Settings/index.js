import React from 'react'
import { connect } from 'react-redux'
import { Switch, Image, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import AuthAction from '../../../Redux/AuthRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'

import { Button } from 'react-native-elements'
import PermissionsInfo from '../../components/PermissionsInfo'

import styles from './statics/styles'
import navStyles from '../UserProfile/statics/styles'
import { NavigationActions } from 'react-navigation'

class SyncPermissions extends React.PureComponent {
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

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const greeting = params.profile && params.profile.username ? 'Hello ' + params.profile.username : 'Hello'
    const src = params.profile && params.profile.avatar_id ? {uri: params.profile.avatar_id} : undefined
    return {
      headerLeft: (
        <TouchableOpacity onPress={ () => {
          navigation.dispatch(NavigationActions.back())
        }}>
          <View style={navStyles.toolbarBack}>
            <Image style={navStyles.toolbarBackIcon} source={require('../UserProfile/statics/icon-arrow-left.png')} />
          </View>
          <Text style={navStyles.toolbarUserName}>{ greeting }</Text>
          <Text style={navStyles.toolbarThreadsQty}>Your account</Text>
        </TouchableOpacity>),
      headerRight: (
        <TouchableOpacity>
          <Image style={navStyles.toolbarImage} source={require('./statics/main-image.png')} />
        </TouchableOpacity>
      )
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  toggleBackground () {
    this.props.triggerBackgroundLocationPermissions()
    this.setState({locationBackground: true, complete: this.state.cameraRoll})
  }

  hideInfo () {
    this.setState({infoVisible: false})
  }

  showInfo (infoFocus) {
    let info = {}
    switch (infoFocus) {
      case 'alwaysAllow':
        info = {
          title: 'Choose, Always Allow',
          details: 'In the location permission, please select, "Always Allow". It is needed by the app to periodically wake up and ensure you are getting updates to and from your peer network. Without it, the app will provide a lonely experience. We never collect, store, or share your location data.'
        }
        break
      case 'camera':
        info = {
          title: 'Camera Roll',
          details: 'Textile accesses your camera roll to import any new photos you take after you install the app. Without access to your camera roll, you will have no photos to view or share in the app. Photos added to Textile are privately encrypted - only visible to you ever - and hosted on IPFS. The only time they will ever be visible to anyone else is if you share them with your friends via our shared Threads feature.'
        }
        break
      case 'background':
      default:
        info = {
          title: 'Background location',
          details: 'Background location allows Textile to wake up periodically to check for updates to your camera roll and to check for updates on your peer-to-peer network. Without background location the app will never get any new information, it will be a pretty boring place. We never keep, store, process, or share your location data with anyone or any device.'
        }
    }
    this.setState({infoVisible: true, info})
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Everything can run a bit better with a few permissions</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <View>
                <Text style={styles.itemTitle}>Background Location</Text>
                <View style={styles.itemTexts}>
                  <Text style={styles.itemDescription}>Wakes app up for updates</Text>
                  <TouchableOpacity onPress={() => { this.showInfo('background') }}>
                    <ImageSc width={15} source={require('./statics/icon-info.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <Button title={'enable'} color={'#4a4a4a'} buttonStyle={styles.permissionsButtonStyle} onPress={this.toggleBackground.bind(this)} />
            </View>
          </View>
        </ScrollView>
        {this.state.infoVisible && <PermissionsInfo isVisible info={this.state.info} close={this.hideInfo.bind(this)} />}
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    profile: state.preferences.profile,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    triggerBackgroundLocationPermissions: () => { dispatch(AuthAction.requestBackgroundLocationPermissions()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncPermissions)
