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
import TextileEventsActions, {
  TextileInstanceState
} from '../Redux/TextileEventsRedux'
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

interface OwnProps {
  onSuccess: (flow: string) => void
}

interface StateProps {
  textileInstanceState: TextileInstanceState
  error?: string
}

interface DispatchProps {
  newAccount: () => void
  existingAccount: (seed: string) => void
}

type Props = OwnProps & DispatchProps & StateProps

interface State {
  newAccountModalIsVisible: boolean
  flow: string
}

class AccountScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      newAccountModalIsVisible: false,
      flow: ''
    }
  }

  // If the node is initialized, move to the next page in onboarding
  // If the node is initialized but onboarding isn't completed, the user
  // must have exited in the middle of creating a new account
  componentDidMount() {
    if (this.props.textileInstanceState === TextileInstanceState.initialized) {
      this.props.onSuccess(this.state.flow)
    }
  }

  componentDidUpdate() {
    if (this.props.textileInstanceState === TextileInstanceState.initialized) {
      this.props.onSuccess(this.state.flow)
    }
  }

  render() {
    const initializing =
      this.props.textileInstanceState === TextileInstanceState.initializing
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
          onPress={this.toggleNewAccountModal}
          disabled={initializing}
        >
          <Text>No</Text>
          <Text>I want to connect an existing account</Text>
        </TouchableOpacity>
        {this.props.error && <Text>{this.props.error}</Text>}
        <AccountSeedModal
          isVisible={this.state.newAccountModalIsVisible}
          complete={this.chooseExistingAccount}
          close={this.toggleNewAccountModal}
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

  toggleNewAccountModal = () => {
    this.setState(prevState => {
      return {
        newAccountModalIsVisible: !prevState.newAccountModalIsVisible
      }
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    textileInstanceState: state.textile.textileInstanceState.state,
    error: state.textile.textileInstanceState.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    newAccount: () => dispatch(TextileEventsActions.initializeNewAccount()),
    existingAccount: (seed: string) =>
      dispatch(TextileEventsActions.initializeExistingAccount(seed))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountScreen)
