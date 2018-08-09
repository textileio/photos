import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Button, Linking, Clipboard } from 'react-native'
import { Overlay, Icon } from 'react-native-elements'
import {getUniqueID} from 'react-native-device-info'
import Toast, {DURATION} from 'react-native-easy-toast'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles, {buttonColor1, buttonColor2, buttonColor3, buttonColor4} from './Styles/InfoViewStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'

class Settings extends React.PureComponent {

  static navigationOptions = {
    headerTitle: (<Text style={navStyles.headerTitle}>Settings</Text>)

  }

  constructor (props) {
    super(props)
    this.state = { }
  }

  handlePress () {
    Clipboard.setString(this.props.publicKey)
    this.refs.toast.show('Copied Public Key!', DURATION.LENGTH_SHORT)
  }
  handleMnemonic () {
    Clipboard.setString(this.props.mnemonic)
    this.refs.toast.show('Careful! Keep this 100% private!', 2500)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Thanks trying Textile Photos. We'd love to hear any thoughts or feedback you can offer. Use one of the links below to reach us on Telegram, Twitter, or via Email.
          </Text>
          <View style={styles.iconsRow} >
            <Icon
              reverse
              name='sc-telegram'
              type='evilicon'
              color={buttonColor1}
              onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')}
            />
            <Icon
              reverse
              name='sc-twitter'
              type='evilicon'
              color={buttonColor2}
              onPress={() => Linking.openURL('https://twitter.com/messages/compose?recipient_id=773578637320880128')}
            />
            <Icon
              reverse
              name='envelope'
              type='evilicon'
              color={buttonColor4}
              onPress={() => Linking.openURL('mailto:contact@textile.io')}
            />
          </View>
        </View>
        <View style={{fontSize: 8}}>
          <Button
            onPress={this.handlePress.bind(this)}
            title='COPY PUBLIC KEY TO CLIPBOARD'
            accessibilityLabel='copy public key to clipboard'
            color={'#2625FF'}
          />
          <Button
            onPress={this.handleMnemonic.bind(this)}
            title='PRIVATE MNEMONIC TO CLIPBOARD'
            accessibilityLabel='copy public key to clipboard'
            color={'#FF1c3F'}
          />
        </View>
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}



const mapStateToProps = (state, ownProps) => {
  return {
    mnemonic: state.preferences.mnemonic || 'sorry, there was an error',
    publicKey: state.preferences.publicKey || 'sorry, there was an error'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

