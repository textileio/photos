import React from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, Clipboard, Dimensions, Linking } from 'react-native'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'
import ImageSc from 'react-native-scalable-image'
import Toast from 'react-native-easy-toast'
import VersionNumber from 'react-native-version-number'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import PreferencesActions from '../../../Redux/PreferencesRedux'
import { getPeerId, getUsername } from '../../../Redux/AccountSelectors'

import styles from './statics/styles'
import ContactModal from './ContactModal'
import { API } from '@textile/react-native-sdk'
import { Dispatch } from 'redux'
import { RootAction, RootState } from '../../../Redux/Types'

const WIDTH = Dimensions.get('window').width

type Props = DispatchProps & StateProps & NavigationScreenProps<{}>
class UserProfile extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps<{}>) => {
    const goBack = () => { navigation.dispatch(NavigationActions.back()) }
    return {
      headerRight: (
        <TextileHeaderButtons>
          <TextileItem title='Back' iconName='chevron-bottom' onPress={goBack} />
        </TextileHeaderButtons>
      ),
      title: 'Settings'
    }
  }

  state = {
    contactModal: false,
    apiVersion: ''
  }
  toast?: Toast
  componentWillMount() {
    API.version().then((version) => {
      this.setState({
        apiVersion: version
      })
    })
  }

  _notifications = () => {
    this.props.navigation.navigate('NotificationSettings')
  }
  _storage = () => {
    this.props.navigation.navigate('Storage')
  }
  _deviceLogs = () => {
    this.props.navigation.navigate('DeviceLogs')
  }
  _nodeLogs = () => {
    this.props.navigation.navigate('NodeLogsScreen')
  }
  _changeAvatar = () => {
    this.props.navigation.navigate('ChangeAvatar', { onSuccess: () => this.props.navigation.goBack() })
  }
  _peerId = () => {
    Clipboard.setString(this.props.peerId)
    if (this.toast) {
      this.toast.show('Copied PeerId to Clipboard', 5000)
    }
  }
  _contact = () => {
    this.setState({ contactModal: this.state.contactModal === false })
  }
  _recoveryPhrase = () => {
    this.props.navigation.navigate('RecoveryPhrase', {
      username: this.props.name
    })
  }
  openPrivacy = () => {
    Linking.openURL('https://github.com/textileio/textile-mobile/blob/master/PRIVACY.md')
  }
  openTerms = () => {
    Linking.openURL('https://github.com/textileio/textile-mobile/blob/master/TERMS.md')
  }
  connectivity() {
    if (this.props.nodeRunning && this.props.online) {
      return (
        <View style={styles.servers}>
          <View style={styles.activeIcon} />
          <Text style={styles.serversText}>IPFS Node Started and Ready</Text>
        </View>
      )
    } else if (this.props.nodeRunning && !this.props.online) {
      return (
        <View style={styles.servers}>
          <View style={styles.activatingIcon} />
          <Text style={styles.serversText}>IPFS Node Started and Connecting</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.servers}>
          <View style={styles.inActiveIcon} />
          <Text style={styles.serversText}>IPFS Node not started yet</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableWithoutFeedback
            style={styles.logoContainer}
            delayLongPress={3000}
            onLongPress={this.props.toggleVerboseUi}
          >
            <View style={styles.logoContainer}>
              <ImageSc width={83} source={require('./statics/textile-gray-logo.png')} />
              <Text style={styles.versionDescription}>
                {VersionNumber.appVersion} ({VersionNumber.buildVersion}) {this.state.apiVersion}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {this.connectivity()}
          <TouchableOpacity style={styles.listItemFirst} onPress={this._notifications}>
            <Text style={styles.listText}>Notifications</Text>
          </TouchableOpacity>
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._storage}>
            <Text style={styles.listText}>Storage</Text>
          </TouchableOpacity>}
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._deviceLogs}>
            <Text style={styles.listText}>Device Logs</Text>
          </TouchableOpacity>}
          {this.props.verboseUi && <TouchableOpacity style={styles.listItem} onPress={this._nodeLogs}>
            <Text style={styles.listText}>Node Logs</Text>
          </TouchableOpacity>}
          <TouchableOpacity style={styles.listItem} onPress={this._changeAvatar}>
            <Text style={styles.listText}>Change Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._peerId}>
            <Text style={styles.listText}>Copy PeerId</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this.openPrivacy}>
            <Text style={styles.listText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this.openTerms}>
            <Text style={styles.listText}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._contact}>
            <Text style={styles.listText}>Contact</Text>
          </TouchableOpacity>
        </View>

        <ContactModal height={200} width={WIDTH} onClose={this._contact} isVisible={this.state.contactModal} />
        <Toast
          ref={(toast) => { this.toast = toast ? toast : undefined }}
          position='center'
        />
      </ScrollView>
    )
  }
}

interface StateProps {
  name?: string
  verboseUi: boolean
  recoveryPhrase: string
  peerId: string
  online: boolean
  nodeRunning: boolean
}
const mapStateToProps = (state: RootState): StateProps => {
  const online = state.textile.online
  const nodeRunning = state.textile.nodeState.state ? state.textile.nodeState.state === 'started' : false
  const verboseUi = state.preferences.verboseUi
  return {
    name: getUsername(state),
    verboseUi,
    recoveryPhrase: state.account.recoveryPhrase || 'sorry, there was an error',
    peerId: getPeerId(state) || 'sorry, there was an error',
    online,
    nodeRunning
  }
}

interface DispatchProps {
  toggleVerboseUi: () => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)