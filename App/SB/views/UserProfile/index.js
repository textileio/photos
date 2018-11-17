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
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'
import ContactModal from './ContactModal'

const WIDTH = Dimensions.get('window').width

class UserProfile extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      contactModal: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TextileHeaderButtons left>
          <TextileItem title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
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
  _changeAvatar () {
    const payload = {
      username: this.props.navigation.state.params.username
    }
    this.props.navigation.navigate('ChangeAvatar', payload)
  }
  _pubKey () {
    Clipboard.setString(this.props.publicKey)
    this.refs.toast.show('Copied Public Key to Clipboard', DURATION.LENGTH_SHORT)
  }
  _contact () {
    this.setState({ contactModal: this.state.contactModal === false })
  }
  _mnemonic () {
    this.props.navigation.navigate('Mnemonic', {
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
              <Text style={styles.versionDescription}>{VersionNumber.appVersion} ({VersionNumber.buildVersion})</Text>
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
          <TouchableOpacity style={styles.listItem} onPress={this._changeAvatar.bind(this)}>
            <Text style={styles.listText}>Change Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._pubKey.bind(this)}>
            <Text style={styles.listText}>Copy Public Key</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._mnemonic.bind(this)}>
            <Text style={[styles.listText, styles.warning]}>Get Mnemonic</Text>
          </TouchableOpacity>
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
  const online = state.textileNode && state.textileNode.online && state.textileNode.online ? state.textileNode.online : false
  const nodeRunning = state.textileNode && state.textileNode.nodeState ? state.textileNode.nodeState.state === 'started' : false

  return {
    verboseUi: state.preferences.verboseUi,
    mnemonic: state.preferences.mnemonic || 'sorry, there was an error',
    publicKey: state.preferences.publicKey || 'sorry, there was an error',
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
