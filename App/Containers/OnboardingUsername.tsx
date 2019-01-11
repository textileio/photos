import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { KeyboardAvoidingView, Image, Text, ViewStyle, ImageStyle, TextStyle, View } from 'react-native'

import Input from '../SB/components/Input'
import Button from '../Components/Button'
import * as s from '../Themes/Constants'
import { RootAction, RootState } from '../Redux/Types'
import AccountActions from '../Redux/AccountRedux'

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
  color: s.COLOR_FONT_DARK_ON_LIGHT_DARK,
  height: s.FONT_LINE_HEIGHT_MEDIUM
}

const LABEL: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR
}

interface OwnProps {
  suggestion?: string
  onSuccess?: () => void
}

interface StateProps {
  processing: boolean
  buttonText: string
}

interface DispatchProps {
  submitUsername: (username: string) => void
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  valid: boolean
  username?: string
  error?: string
}

class OnboardingUsername extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false
    }
  }

  submit = () => {
    const { username } = this.state
    if (username) {
      this.props.submitUsername(username)
    }
    if (this.props.onSuccess) {
      setTimeout(this.props.onSuccess, 1000)
    }
  }

  componentDidMount = () => {
    if (this.props.suggestion) {
      this.updateText(this.props.suggestion)
    }
  }

  updateText = (text: string) => {
    this.setState({
      username: text,
      valid: this.valid(text)
    })
  }

  valid = (username?: string) => {
    if (!username) {
      return false
    }
    return username.length > 0
  }

  render () {
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
          <View>
            <Image style={IMAGE} source={require('../Containers/OnboardingScreen/statics/share.png')} />
            <Text style={TITLE}>Choose a display name</Text>
            <Text style={SUBTITLE}>It will be shown when you share, comment, or like a photo.</Text>
            <Input
              label={'Display name'}
              keyboardType='default'
              autoCapitalize='none'
              autoCorrect={false}
              inputStyle={TEXT}
              labelStyle={LABEL}
              value={this.state.username}
              onChangeText={this.updateText}
              wrapperStyle={ITEM}
            />
            <Button
              text={this.props.buttonText}
              disabled={!this.state.valid}
              processing={this.props.processing}
              onPress={this.submit}
              style={ITEM}
            />
          </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  processing: state.account.profile.processing,
  buttonText: state.account.profile.value && state.account.profile.value.username ? 'Success!' : 'Save'
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  submitUsername: (username: string) => dispatch(AccountActions.setUsernameRequest(username))
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingUsername)
