import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  SafeAreaView,
  View,
  ViewStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  Clipboard,
  Animated
} from 'react-native'

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

const ACCOUNT_SEED: TextStyle = {
  ...textStyle.body_l,
  textAlign: 'center',
  marginBottom: spacing._016,
  paddingHorizontal: spacing._032
}

const ACTION_CONTAINER: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start'
}

const FLASH: ViewStyle = {
  position: 'absolute',
  bottom: 20,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-end'
}

const FLASH_MESSAGE: TextStyle = {
  ...textStyle.body_s_medium,
  textAlign: 'center'
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

interface State {
  flashOpacity: Animated.Value
}

class AccountSeed extends Component<Props, State> {
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

  constructor(props: Props) {
    super(props)
    this.state = {
      flashOpacity: new Animated.Value(0)
    }
  }

  writeToClipboard = async () => {
    if (this.props.seed) {
      await Clipboard.setString(this.props.seed)
      // Animate in flash message, then hide it
      Animated.sequence([
        Animated.timing(this.state.flashOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.delay(750),
        Animated.timing(this.state.flashOpacity, {
          toValue: 0,
          duration: 300
        })
      ]).start()
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
            <Text style={ACCOUNT_SEED}>{this.props.seed}</Text>
            <View style={ACTION_CONTAINER}>
              <ActionText text="HOLD DOWN TO COPY" iconName="clipboard" />
            </View>
          </TouchableOpacity>
        )}
        {this.props.error && (
          <Text style={ERROR}>Error retrieving your account seed:</Text>
        )}
        {!this.props.seed && !this.props.error && (
          <Text style={ERROR}>
            Your account seed has not been loaded into the redux store.
          </Text>
        )}
        <Animated.View
          style={{
            ...FLASH,
            opacity: this.state.flashOpacity
          }}
        >
          <Text style={FLASH_MESSAGE}>COPIED</Text>
        </Animated.View>
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
