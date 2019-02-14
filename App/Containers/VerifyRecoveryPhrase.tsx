import React from 'react'
import { KeyboardAvoidingView, View, Text, Image, ViewStyle, TextStyle, ImageStyle, Clipboard, TextInput } from 'react-native'
import { connect } from 'react-redux'

import Button from '../Components/Button'
import { RootState } from '../Redux/Types'
import { color, spacing, textStyle, fontFamily } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: spacing._016,
  backgroundColor: color.screen_primary
}

const IMAGE: ImageStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginBottom: spacing._008
}

const SUBTITLE: TextStyle = {
  ...textStyle.body_l,
  marginBottom: spacing._016
}

const STRONG: TextStyle = {
  ...SUBTITLE,
  textTransform: 'uppercase',
  fontFamily: fontFamily.bold
}

const PHRASE: TextStyle = {
  ...textStyle.body_m,
  lineHeight: 18,
  color: color.grey_4,
  marginBottom: spacing._016,
  height: 18 * 4
}

interface OwnProps {
  onSuccess: () => void
}

interface StateProps {
  recoveryPhrase?: string
}

type Props = OwnProps & StateProps

interface State {
  valid: boolean
}

const BUTTON_TEXT_COPY = 'Copy Recovery Phrase'
const BUTTON_TEXT_COPIED = 'Copied!'

class VerifyRecoveryPhrase extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false
    }
  }

  onChangeText = (text?: string) => {
    this.setState({
      valid: text === this.props.recoveryPhrase
    })
  }

  // TODO: Clear Clipboard when this screen comes into focus

  render() {
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
        <View>
          <Image style={IMAGE} source={require('../Containers/OnboardingScreen/statics/secure.png')} />
          <Text style={TITLE}>Did you save it?</Text>
          <Text style={SUBTITLE}>
            Enter your recovery phrase below to prove that you saved it somewhere safe.
          </Text>
          <TextInput
            style={PHRASE}
            multiline={true}
            placeholder='Recovery phrase...'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.onChangeText}
          />
          <Button text={'Continue'} disabled={!this.state.valid} onPress={this.props.onSuccess} />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    recoveryPhrase: state.account.recoveryPhrase
  }
}

export default connect(mapStateToProps, undefined)(VerifyRecoveryPhrase)
