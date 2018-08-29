import React from 'react'
import { connect } from 'react-redux'
import { Share, View, ScrollView, Text, TouchableOpacity, Clipboard, Dimensions, Linking } from 'react-native'
import { NavigationActions } from 'react-navigation'
import ImageSc from 'react-native-scalable-image'
import Toast, {DURATION} from 'react-native-easy-toast'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import AuthActions from '../../../Redux/AuthRedux'
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
      headerRight: (
        <HeaderButtons>
          <Item
            title='Avatar'
            buttonWrapperStyle={{marginLeft: 11, marginRight: 11}}
            ButtonElement={
              <Avatar
                width={32}
                height={32}
                defaultSource={require('../Settings/statics/main-image.png')}
              />
            }
          />
        </HeaderButtons>
      )
    }
  }

  _settings () {
    this.props.navigation.navigate('Settings', {
      username: this.props.navigation.state.params.username
    })
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
    this.setState({contactModal: this.state.contactModal === false})
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
          <View style={styles.logoContainer}>
            <ImageSc width={83} source={require('./statics/textile-gray-logo.png')}/>
          </View>
          {this.connectivity()}
          <TouchableOpacity style={styles.listItemFirst} onPress={this._settings.bind(this)}>
            <Text style={styles.listText}>Settings</Text>
          </TouchableOpacity>
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
    mnemonic: state.preferences.mnemonic || 'sorry, there was an error',
    publicKey: state.preferences.publicKey || 'sorry, there was an error',
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
