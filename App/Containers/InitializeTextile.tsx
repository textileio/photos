import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle
} from 'react-native'

import { RootState, RootAction } from '../Redux/Types'
import { initializationActions } from '../features/initialization'
import { TextileInstanceState } from '../features/initialization/models'
import AccountSeedModal from '../Components/AccountSeedModal'
import Icon from '@textile/react-native-icon'
import Loading from '../Components/Loading'

import { spacing, textStyle, size, color } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1
}

const OPTION: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: spacing._024
}

const DESCRIPTION: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start'
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginTop: spacing._016,
  marginBottom: spacing._008,
  paddingHorizontal: spacing._016
}

const HEADER: TextStyle = {
  ...textStyle.header_m,
  marginBottom: spacing._008,
  paddingHorizontal: spacing._016
}

const SUBHEADER: TextStyle = {
  ...textStyle.body_m,
  marginBottom: spacing._008,
  paddingHorizontal: spacing._016
}

const ICON: ViewStyle = {
  margin: spacing._016,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end'
}

interface StateProps {
  initializationState: TextileInstanceState
  error?: string
}

interface DispatchProps {
  newAccount: () => void
  existingAccount: (seed: string) => void
}

type Props = DispatchProps & StateProps

interface State {
  existingAccountModalIsVisible: boolean
  path: string
}

class InitializeTextile extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      existingAccountModalIsVisible: false,
      path: ''
    }
  }

  render() {
    const initializing =
      this.props.initializationState === TextileInstanceState.initializing
    return (
      <SafeAreaView style={CONTAINER}>
        <Text style={TITLE}>Are you new to Textile?</Text>
        <TouchableOpacity
          onPress={this.chooseNewAccount}
          disabled={initializing}
        >
          <View style={OPTION}>
            <View style={DESCRIPTION}>
              <Text style={HEADER}>Yes</Text>
              <Text style={SUBHEADER}>I want to make a new account</Text>
            </View>
            {initializing && this.state.path === 'newAccount' ? (
              <Loading color={color.grey_4} style={ICON} />
            ) : (
              <Icon style={ICON} name="plus" size={size._032} />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.toggleExistingAccountModal}
          disabled={initializing}
        >
          <View style={OPTION}>
            <View style={DESCRIPTION}>
              <Text style={HEADER}>No</Text>
              <Text style={SUBHEADER}>
                I want to connect an existing account
              </Text>
            </View>
            {initializing && this.state.path === 'existingAcount' ? (
              <Loading color={color.grey_4} style={ICON} />
            ) : (
              <Icon style={ICON} name="arrow-right" size={size._032} />
            )}
          </View>
        </TouchableOpacity>
        {this.props.error && <Text>{this.props.error}</Text>}
        <AccountSeedModal
          isVisible={this.state.existingAccountModalIsVisible}
          complete={this.chooseExistingAccount}
          close={this.toggleExistingAccountModal}
        />
      </SafeAreaView>
    )
  }

  chooseExistingAccount = (seed: string) => {
    this.setState({
      path: 'existingAccount'
    })
    this.props.existingAccount(seed)
  }

  chooseNewAccount = () => {
    this.setState({
      path: 'newAccount'
    })
    this.props.newAccount()
  }

  toggleExistingAccountModal = () => {
    this.setState(prevState => {
      return {
        existingAccountModalIsVisible: !prevState.existingAccountModalIsVisible
      }
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    initializationState: state.initialization.instance.state,
    error: state.initialization.instance.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    newAccount: () => dispatch(initializationActions.initializeNewAccount()),
    existingAccount: (seed: string) =>
      dispatch(initializationActions.initializeExistingAccount(seed))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitializeTextile)
