import React from 'react'
import { KeyboardAvoidingView, Text } from 'react-native'
import Config from 'react-native-config'
import { NavigationScreenProps } from 'react-navigation'

import Input from '../SB/components/Input'
import Button from '../SB/components/Button'

interface Props extends NavigationScreenProps<{}> {

}

interface State {
  valid: boolean
  emailAddress?: string
  processing: boolean
  error?: string
  success?: string
}

export default class MailListSignupScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false,
      processing: false
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
      <KeyboardAvoidingView>
        <Text>If you'd like to receive periodic updates and information from Textile, enter your email address below.</Text>
        <Input
          label={'Email Address'}
          keyboardType='email-address'
          autoCapitalize='none'
          value={this.state.emailAddress}
          onChangeText={this.updateText}
        />
        <Button
          text='Subscribe'
          disabled={!this.state.valid}
          onPress={this.submit}
        />
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
        this.setState({ success: 'Success!'})
        // Set a timer and navigate
      } else {
        this.setState({ error: responseJson.title })
      }
    }
  }
}
