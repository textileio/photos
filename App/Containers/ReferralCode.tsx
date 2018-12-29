import React from 'react'
import { KeyboardAvoidingView, Image, Text, ViewStyle, ImageStyle, TextStyle, View } from 'react-native'
import Toast from 'react-native-easy-toast'

import Input from '../SB/components/Input'
import Button from '../Components/Button'
import * as s from '../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const IMAGE: ImageStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const ITEM: ViewStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  ...ITEM,
  ...s.H2
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...s.H1
}

const TEXT: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR,
  fontSize: s.FONT_SIZE_MEDIUM,
  color: s.COLOR_FONT_DARK_ON_LIGHT_DARK
}

const LABEL: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR
}

const LINK: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR,
  fontSize: s.FONT_SIZE_REGULAR,
  color: s.COLOR_GREY_MEDIUM,
  textDecorationLine: 'underline',
  textAlign: 'center'
}

interface Props {
  referralCode: string
  onSuccess?: () => void
}

interface State {
  valid: boolean
  referralCode?: string
  error?: string
}

export default class ReferralCode extends React.Component<Props, State> {

  toast?: Toast

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false
    }
  }

  updateText = (text: string) => {
    this.setState({
      referralCode: text,
      valid: text.trim().toLowerCase() === this.props.referralCode.trim().toLowerCase()
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
              style={ITEM}
            />
            <Text style={LINK} onPress={this.props.onSuccess}>Request a referral code</Text>
            <Toast
              ref={(toast) => { this.toast = toast ? toast : undefined }}
              position='center'
            />
          </View>
      </KeyboardAvoidingView>
    )
  }
}
