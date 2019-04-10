import React from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, Clipboard } from 'react-native'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import HeaderButtons from 'react-navigation-header-buttons'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import Avatar from '../../../Components/Avatar'
import Button from '../../../Components/Button'

import styles from './statics/styles'
import { RootState } from '../../../Redux/Types'

type Props = StateProps & NavigationScreenProps<{}>
class RecoveryPhrase extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }) => {
    const goBack = () => { navigation.dispatch(NavigationActions.back()) }
    return {
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <TextileItem title='Back' iconName='arrow-left' onPress={goBack} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <HeaderButtons>
          <HeaderButtons.Item
            title='Avatar'
            buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
            ButtonElement={<Avatar style={{ width: 32, height: 32 }} />}
          />
        </HeaderButtons>
      )
    }
  }

  toast?: Toast
  _copyRecoveryPhrase = () => {
    Clipboard.setString(this.props.recoveryPhrase)
    if (this.toast) {
      this.toast.show('Copied, now be careful! Keep this 100% private!', 5000)
    }
  }

  render() {
    return (
      <View style={styles.subScreen}>
        <Image
          style={styles.headerImage}
          source={require('../../../Images/v2/permissions.png')}
        />
        <Text style={styles.subScreenText}>
          Your recovery phrase is the key to your
          entire account. Keep it totally
          secure. As it was created here
          on your device, no server has a
          copy of it or ever should.
        </Text>
        <Button text='Copy Recovery Phrase' onPress={this._copyRecoveryPhrase} />
        <Toast
          ref={(toast) => { this.toast = toast ? toast : undefined }}
          position='center'
        />
      </View>
    )
  }
}

interface StateProps {
  recoveryPhrase: string
  online: boolean
  nodeRunning: boolean
}
const mapStateToProps = (state: RootState): StateProps => {
  const online = state.textile && state.textile.online && state.textile.online ? state.textile.online : false
  const nodeRunning = state.textile && state.textile.nodeState ? state.textile.nodeState.state === 'started' : false

  return {
    recoveryPhrase: state.account.recoveryPhrase || 'sorry, there was an error',
    online,
    nodeRunning
  }
}

export default connect(mapStateToProps, undefined)(RecoveryPhrase)
