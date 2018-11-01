import React from 'react'
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle, Clipboard } from 'react-native'
import { connect } from 'react-redux'

import Button from './Button'

import * as s from '../Themes/Constants'
import { RootState } from '../Redux/Types'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const IMAGE: ImageStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  ...s.H2,
  marginBottom: s.ITEM_SPACING_REGULAR
}

const SUBTITLE: TextStyle = {
  ...s.H1,
  marginBottom: s.ITEM_SPACING_LARGE
}

const STRONG: TextStyle = {
  ...SUBTITLE,
  textTransform: 'uppercase',
  fontFamily: s.FONT_FAMILY_BOLD
}

const PHRASE: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR,
  fontSize: s.FONT_SIZE_REGULAR,
  lineHeight: s.FONT_LINE_HEIGHT_REGULAR,
  textAlign: 'center',
  color: s.COLOR_BRAND_RED,
  marginBottom: s.ITEM_SPACING_LARGE
}

interface StateProps {
  mnemonic?: string
}

interface State {
  buttonText: string
}

const BUTTON_TEXT_COPY = 'Copy Mnemonic'
const BUTTON_TEXT_COPIED = 'Copied!'

class ShowMnemonic extends React.Component<StateProps, State> {

  constructor(props: StateProps) {
    super(props)
    this.state = {
      buttonText: BUTTON_TEXT_COPY
    }
  }

  copyMnemonic = () => {
    const { mnemonic } = this.props
    if (mnemonic) {
      Clipboard.setString(mnemonic)
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
          Displayed below is your mnemonic phrase that uniquely identifies
          and encrypts your account. You <Text style={STRONG}>must</Text> save it somewhere safe. It is
          the only way to recover your account. No one, not even Textile,
          can help you if you loose it. Save it somewhere safe right now.
        </Text>
        <Text style={PHRASE}>{this.props.mnemonic}</Text>
        <Button text={this.state.buttonText} onPress={this.copyMnemonic} />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    mnemonic: state.preferences.mnemonic
  }
}

export default connect(mapStateToProps, undefined)(ShowMnemonic)
