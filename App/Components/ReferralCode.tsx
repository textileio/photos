import React from 'react'
import { KeyboardAvoidingView, Image, Text, ViewStyle, ImageStyle, TextStyle, View, TouchableOpacity, Insets } from 'react-native'
import Toast from 'react-native-easy-toast'
import Modal from 'react-native-modal'

import Input from '../SB/components/Input'
import Button from './LargeButton'
import WaitListSignupScreen from './WaitListSignupScreen'
import { spacing, color, textStyle, fontFamily } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: spacing._016,
  backgroundColor: color.screen_primary
}

const IMAGE: ImageStyle = {
  marginBottom: spacing._016
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...textStyle.body_l
}

const TEXT: TextStyle = textStyle.body_l

const LABEL: TextStyle = {
  fontFamily: fontFamily.regular
}

const BUTTON: ViewStyle = {
  ...ITEM,
  alignSelf: 'center'
}

const LINK: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_4,
  textDecorationLine: 'underline',
  textAlign: 'center'
}

const HIT_SLOP: Insets = {
  top: spacing._016,
  left: spacing._016,
  bottom: spacing._016,
  right: spacing._016
}

interface Props {
  targetReferralCode: string
  referralCode?: string
  onSuccess?: () => void
}

interface State {
  valid: boolean
  referralCode?: string
  error?: string
  showWaitlistSignup: boolean
}

export default class ReferralCode extends React.Component<Props, State> {

  toast?: Toast

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: props.referralCode ? props.referralCode.trim().toLowerCase() === this.props.targetReferralCode.trim().toLowerCase() : false,
      showWaitlistSignup: false,
      referralCode: props.referralCode
    }
  }

  updateText = (text: string) => {
    this.setState({
      referralCode: text,
      valid: text.trim().toLowerCase() === this.props.targetReferralCode.trim().toLowerCase()
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

  render () {
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
          <View>
            <Image style={IMAGE} source={require('../Containers/OnboardingScreen/statics/secure.png')} />
            <Text style={TITLE}>Referral Code</Text>
            <Text style={SUBTITLE}>
              As we're ramping up Textile Photos, you'll need a referral code to proceed.
              {'\n\n'}
              Enter your referral code or request one below.
            </Text>
            <Input
              label={'Referral Code'}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              style={{ height: 40 }}
              inputStyle={TEXT}
              labelStyle={LABEL}
              onChangeText={this.updateText}
              value={this.state.referralCode}
              wrapperStyle={ITEM}
            />
            <Button
              text='Next'
              disabled={!this.state.valid}
              onPress={this.props.onSuccess}
              style={BUTTON}
            />
            <TouchableOpacity onPress={this.showWaitlistSignup} hitSlop={HIT_SLOP}>
              <Text style={LINK}>Request a referral code</Text>
            </TouchableOpacity>
            <Toast
              ref={(toast) => { this.toast = toast ? toast : undefined }}
              position='center'
            />
          </View>
          <Modal style={{ flex: 1, margin: 0 }} isVisible={this.state.showWaitlistSignup}>
            <WaitListSignupScreen onSuccess={this.hideWaitlistSignup} />
          </Modal>
      </KeyboardAvoidingView>
    )
  }
}
