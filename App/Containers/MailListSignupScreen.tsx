import React from 'react'
import { KeyboardAvoidingView, Image, Text, ViewStyle, ImageStyle, TextStyle, View } from 'react-native'
import Config from 'react-native-config'

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
  onSuccess?: () => void
}

interface State {
  valid: boolean
  emailAddress?: string
  processing: boolean
  error?: string
  buttonText: string
}

export default class MailListSignupScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false,
      processing: false,
      buttonText: 'Subscribe'
    }
  }

  submit = () => {
    this.postData()
  }

  updateText = (text: string) => {
    this.setState({
      emailAddress: text,
      valid: this.emailValid(text)
    })
  }

  emailValid = (email?: string) => {
    if (!email) {
      return false
    }
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    const results = email.match(regexp)
    if (results && results.length > 0) {
      return true
    } else {
      return false
    }
  }

  render () {
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
          <View>
            <Image style={IMAGE} source={require('../Containers/OnboardingScreen/statics/share.png')} />
            <Text style={TITLE}>Keep in touch!</Text>
            <Text style={SUBTITLE}>If you'd like to receive periodic updates and information from Textile, enter your email address below.</Text>
            <Input
              label={'Email Address'}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
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
              style={ITEM}
            />
            <Text style={LINK} onPress={this.props.onSuccess}>No thanks</Text>
          </View>
      </KeyboardAvoidingView>
    )
  }

  async postData() {
    if (this.state.emailAddress) {
      this.setState({ processing: true })
      const baseUrl: string = Config.RN_MAILCHIMP_API_URL
      const listId: string = Config.RN_MAILCHIMP_LIST_ID
      const url = baseUrl + '/3.0/lists/' + listId + '/members'

      const apiKey: string = Config.RN_MAILCHIMP_API_KEY
      const credentialsString = 'user:' + apiKey
      const credentialsBase64 = new Buffer(credentialsString).toString('base64')

      const headers = new Headers()
      headers.append('Authorization', 'Basic ' + credentialsBase64)

      const body = {
        email_address: this.state.emailAddress,
        status: 'subscribed'
      }

      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
      const responseJson = await response.json()
      this.setState({ processing: false })
      const validStatus = responseJson.status >= 200 && responseJson.status < 300
      const memberExists = !validStatus && responseJson.title === 'Member Exists'
      if (validStatus || memberExists) {
        this.setState({ buttonText: 'Success!', valid: false })
        // Set a timer and navigate
        if (this.props.onSuccess) {
          setTimeout(this.props.onSuccess, 1000)
        }
      } else {
        this.setState({ error: responseJson.title })
      }
    }
  }
}
