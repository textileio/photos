import React from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, Clipboard, Dimensions, Linking } from 'react-native'
import { NavigationActions } from 'react-navigation'
import ImageSc from 'react-native-scalable-image'
import Toast, { DURATION } from 'react-native-easy-toast'
import VersionNumber from 'react-native-version-number'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import AuthActions from '../../../Redux/AuthRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import { getPeerId } from '../../../Redux/AccountSelectors'

import styles from './statics/styles'
import ContactModal from './ContactModal'
import { API } from '@textile/react-native-sdk'

const WIDTH = Dimensions.get('window').width

class UserProfile extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      contactModal: false,
      apiVersion: ''
    }
  }

  componentWillMount () {
    API.version().then((version) => {
      this.setState({
        apiVersion: version
      })
    })
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <TextileHeaderButtons>
          <TextileItem title='Back' iconName='chevron-bottom' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
        </TextileHeaderButtons>
      ),
      title: 'Settings'
    }
  }

  _notifications () {
    this.props.navigation.navigate('NotificationSettings')
  }
  _storage () {
    this.props.navigation.navigate('Storage')
  }
  _deviceLogs () {
    this.props.navigation.navigate('DeviceLogs')
  }
  _reduxState () {
    this.props.navigation.navigate('ReduxState')
  }
  _nodeLogs () {
    this.props.navigation.navigate('NodeLogsScreen')
  }
  _changeAvatar () {
    this.props.navigation.navigate('ChangeAvatar', { onSuccess: () => this.props.navigation.goBack() })
  }
  _peerId () {
    Clipboard.setString(this.props.peerId)
    this.refs.toast.show('Copied PeerId to Clipboard', DURATION.LENGTH_SHORT)
  }
  _contact () {
    this.setState({ contactModal: this.state.contactModal === false })
  }
  _recoveryPhrase () {
    this.props.navigation.navigate('RecoveryPhrase', {
      username: this.props.navigation.state.params.username
    })
  }
  _lockScreen () {
    // Todo: this kinda works, but you have to re-onboard with taking a profile picture
    // Also, there is no screen like "see you later!"
    this.props.lockScreen()
  }
  connectivity () {
    if (this.props.nodeRunning && this.props.online) {
      return (<View style={styles.servers}>
        <View style={styles.activeIcon} />
        <Text style={styles.serversText}>IPFS Node Started and Ready</Text>
      </View>)
    } else if (this.props.nodeRunning && !this.props.online) {
      return (<View style={styles.servers}>
        <View style={styles.activatingIcon} />
        <Text style={styles.serversText}>IPFS Node Started and Connecting</Text>
      </View>)
    } else {
      return (<View style={styles.servers}>
        <View style={styles.inActiveIcon} />
        <Text style={styles.serversText}>IPFS Node not started yet</Text>
      </View>)
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableWithoutFeedback
            style={styles.logoContainer}
            delayLongPress={3000}
            onLongPress={this.props.toggleVerboseUi}>
            <View style={styles.logoContainer}>
              <ImageSc width={83} source={require('./statics/textile-gray-logo.png')} />
              <Text style={styles.versionDescription}>
                {VersionNumber.appVersion} ({VersionNumber.buildVersion}) {this.state.apiVersion}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {this.connectivity()}
          <TouchableOpacity style={styles.listItemFirst} onPress={this._notifications.bind(this)}>
            <Text style={styles.listText}>Notifications</Text>
          </TouchableOpacity>
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._storage.bind(this)}>
            <Text style={styles.listText}>Storage</Text>
          </TouchableOpacity>}
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._deviceLogs.bind(this)}>
            <Text style={styles.listText}>Device Logs</Text>
          </TouchableOpacity>}
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._reduxState.bind(this)}>
            <Text style={styles.listText}>Redux</Text>
          </TouchableOpacity>}
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._nodeLogs.bind(this)}>
            <Text style={styles.listText}>Node Logs</Text>
          </TouchableOpacity>}
          <TouchableOpacity style={styles.listItem} onPress={this._changeAvatar.bind(this)}>
            <Text style={styles.listText}>Change Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._peerId.bind(this)}>
            <Text style={styles.listText}>Copy PeerId</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.listItem} onPress={this._recoveryPhrase.bind(this)}>
            <Text style={[styles.listText, styles.warning]}>Get Recovery Phrase</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.listItem} onPress={() => {
            Linking.openURL('https://github.com/textileio/textile-mobile/blob/master/PRIVACY.md')
          }}>
            <Text style={styles.listText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => {
            Linking.openURL('https://github.com/textileio/textile-mobile/blob/master/TERMS.md')
          }}>
            <Text style={styles.listText}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._contact.bind(this)}>
            <Text style={styles.listText}>Contact</Text>
          </TouchableOpacity>
        </View>

        <ContactModal height={200} width={WIDTH} onClose={this._contact.bind(this)} isVisible={this.state.contactModal} />

        <Toast ref='toast' position='center' />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  const online = state.textile.online
  const nodeRunning = state.textile.nodeState.state ? state.textile.nodeState.state === 'started' : false
  const verboseUi = state.preferences.verboseUi
  return {
    verboseUi,
    recoveryPhrase: state.account.recoveryPhrase || 'sorry, there was an error',
    peerId: getPeerId(state) || 'sorry, there was an error',
    online,
    nodeRunning
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    lockScreen: () => { dispatch(AuthActions.logOutRequest()) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
