import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  SafeAreaView,
  View,
  ViewStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import Toast from 'react-native-easy-toast'
import QRCode from 'react-native-qrcode'

import { NavigationScreenProps } from 'react-navigation'
import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import ActionText from '../Components/action-text'

import { spacing, textStyle, color, fontFamily } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start'
}

const FULL_WIDTH: ViewStyle = {
  width: '100%'
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginTop: spacing._016,
  marginBottom: spacing._016,
  paddingHorizontal: spacing._016
}

const DESCRIPTION: TextStyle = {
  ...textStyle.body_m,
  marginBottom: spacing._016,
  paddingHorizontal: spacing._016
}

const BOLD: TextStyle = {
  fontFamily: fontFamily.bold
}

const QR_CODE_CONTAINER: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginBottom: spacing._016
}

const ACTION_CONTAINER: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start'
}

const ERROR: TextStyle = {
  ...textStyle.body_l,
  color: color.severe_3,
  marginBottom: spacing._016,
  paddingHorizontal: spacing._032
}

interface StateProps {
  seed?: string
  error?: string
}
type Props = StateProps & NavigationScreenProps

class AccountSeed extends Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const goBack = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Your Account Seed'
    }
  }

  toast?: Toast

  writeToClipboard = async () => {
    if (this.props.seed) {
      await Clipboard.setString(this.props.seed)
      // Show alert
      if (this.toast) {
        this.toast.show('Copied Account Seed to Clipboard', 3000)
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <Text style={TITLE}>This is Your Account Seed</Text>
        <Text style={DESCRIPTION}>
          <Text style={BOLD}>Keep it safe!</Text> This is the private key used
          by Textile to keep your data secure and initialize new account peers.
        </Text>
        {this.props.seed && (
          <TouchableOpacity
            style={FULL_WIDTH}
            onLongPress={this.writeToClipboard}
          >
            <View style={QR_CODE_CONTAINER}>
              <QRCode
                value={this.props.seed}
                size={240}
                bgColor="transparent"
                fgColor="white"
              />
            </View>
            <View style={ACTION_CONTAINER}>
              <ActionText text="HOLD DOWN TO COPY" iconName="clipboard" />
            </View>
          </TouchableOpacity>
        )}
        {this.props.error && (
          <Text style={ERROR}>
            Error retrieving your account seed: {this.props.error}
          </Text>
        )}
        {!this.props.seed && !this.props.error && (
          <Text style={ERROR}>
            Error: Your account seed has not been loaded into the redux store.
          </Text>
        )}
        <Toast
          ref={toast => {
            this.toast = toast ? toast : undefined
          }}
          position="center"
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    seed: state.account.accountSeed.value,
    error: state.account.accountSeed.error
  }
}

export default connect(mapStateToProps)(AccountSeed)
