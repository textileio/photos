import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle
} from 'react-native'

import { RootState, RootAction } from '../Redux/Types'
import { initializationActions } from '../features/initialization'
import { TextileInstanceState } from '../features/initialization/models'
import AccountSeedModal from '../Components/AccountSeedModal'

import { spacing, textStyle, color } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginTop: spacing._016,
  marginBottom: spacing._008,
  paddingHorizontal: spacing._016
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
  flow: string
}

class InitializeTextile extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      existingAccountModalIsVisible: false,
      flow: ''
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
          <Text>Yes</Text>
          <Text>I want to make a new account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.toggleExistingAccountModal}
          disabled={initializing}
        >
          <Text>No</Text>
          <Text>I want to connect an existing account</Text>
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
      flow: 'existingAccount'
    })
    this.props.existingAccount(seed)
  }

  chooseNewAccount = () => {
    this.setState({
      flow: 'newAccount'
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
