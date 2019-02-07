import React from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, Clipboard } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import AuthActions from '../../../Redux/AuthRedux'
import Avatar from '../../../Components/Avatar'
import Button from '../../../Components/Button'

import styles from './statics/styles'

class RecoveryPhrase extends React.PureComponent {
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
            buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
            ButtonElement={
              <Avatar style={{ width: 32, height: 32 }} />
            }
          />
        </HeaderButtons>
      )
    }
  }

  _copyRecoveryPhrase () {
    Clipboard.setString(this.props.recoveryPhrase)
    this.refs.toast.show('Copied, now be careful! Keep this 100% private!', 2500)
  }

  render () {
    return (
      <View style={styles.subScreen}>
        <Image
          style={styles.headerImage}
          source={require('../../../Images/v2/permissions.png')} />
        <Text style={styles.subScreenText}>
          Your recovery phrase is the key to your
          entire account. Keep it totally
          secure. As it was created here
          on your device, no server has a
          copy of it or ever should.
        </Text>
        <Button primary text='Copy Recovery Phrase' onPress={() => {
          this._copyRecoveryPhrase()
        }} />
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const online = state.textileNode && state.textile.online && state.textile.online ? state.textile.online : false
  const nodeRunning = state.textileNode && state.textile.nodeState ? state.textile.nodeState.state === 'started' : false

  return {
    recoveryPhrase: state.account.recoveryPhrase || 'sorry, there was an error',
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

export default connect(mapStateToProps, mapDispatchToProps)(RecoveryPhrase)
