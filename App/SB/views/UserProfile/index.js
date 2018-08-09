import React from 'react'
import { connect } from 'react-redux'
import { Share, View, Text, Image, TouchableOpacity, Clipboard, Dimensions, Linking } from 'react-native'
import { NavigationActions } from 'react-navigation'
import ImageSc from 'react-native-scalable-image'
import Toast, {DURATION} from 'react-native-easy-toast'
import AuthActions from '../../../Redux/AuthRedux'

import styles from './statics/styles'
import ContactModal from './ContactModal'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

class UserProfile extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      contactModal: false
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
          <View style={styles.toolbarBack}>
            <Image style={styles.toolbarBackIcon} source={require('./statics/icon-arrow-left.png')} />
          </View>
          <Text style={styles.toolbarUserName}>{ greeting }</Text>
          <Text style={styles.toolbarThreadsQty}><Text style={styles.strong}></Text>Your account</Text>
        </TouchableOpacity>),
      headerRight: (
        <TouchableOpacity>

          <Image style={styles.toolbarImage} source={require('../Settings/statics/main-image.png')}/>
        </TouchableOpacity>
      )
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  _settings () {
    this.props.navigation.navigate('Settings')
  }
  _pubKey () {
    Clipboard.setString(this.props.publicKey)
    this.refs.toast.show('Copied Public Key to Clipboard', DURATION.LENGTH_SHORT)
  }
  _contact () {
    this.setState({contactModal: this.state.contactModal === false})
  }
  _mnemonic () {
    Clipboard.setString(this.props.mnemonic)
    this.refs.toast.show('Copied, now be careful! Keep this 100% private!', 2500)
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
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.listItem} onPress={this._settings.bind(this)}>
            <Text style={styles.listText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._pubKey.bind(this)}>
            <Text style={styles.listText}>Copy Public Key</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._mnemonic.bind(this)}>
            <Text style={[styles.listText, styles.warning]}>Copy Mnemonic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => {
            Linking.openURL('https://github.com/textileio/textile-mobile/blob/master/PRIVACY.md')
          }}>
            <Text style={styles.listText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={this._contact.bind(this)}>
            <Text style={styles.listText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => {
            Share.share({
              title: 'Check out Textile Photos!',
              url: 'https://textile.photos/'
            })
          }}>
            <Text style={styles.listText}>Invite Friends!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => {
            Linking.openURL('https://textile.photos/')
          }}>
            <Text style={styles.listText}>Visit Textile</Text>
          </TouchableOpacity>
          {/*<TouchableOpacity style={styles.listItem} onPress={this._lockScreen.bind(this)}>*/}
            {/*<Text style={[styles.listText, styles.warning]}>Lock screen</Text>*/}
          {/*</TouchableOpacity>*/}
          {this.connectivity()}
          <View style={styles.logoContainer}>
            <ImageSc width={83} source={require('./statics/textile-gray-logo.png')}/>
          </View>
        </View>

        <ContactModal height={200} width={WIDTH} onClose={this._contact.bind(this)} isVisible={this.state.contactModal} />

        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const online = state.textileNode && state.textileNode.online && state.textileNode.online ? state.textileNode.online : false
  const nodeRunning = state.textileNode && state.textileNode.nodeState ? state.textileNode.nodeState.state === 'started' : false

  return {
    mnemonic: state.preferences.mnemonic || 'sorry, there was an error',
    publicKey: state.preferences.publicKey || 'sorry, there was an error',
    profile: state.preferences.profile,
    online,
    nodeRunning
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    lockScreen: () => { dispatch(AuthActions.logOutRequest()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
