import React, { Component } from 'react'
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Insets
} from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import Modal from 'react-native-modal'
import { NavigationScreenProps } from 'react-navigation'

import Button from '../Components/SmallButton'
import WaitListSignupScreen from '../Components/WaitListSignupScreen'

import { RootAction } from '../Redux/Types'
import { spacing, textStyle, fontFamily, color, size } from '../styles'

const targetReferralCode = Config.RN_TEMPORARY_REFERRAL

const SAFE_AREA: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing._016,
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: color.screen_primary
}

const IMAGE: ImageStyle = {
  marginBottom: spacing._016,
  alignSelf: 'center'
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l,
  marginTop: spacing._016,
  textAlign: 'center',
  color: color.accent2_2
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...textStyle.body_l,
  color: color.grey_2
}

const TEXT_INPUT: TextStyle = {
  ...textStyle.body_l,
  color: color.grey_2,
  borderBottomColor: color.grey_4,
  borderBottomWidth: 1,
  marginBottom: spacing._004
}

const buttonColor = color.action_3

const BUTTON: ViewStyle = {
  ...ITEM,
  alignSelf: 'stretch',
  backgroundColor: buttonColor
}

const BUTTON_TEXT: TextStyle = {
  color: color.screen_primary
}

const BUTTON2: ViewStyle = {
  ...ITEM,
  alignSelf: 'stretch',
  backgroundColor: 'transparent',
  borderColor: buttonColor,
  borderWidth: 1
}

const BUTTON_TEXT2: TextStyle = {
  color: buttonColor
}

const LINK: TextStyle = {
  ...ITEM,
  ...textStyle.body_m,
  color: color.action_4
}

const HIT_SLOP: Insets = {
  top: spacing._004,
  left: spacing._016,
  bottom: spacing._016,
  right: spacing._016
}

interface OwnProps {
  referralCode?: string
}

interface DispatchProps {}

type Props = DispatchProps & OwnProps & NavigationScreenProps

interface State {
  valid: boolean
  referralCode?: string
  showWaitlistSignup: boolean
}

class Initialize extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid:
        (props.referralCode && props.referralCode.trim().toLowerCase()) ===
        targetReferralCode.trim().toLowerCase(),
      showWaitlistSignup: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { referralCode } = this.props
    if (referralCode && referralCode !== prevProps.referralCode) {
      this.updateText(referralCode)
    }
  }

  render() {
    return (
      <SafeAreaView style={SAFE_AREA}>
        <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
          <View style={{ flex: 1 }} />
          <View>
            <Text style={TITLE}>Welcome to Textile!</Text>
            <Image style={IMAGE} source={require('../Images/Icon_100.png')} />
            <Text style={SUBTITLE}>
              With Textile, you can securely share photos and messages with the
              people you care about while maintaining ownership of your data.
              {'\n\n'}
              Enter your referral code below to begin.
            </Text>
            <TextInput
              placeholder={'Referral Code...'}
              placeholderTextColor={color.grey_4}
              keyboardType="default"
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              style={TEXT_INPUT}
              onChangeText={this.updateText}
              value={this.state.referralCode}
            />
            <TouchableOpacity
              onPress={this.showWaitlistSignup}
              hitSlop={HIT_SLOP}
              style={{ alignSelf: 'flex-end' }}
            >
              <Text style={LINK}>Need a code?</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ alignSelf: 'center' }}>
            <Button
              text="Get Started"
              disabled={!this.state.valid}
              onPress={this.onNewAccount}
              style={BUTTON}
              textStyle={BUTTON_TEXT}
            />
            <Button
              text="Sync Existing Account"
              disabled={!this.state.valid}
              onPress={this.onExistingAccount}
              style={BUTTON2}
              textStyle={BUTTON_TEXT2}
            />
          </View>
          <View style={{ flex: 1 }} />
          <Modal
            style={{ flex: 1, margin: 0 }}
            isVisible={this.state.showWaitlistSignup}
          >
            <WaitListSignupScreen onSuccess={this.hideWaitlistSignup} />
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  updateText = (text: string) => {
    this.setState({
      referralCode: text,
      valid:
        text.trim().toLowerCase() === targetReferralCode.trim().toLowerCase()
    })
  }

  showWaitlistSignup = () => {
    this.setState({
      showWaitlistSignup: true
    })
  }

  hideWaitlistSignup = () => {
    this.setState({
      showWaitlistSignup: false
    })
  }

  onNewAccount = () => {
    this.props.navigation.navigate('OnboardingNew')
  }

  onExistingAccount = () => {
    this.props.navigation.navigate('OnboardingExisting')
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {}
}

export default connect(
  undefined,
  mapDispatchToProps
)(Initialize)
