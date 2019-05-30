import React from 'react'
import {
  KeyboardAvoidingView,
  Image,
  Text,
  ViewStyle,
  ImageStyle,
  TextStyle,
  View,
  TouchableOpacity,
  Insets
} from 'react-native'
import Toast from 'react-native-easy-toast'
import Config from 'react-native-config'
import { Buffer } from 'buffer'

import Input from '../SB/components/Input'
import Button from '../Components/LargeButton'
import { color, spacing, textStyle, fontFamily } from '../styles'
import { emailValid } from '../Services/email'

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
  onSuccess?: () => void
}

interface State {
  valid: boolean
  emailAddress?: string
  processing: boolean
  error?: string
  buttonText: string
}

export default class WaitListSignupScreen extends React.Component<
  Props,
  State
> {
  toast?: Toast

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false,
      processing: false,
      buttonText: 'Submit'
    }
  }

  submit = () => {
    this.postData()
  }

  updateText = (text: string) => {
    this.setState({
      emailAddress: text,
      valid: emailValid(text)
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
        <View>
          <Image
            style={IMAGE}
            source={require('../Containers/OnboardingScreen/statics/share.png')}
          />
          <Text style={TITLE}>Thanks for your interest!</Text>
          <Text style={SUBTITLE}>
            Enter your email address below, and we&apos;ll send you a referral
            code as soon as possible.
          </Text>
          <Input
            label={'Email Address'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ height: 40 }}
            inputStyle={TEXT}
            labelStyle={LABEL}
            value={this.state.emailAddress}
            onChangeText={this.updateText}
            wrapperStyle={ITEM}
          />
          <Button
            text={this.state.buttonText}
            disabled={!this.state.valid}
            processing={this.state.processing}
            onPress={this.submit}
            style={BUTTON}
          />
          <TouchableOpacity onPress={this.props.onSuccess} hitSlop={HIT_SLOP}>
            <Text style={LINK}>Cancel</Text>
          </TouchableOpacity>
          <Toast
            ref={toast => {
              this.toast = toast ? toast : undefined
            }}
            position="center"
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

  async postData() {
    if (this.state.emailAddress) {
      this.setState({ processing: true })
      const url = Config.RN_EMAIL_API_URL
      const body = {
        email: this.state.emailAddress,
        token: Config.RN_EMAIL_API_TOKEN
      }
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body)
        })
        const responseText = await response.text()
        this.setState({ processing: false })
        const validStatus = response.status >= 200 && response.status < 300
        if (validStatus) {
          this.setState({ buttonText: 'Success!', valid: false })
          // Set a timer and navigate
          if (this.props.onSuccess) {
            setTimeout(this.props.onSuccess, 1000)
          }
        } else {
          const error =
            responseText.length > 0 ? responseText : `${response.status}`
          this.setState({ error, buttonText: 'Retry', processing: false })
          if (this.toast) {
            this.toast.show(`Error: ${error}`, 2000)
          }
        }
      } catch (error) {
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        this.setState({
          error: message,
          buttonText: 'Retry',
          processing: false
        })
        if (this.toast) {
          this.toast.show(`Error: ${message}`, 2000)
        }
      }
    }
  }
}
