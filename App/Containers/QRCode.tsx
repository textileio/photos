import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SafeAreaView, View, ViewStyle, Text, TextStyle } from 'react-native'
import QRCode from 'react-native-qrcode'

import { NavigationScreenProps } from 'react-navigation'
import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'

import { spacing, textStyle, color, fontFamily } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start'
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginTop: spacing._016,
  marginBottom: spacing._016,
  paddingHorizontal: spacing._016
}

const DESCRIPTION: TextStyle = {
  ...textStyle.body_m,
  marginBottom: spacing._024,
  paddingHorizontal: spacing._016
}

const QRCodeContainer: ViewStyle = {
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
  address?: string
  error?: string
}

type Props = StateProps & NavigationScreenProps

class QRCodeScreen extends Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const goBack = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Your QR Code'
    }
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <Text style={TITLE}>Your Account QR Code</Text>
        <Text style={DESCRIPTION}>
          This QR code stores your account address. Your friends can scan it to
          add you as a contact.
        </Text>
        {this.props.address && (
          <View style={QRCodeContainer}>
            <QRCode
              value={this.props.address}
              size={240}
              bgColor="transparent"
              fgColor="white"
            />
          </View>
        )}
        {this.props.error && (
          <Text style={ERROR}>
            Error loading your account address: {this.props.error}
          </Text>
        )}
        {!this.props.address && !this.props.error && (
          <Text style={ERROR}>
            Error: Your account address has not been loaded into the redux
            store.
          </Text>
        )}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    address: state.account.address.value,
    error: state.account.address.error
  }
}

export default connect(mapStateToProps)(QRCodeScreen)
