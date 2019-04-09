import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { KeyboardAvoidingView, Image, Text, ViewStyle, ImageStyle, TextStyle, View } from 'react-native'

import Input from '../SB/components/Input'
import Button from '../Components/LargeButton'
import { RootAction, RootState } from '../Redux/Types'
import AccountActions from '../Redux/AccountRedux'
import { color, textStyle, spacing, fontFamily } from '../styles'

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
  nextDisabled: boolean
  username?: string
  error?: string
}

class OnboardingUsername extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false,
      nextDisabled: false
    }
  }

  public submit = () => {
    const { username } = this.state
    if (username) {
      this.props.submitUsername(username)
    }
    // prevent double tap, disable for as long as onSuccess takes
    this.setState({
      nextDisabled: true
    })
    setTimeout(() => {
      this.setState({
        nextDisabled: false
      })
    }, 1000)

    if (this.props.onSuccess) {
      setTimeout(this.props.onSuccess, 1000)
    }
  }

  public componentDidMount = () => {
    if (this.props.suggestion) {
      this.updateText(this.props.suggestion)
    }
  }

  public updateText = (text: string) => {
    this.setState({
      username: text,
      valid: this.valid(text)
    })
  }

  public valid = (username?: string) => {
    if (!username) {
      return false
    }
    return username.length > 0
  }

  public render() {
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
              style={{ height: 40 }}
              inputStyle={TEXT}
              labelStyle={LABEL}
              value={this.state.username}
              onChangeText={this.updateText}
              wrapperStyle={ITEM}
            />
            <Button
              text={this.props.buttonText}
              disabled={!this.state.valid || this.state.nextDisabled}
              processing={this.props.processing}
              onPress={this.submit}
              style={BUTTON}
            />
          </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  processing: state.account.profile.processing,
  buttonText: state.account.profile.value && state.account.profile.value.name ? 'Success!' : 'Save'
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  submitUsername: (username: string) => dispatch(AccountActions.setUsernameRequest(username))
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingUsername)
