import React from 'react'
import { KeyboardAvoidingView, View, Text, Image, ViewStyle, TextStyle, ImageStyle, Clipboard, TextInput } from 'react-native'
import { connect } from 'react-redux'

import Button from '../Components/Button'

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
  color: s.COLOR_BRAND_RED,
  marginBottom: s.ITEM_SPACING_LARGE,
  height: s.FONT_LINE_HEIGHT_REGULAR * 4
}

interface OwnProps {
  onSuccess: () => void
}

interface StateProps {
  mnemonic?: string
}

type Props = OwnProps & StateProps

interface State {
  valid: boolean
}

const BUTTON_TEXT_COPY = 'Copy Mnemonic'
const BUTTON_TEXT_COPIED = 'Copied!'

class VerifyMnemonic extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false
    }
  }

  onChangeText = (text?: string) => {
    this.setState({
      valid: text === this.props.mnemonic
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
            Enter your mnemonic phrase below to prove that you saved it somewhere safe.
          </Text>
          <TextInput
            style={PHRASE}
            multiline={true}
            placeholder='Mnemonic phrase...'
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
    mnemonic: state.preferences.mnemonic
  }
}

export default connect(mapStateToProps, undefined)(VerifyMnemonic)
