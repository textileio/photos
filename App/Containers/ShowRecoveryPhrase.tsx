import React from 'react'
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle, Clipboard } from 'react-native'
import { connect } from 'react-redux'

import Button from '../Components/Button'
import { RootState } from '../Redux/Types'
import { color, textStyle, spacing, fontFamily } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: spacing._16,
  backgroundColor: color.screen_primary
}

const IMAGE: ImageStyle = {
  marginBottom: spacing._16
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginBottom: spacing._8
}

const SUBTITLE: TextStyle = {
  ...textStyle.body_l,
  marginBottom: spacing._16
}

const STRONG: TextStyle = {
  ...SUBTITLE,
  textTransform: 'uppercase',
  fontFamily: fontFamily.bold
}

const PHRASE: TextStyle = {
  ...textStyle.body_m,
  lineHeight: 18,
  textAlign: 'center',
  color: color.grey_4,
  marginBottom: spacing._16
}

interface StateProps {
  recoveryPhrase?: string
}

interface State {
  buttonText: string
}

const BUTTON_TEXT_COPY = 'Copy Recovery Phrase'
const BUTTON_TEXT_COPIED = 'Copied!'

class ShowRecoveryPhrase extends React.Component<StateProps, State> {

  constructor(props: StateProps) {
    super(props)
    this.state = {
      buttonText: BUTTON_TEXT_COPY
    }
  }

  copyRecoveryPhrase = () => {
    const { recoveryPhrase } = this.props
    if (recoveryPhrase) {
      Clipboard.setString(recoveryPhrase)
      this.setState({ buttonText: BUTTON_TEXT_COPIED })
      setTimeout(() => this.setState({ buttonText: BUTTON_TEXT_COPY }), 4000)
    }
  }

  render() {
    return (
      <View style={CONTAINER}>
        <Image style={IMAGE} source={require('../Containers/OnboardingScreen/statics/secure.png')} />
        <Text style={TITLE}>Important!</Text>
        <Text style={SUBTITLE}>
          Displayed below is your recovery phrase that uniquely identifies
          and encrypts your account. You <Text style={STRONG}>must</Text> save it somewhere safe. It is
          the only way to recover your account. No one, not even Textile,
          can help you if you loose it. Save it somewhere safe right now.
        </Text>
        <Text style={PHRASE}>{this.props.recoveryPhrase}</Text>
        <Button text={this.state.buttonText} onPress={this.copyRecoveryPhrase} />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    recoveryPhrase: state.account.recoveryPhrase
  }
}

export default connect(mapStateToProps, undefined)(ShowRecoveryPhrase)
